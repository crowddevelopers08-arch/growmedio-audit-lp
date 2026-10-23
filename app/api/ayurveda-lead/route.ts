export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse, after } from "next/server";
import { appendAyurvedaLeadToSheet } from "@/lib/googleSheets";
import { sendLeadToMeta } from "@/lib/meta";
import { prisma } from "@/lib/prisma";
import { createdOnStamp, postToTeleCRM } from "@/lib/telecrm";

/**
 * Free-session form on the Ayurveda funnel (/ayurveda). No payment step.
 *
 * Mirrors the homepage booking form (app/api/lead): the lead is validated,
 * saved to Neon (shown on /dashboard/ayurveda) and answered; TeleCRM, the
 * "Ayurveda Leads" Google Sheets tab and the Meta Conversions API get it after
 * the response is flushed, so the visitor goes straight to /ayurveda/thank-you.
 */

const FORM_NAME = "grow medico ayurveda lp leads";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Indian mobile → "91XXXXXXXXXX", or null if it isn't one. */
function indianMobile(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `91${d}` : null;
}

interface AyurvedaLeadInput {
  name: string;
  phone: string; // 91XXXXXXXXXX
  email: string;
  clinic: string;
  occupation: string;
  pageUrl?: string;
}

function crmPayload(lead: AyurvedaLeadInput) {
  return {
    fields: {
      Id: "",
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: `Free Ayurveda strategy session enquiry — ${lead.clinic} (${lead.occupation})`,
      Country: "India",
      LeadID: "",
      CreatedOn: createdOnStamp(),
      "Lead Stage": "Stage 1 - Lead",
      "Lead Status": "new",
      "Lead Request Type": "ayurveda-free-session",
      PageName: FORM_NAME,
    },
    actions: [
      { type: "SYSTEM_NOTE", text: `Name: ${lead.name}` },
      { type: "SYSTEM_NOTE", text: `Phone: +${lead.phone}` },
      { type: "SYSTEM_NOTE", text: `Email: ${lead.email}` },
      { type: "SYSTEM_NOTE", text: `Clinic / Hospital: ${lead.clinic}` },
      { type: "SYSTEM_NOTE", text: `Occupation: ${lead.occupation}` },
      { type: "SYSTEM_NOTE", text: `Form: ${FORM_NAME}` },
      { type: "SYSTEM_NOTE", text: `Lead Source: ${lead.pageUrl || FORM_NAME}` },
    ],
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const str = (k: string, max = 200) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const name = str("name");
  const email = str("email");
  const clinic = str("clinic");
  const occupation = str("occupation");
  const pageUrl = str("pageUrl", 500);
  const phone = indianMobile(str("phone", 30));
  // Browser pixel's Lead eventID, so the server event below is deduplicated against it.
  const eventId = /^[\w-]{8,80}$/.test(str("eventId", 80)) ? str("eventId", 80) : `ay_lead_${crypto.randomUUID()}`;

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Enter a valid 10-digit phone number." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (clinic.length < 2)
    return NextResponse.json({ error: "Please enter your clinic or hospital name." }, { status: 400 });
  if (occupation.length < 2) return NextResponse.json({ error: "Please enter your occupation." }, { status: 400 });

  const lead: AyurvedaLeadInput = { name, phone, email, clinic, occupation, pageUrl: pageUrl || undefined };

  // A database hiccup must never lose the lead: TeleCRM and the sheet below still get it.
  let leadId: string | null = null;
  try {
    const saved = await prisma.ayurvedaLead.create({
      data: { ...lead, pageUrl: lead.pageUrl ?? null },
      select: { id: true },
    });
    leadId = saved.id;
  } catch (err) {
    console.error("[ayurveda lead DB] Error:", err instanceof Error ? err.message : err);
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  after(async () => {
    const targets = ["TeleCRM", "Google Sheets", "Meta CAPI"];
    const results = await Promise.allSettled([
      postToTeleCRM(crmPayload(lead)),
      appendAyurvedaLeadToSheet(lead),
      sendLeadToMeta({
        eventId,
        contentName: "Ayurveda Free Strategy Session",
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        country: "in",
        sourceUrl: lead.pageUrl,
        clientIp,
        userAgent,
      }),
    ]);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const err = r.reason;
        console.error(`[ayurveda lead ${targets[i]}] Error:`, err instanceof Error ? err.message : err);
      }
    });
  });

  return NextResponse.json({ success: true, leadId, eventId }, { status: 201 });
}
