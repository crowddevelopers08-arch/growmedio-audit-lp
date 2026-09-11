export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isPaid, syncOrderFromRazorpay } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

// The amount is decided here, on the server, and never taken from the client —
// otherwise a user could edit the request and pay ₹1 for the session.
function sessionAmountInPaise() {
  const rupees = Number(process.env.RAZORPAY_SESSION_AMOUNT);
  if (!Number.isFinite(rupees) || rupees <= 0) return null;
  return Math.round(rupees * 100);
}

function basicAuth(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

const notConfigured = () =>
  NextResponse.json(
    { error: "Payments are not configured yet. Please call us to book." },
    { status: 500 }
  );

async function createRazorpayOrder(
  amount: number,
  notes: Record<string, string>,
  keyId: string,
  keySecret: string
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, keySecret),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        // Razorpay caps receipt at 40 chars.
        receipt: `gm_session_${Date.now()}`.slice(0, 40),
        notes,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const order = await res.json();
    if (!res.ok) {
      throw new Error(order?.error?.description || `Razorpay HTTP ${res.status}`);
    }
    return order as { id: string; amount: number; currency: string };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("[Razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set");
    return notConfigured();
  }

  const amount = sessionAmountInPaise();
  if (amount === null) {
    console.error("[Razorpay] RAZORPAY_SESSION_AMOUNT is missing or invalid");
    return notConfigured();
  }

  let leadId = "";
  try {
    const body = await req.json();
    if (typeof body?.leadId === "string") leadId = body.leadId.slice(0, 40);
  } catch {
    // handled below
  }
  if (!leadId) {
    return NextResponse.json(
      { error: "Missing booking reference. Please fill in the form again." },
      { status: 400 }
    );
  }

  try {
    // Checkout details come from the saved lead, not the browser.
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { payments: { orderBy: { createdAt: "desc" } } },
    });
    if (!lead) {
      return NextResponse.json(
        { error: "We couldn't find your booking. Please fill in the form again." },
        { status: 404 }
      );
    }

    const paid = lead.payments.find((p) => isPaid(p.status));
    if (paid) {
      return NextResponse.json(
        { error: "This session is already paid.", alreadyPaid: true, orderId: paid.razorpayOrderId },
        { status: 409 }
      );
    }

    const prefill = { name: lead.name, email: lead.email ?? "", contact: `+91${lead.phone}` };

    // Razorpay lets an order be retried until it's paid, so reuse the open one
    // instead of creating a fresh order on every click.
    const open = lead.payments.find((p) => p.amount === amount);
    if (open) {
      // They may have paid and closed the tab before we heard back — check
      // with Razorpay before offering the same order again.
      const synced = await syncOrderFromRazorpay(open.razorpayOrderId).catch(() => null);
      if (synced && isPaid(synced.status)) {
        return NextResponse.json(
          { error: "This session is already paid.", alreadyPaid: true, orderId: open.razorpayOrderId },
          { status: 409 }
        );
      }

      return NextResponse.json({
        orderId: open.razorpayOrderId,
        amount: open.amount,
        currency: open.currency,
        keyId, // publishable key — safe to expose to the browser
        prefill,
      });
    }

    const order = await createRazorpayOrder(
      amount,
      {
        product: "Revenue Strategy Session",
        leadId: lead.id,
        name: lead.name,
        phone: `91${lead.phone}`,
        ...(lead.specialty ? { specialty: lead.specialty } : {}),
        // Razorpay rejects note values over 256 chars.
        ...(lead.pageUrl ? { source: lead.pageUrl.slice(0, 250) } : {}),
      },
      keyId,
      keySecret
    );

    await prisma.payment.create({
      data: {
        leadId: lead.id,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      prefill,
    });
  } catch (err) {
    console.error("[Razorpay create-order] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 502 }
    );
  }
}
