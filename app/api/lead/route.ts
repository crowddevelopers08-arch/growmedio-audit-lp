export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse, after } from "next/server";
import { isValidPhone } from "@/lib/countries";
import { SITE } from "@/lib/site";
import { createdOnStamp, normaliseNumber, postToTeleCRM } from "@/lib/telecrm";

/**
 * Booking-form leads.
 *
 * TeleCRM is the only system of record — there is no database and no
 * dashboard here. The lead is validated, answered immediately, and pushed to
 * TeleCRM after the response is flushed, so a slow CRM never makes the visitor
 * wait between the form and Razorpay's checkout.
 */

const FORM_NAME = "grow medico audit lp leads";

interface LeadInput {
  name: string;
  phone: string;
  dialCode: string;
  country: string;
  iso: string;
  pageUrl?: string;
}

const isValidName = (raw: string) =>
  raw.trim().length >= 2 && /^[a-zA-Z\s'.-]+$/.test(raw.trim());

function crmPayload(data: LeadInput) {
  const phone = normaliseNumber(data.dialCode, data.phone);

  return {
    fields: {
      Id: "",
      name: data.name.trim(),
      email: "",
      phone,
      message: `${SITE.price} Revenue Strategy Session enquiry`,
      Country: data.country?.trim() || "India",
      LeadID: "",
      CreatedOn: createdOnStamp(),
      "Lead Stage": "Stage 1 - Lead",
      "Lead Status": "new",
      "Lead Request Type": "strategy-session",
      PageName: FORM_NAME,
    },
    actions: [
      { type: "SYSTEM_NOTE", text: `Name: ${data.name.trim()}` },
      { type: "SYSTEM_NOTE", text: `Phone: +${phone}` },
      { type: "SYSTEM_NOTE", text: `Form: ${FORM_NAME}` },
      { type: "SYSTEM_NOTE", text: `Lead Source: ${data.pageUrl || FORM_NAME}` },
    ],
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    name = "",
    phone = "",
    dialCode = "",
    country = "",
    iso = "",
    pageUrl = "",
  } = body;

  if (!name.trim())
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!isValidName(name))
    return NextResponse.json({ error: "Name should contain letters only." }, { status: 400 });
  if (!isValidPhone(phone, iso))
    return NextResponse.json(
      { error: "Please enter a valid WhatsApp number." },
      { status: 400 }
    );

  const lead: LeadInput = {
    name: name.trim(),
    phone: phone.replace(/\D/g, ""),
    dialCode: dialCode || "91",
    country: country || "India",
    iso: iso || "IN",
    pageUrl: pageUrl.slice(0, 500) || undefined,
  };

  after(async () => {
    try {
      await postToTeleCRM(crmPayload(lead));
    } catch (err) {
      console.error("[lead TeleCRM] Error:", err instanceof Error ? err.message : err);
    }
  });

  return NextResponse.json({ success: true, queued: true }, { status: 201 });
}
