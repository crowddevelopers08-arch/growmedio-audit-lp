export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { recordPayment, type RazorpayPayment } from "@/lib/payments";

// Razorpay signs `order_id|payment_id` with the key secret. Recomputing it here
// is what proves the success callback really came from Razorpay and was not
// faked by the browser.
function signatureMatches(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Look the payment up on Razorpay itself, so its real status, method and
// payer details are saved rather than trusted from the browser.
async function fetchPayment(paymentId: string, keyId: string, keySecret: string) {
  const auth = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: auth },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Razorpay HTTP ${res.status}`);
  return (await res.json()) as RazorpayPayment;
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const orderId = body.razorpay_order_id || "";
  const paymentId = body.razorpay_payment_id || "";
  const signature = body.razorpay_signature || "";

  if (typeof orderId !== "string" || typeof paymentId !== "string" ||
      typeof signature !== "string" || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Incomplete payment details." }, { status: 400 });
  }

  if (!signatureMatches(orderId, paymentId, signature, keySecret)) {
    console.error("[Razorpay verify] Signature mismatch for order", orderId);
    return NextResponse.json(
      { verified: false, error: "We could not verify this payment." },
      { status: 400 }
    );
  }

  try {
    const payment = await fetchPayment(paymentId, keyId, keySecret);

    if (payment.order_id !== orderId) {
      return NextResponse.json(
        { verified: false, error: "We could not verify this payment." },
        { status: 400 }
      );
    }

    await recordPayment(payment);

    if (payment.status !== "captured" && payment.status !== "authorized") {
      return NextResponse.json(
        { verified: false, error: `Payment is ${payment.status}. Please try again.` },
        { status: 400 }
      );
    }
  } catch (err) {
    // The signature already proves the payment is genuine. If the lookup or
    // the database write failed, the thank-you page re-checks the order with
    // Razorpay and records it there.
    console.error("[Razorpay verify] Could not record payment:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ verified: true, orderId, paymentId });
}
