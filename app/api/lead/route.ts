export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse, after } from "next/server";
import { isValidPhone } from "@/lib/countries";
import { SITE } from "@/lib/site";

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

/** Full number without the "+", e.g. "919876543210" — the form TeleCRM wants. */
function fullNumber(data: LeadInput) {
  const dial = (data.dialCode || "91").replace(/\D/g, "");
  const digits = data.phone.replace(/\D/g, "");
  return `${dial}${digits}`;
}

async function sendToTeleCRM(data: LeadInput) {
  const endpoint = process.env.TELECRM_API_URL;
  if (!endpoint) throw new Error("TELECRM_API_URL is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const createdOn = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const payload = {
    fields: {
      Id: "",
      name: data.name.trim(),
      email: "",
      phone: fullNumber(data),
      message: `${SITE.price} Revenue Strategy Session enquiry`,
      Country: data.country?.trim() || "India",
      LeadID: "",
      CreatedOn: createdOn,
      "Lead Stage": "Stage 1 - Lead",
      "Lead Status": "new",
      "Lead Request Type": "strategy-session",
      PageName: FORM_NAME,
    },
    actions: [
      { type: "SYSTEM_NOTE", text: `Name: ${data.name.trim()}` },
      { type: "SYSTEM_NOTE", text: `Phone: +${fullNumber(data)}` },
      { type: "SYSTEM_NOTE", text: `Form: ${FORM_NAME}` },
      { type: "SYSTEM_NOTE", text: `Lead Source: ${data.pageUrl || FORM_NAME}` },
    ],
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TELECRM_API_KEY}`,
        "X-Client-ID": "grow-medico-website",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) return { status: "success" };

    const text = await res.text();
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error("TeleCRM returned an HTML response — check the API URL");
    }

    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || `TeleCRM HTTP ${res.status}`);
    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err instanceof Error ? err : new Error(String(err));
  }
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
      await sendToTeleCRM(lead);
    } catch (err) {
      console.error("[lead TeleCRM] Error:", err instanceof Error ? err.message : err);
    }
  });

  return NextResponse.json({ success: true, queued: true }, { status: 201 });
}
