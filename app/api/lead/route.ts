export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { CHOICES, isValidSlot, slotToDate } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { isSlotFree } from "@/lib/slots";

/**
 * Saves the booking form as a Lead, before the client reaches payment — so a
 * clinic that abandons checkout is still in the dashboard to call back.
 */

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function normalisePhone(raw: string) {
  return raw.replace(/[\s\-()]/g, "").replace(/^\+?91(?=\d{10}$)/, "");
}

const isValidIndianPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
const isValidName = (name: string) => name.length >= 2 && /^[a-zA-Z\s'.-]+$/.test(name);
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

/** A dropdown answer is only accepted if it is one of the options we offer. */
const isChoice = (field: keyof typeof CHOICES, value: string) =>
  (CHOICES[field] as readonly string[]).includes(value);

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request body.");
  }

  const name = text(body.name, 80);
  const phone = normalisePhone(text(body.phone, 20));
  const email = text(body.email, 120);
  const clinicName = text(body.clinicName, 120);
  const city = text(body.city, 120);
  const specialty = text(body.specialty, 60);
  const enquiryHandler = text(body.enquiryHandler, 80);
  const adSpend = text(body.adSpend, 60);
  const monthlyRevenue = text(body.monthlyRevenue, 60);
  const decisionMaker = text(body.decisionMaker, 80);
  const goal = text(body.goal, 1000);
  const slotDate = text(body.slotDate, 10);
  const slotTime = text(body.slotTime, 5);
  const pageUrl = text(body.pageUrl, 500);

  // Step 1 — contact and clinic
  if (!name) return bad("Please enter your name.");
  if (!isValidName(name)) return bad("Name should contain letters only.");
  if (!phone) return bad("Please enter your phone number.");
  if (!isValidIndianPhone(phone))
    return bad("Please enter a valid 10-digit Indian mobile number.");
  if (email && !isValidEmail(email)) return bad("Please enter a valid email address.");
  if (!clinicName) return bad("Please enter your clinic or hospital name.");
  if (!city) return bad("Please enter your clinic's city and area.");

  // Step 2 — qualification
  if (!isChoice("specialty", specialty)) return bad("Please pick your primary speciality.");
  if (!isChoice("enquiryHandler", enquiryHandler))
    return bad("Please tell us who handles new patient enquiries.");
  if (!isChoice("adSpend", adSpend)) return bad("Please pick your monthly ad spend.");
  if (!isChoice("monthlyRevenue", monthlyRevenue))
    return bad("Please pick your approximate monthly revenue.");
  if (!isChoice("decisionMaker", decisionMaker))
    return bad("Please tell us who makes the final decision.");
  if (goal.length < 10)
    return bad("Please tell us in a sentence what you'd like to improve.");

  // Step 3 — slot
  if (!isValidSlot(slotDate, slotTime)) return bad("Please pick a session slot.");
  const slotAt = slotToDate(slotDate, slotTime);

  try {
    if (!(await isSlotFree(slotAt))) {
      return bad("That slot was just taken. Please pick another time.", 409);
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        clinicName,
        city,
        specialty,
        enquiryHandler,
        adSpend,
        monthlyRevenue,
        decisionMaker,
        goal,
        slotAt,
        pageUrl: pageUrl || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ leadId: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[lead] Could not save lead:", err instanceof Error ? err.message : err);
    return bad("We couldn't save your details. Please try again.", 500);
  }
}
