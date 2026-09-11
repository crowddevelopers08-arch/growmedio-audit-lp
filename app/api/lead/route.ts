export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = text(body.name, 80);
  const phone = normalisePhone(text(body.phone, 20));
  const email = text(body.email, 120);
  const city = text(body.city, 60);
  const specialty = text(body.specialty, 60);
  const pageUrl = text(body.pageUrl, 500);

  if (!name)
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!isValidName(name))
    return NextResponse.json({ error: "Name should contain letters only." }, { status: 400 });
  if (!phone)
    return NextResponse.json({ error: "Please enter your phone number." }, { status: 400 });
  if (!isValidIndianPhone(phone))
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian mobile number." },
      { status: 400 }
    );
  if (email && !isValidEmail(email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        city: city || null,
        specialty: specialty || null,
        pageUrl: pageUrl || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ leadId: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[lead] Could not save lead:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "We couldn't save your details. Please try again." },
      { status: 500 }
    );
  }
}
