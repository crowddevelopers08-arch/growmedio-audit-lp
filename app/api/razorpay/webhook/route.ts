export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendPurchaseToMeta } from "@/lib/meta";
import { createdOnStamp, postToTeleCRM } from "@/lib/telecrm";

/**
 * Razorpay calls this endpoint server-to-server once a payment settles.
 *
 * It is the reliable half of the flow: the browser callback in
 * BookingProvider is lost if the client closes the tab mid-payment, but this
 * still fires — so a paid session always reaches TeleCRM.
 *
 * Configure in Razorpay → Settings → Webhooks:
 *   URL     https://<your-domain>/api/razorpay/webhook
 *   Secret  RAZORPAY_WEBHOOK_SECRET
 *   Events  payment.captured, payment.failed
 */

interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  email?: string;
  contact?: string;
  created_at?: number;
  notes?: Record<string, string>;
}

function signatureMatches(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const rupees = (paise: number) => (paise / 100).toFixed(2);

const payerName = (p: RazorpayPayment) => p.notes?.name?.trim() || "Razorpay customer";
const payerPhone = (p: RazorpayPayment) =>
  (p.notes?.phone || p.contact || "").replace(/^\+/, "");
const payerCountry = (p: RazorpayPayment) => p.notes?.country?.trim() || "India";

function crmPayload(payment: RazorpayPayment, event: string) {
  const paid = event === "payment.captured";
  const amount = `${payment.currency} ${rupees(payment.amount)}`;
  const phone = payerPhone(payment);

  return {
    fields: {
      Id: "",
      name: payerName(payment),
      email: payment.email || "",
      phone,
      message: paid
        ? `Paid Revenue Strategy Session – ${amount} (Payment ${payment.id})`
        : `Failed payment for Revenue Strategy Session – ${amount} (Payment ${payment.id})`,
      Country: payerCountry(payment),
      LeadID: "",
      CreatedOn: createdOnStamp(),
      "Lead Stage": paid ? "Stage 2 - Paid Session" : "Stage 2 - Payment Failed",
      "Lead Status": "new",
      "Lead Request Type": "strategy-session-payment",
      PageName: "grow medico audit lp payment",
    },
    actions: [
      { type: "SYSTEM_NOTE", text: `Payment status: ${paid ? "Captured" : "Failed"}` },
      { type: "SYSTEM_NOTE", text: `Amount: ${amount}` },
      { type: "SYSTEM_NOTE", text: `Name: ${payerName(payment)}` },
      { type: "SYSTEM_NOTE", text: `Phone: ${phone ? `+${phone}` : "Not specified"}` },
      { type: "SYSTEM_NOTE", text: `Razorpay Payment ID: ${payment.id}` },
      { type: "SYSTEM_NOTE", text: `Razorpay Order ID: ${payment.order_id}` },
      { type: "SYSTEM_NOTE", text: `Method: ${payment.method || "Not specified"}` },
      {
        type: "SYSTEM_NOTE",
        text: `Lead Source: ${payment.notes?.source || "growmedico-audit-lp"}`,
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // The signature covers the exact bytes Razorpay sent, so the raw text must be
  // read before any JSON parsing.
  const rawBody = await req.text();

  if (!signatureMatches(rawBody, signature, secret)) {
    console.error("[Razorpay webhook] Signature mismatch — request rejected");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let body: { event?: string; payload?: { payment?: { entity?: RazorpayPayment } } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event = body.event || "";
  const payment = body.payload?.payment?.entity;

  // Anything we don't act on is acknowledged with 200 so Razorpay stops retrying.
  if (event !== "payment.captured" && event !== "payment.failed") {
    return NextResponse.json({ received: true, ignored: event }, { status: 200 });
  }
  if (!payment?.id) {
    return NextResponse.json({ received: true, ignored: "no payment entity" }, { status: 200 });
  }

  let crm: "ok" | "failed" = "ok";
  try {
    await postToTeleCRM(crmPayload(payment, event));
  } catch (err) {
    crm = "failed";
    console.error(
      "[Razorpay webhook TeleCRM] Error:",
      err instanceof Error ? err.message : err
    );
  }

  // Server-side Purchase, deduplicated against the browser's event by id.
  // Only a captured payment is a conversion.
  let meta: "ok" | "failed" | "skipped" = "skipped";
  if (event === "payment.captured") {
    try {
      const result = await sendPurchaseToMeta({
        eventId: `purchase_${payment.id}`,
        value: Number(rupees(payment.amount)),
        currency: payment.currency || "INR",
        name: payment.notes?.name,
        phone: payerPhone(payment),
        email: payment.email,
        country: payment.notes?.iso,
        sourceUrl: payment.notes?.source,
      });
      meta = "skipped" in result && result.skipped ? "skipped" : "ok";
    } catch (err) {
      meta = "failed";
      console.error(
        "[Razorpay webhook Meta CAPI] Error:",
        err instanceof Error ? err.message : err
      );
    }
  }

  // Always 200 on a verified event. Returning an error makes Razorpay retry,
  // which would duplicate a record that already went through.
  return NextResponse.json(
    { received: true, event, paymentId: payment.id, crm, meta },
    { status: 200 }
  );
}
