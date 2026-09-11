import { PaymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/** The fields we read off a Razorpay payment entity. */
export interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string; // created | authorized | captured | refunded | failed
  method?: string;
  email?: string;
  contact?: string;
  error_description?: string | null;
  created_at?: number;
  notes?: Record<string, string>;
}

/** Statuses that mean the client has paid for their session. */
export const PAID_STATUSES: PaymentStatus[] = [PaymentStatus.CAPTURED, PaymentStatus.AUTHORIZED];

export const isPaid = (status: PaymentStatus) => PAID_STATUSES.includes(status);

const FROM_RAZORPAY: Record<string, PaymentStatus> = {
  authorized: PaymentStatus.AUTHORIZED,
  captured: PaymentStatus.CAPTURED,
  failed: PaymentStatus.FAILED,
};

// Higher rank wins. An order that was paid on a retry still carries its
// earlier failed attempts — re-checking it must never un-pay it.
const RANK: Record<PaymentStatus, number> = {
  CREATED: 0,
  FAILED: 1,
  AUTHORIZED: 2,
  CAPTURED: 3,
};

/** The payment that best describes a lead: paid beats failed beats opened. */
export function primaryPayment<T extends { status: PaymentStatus }>(payments: T[]) {
  return [...payments].sort((a, b) => RANK[b.status] - RANK[a.status])[0];
}

function paymentFields(entity: RazorpayPayment, status: PaymentStatus) {
  return {
    status,
    razorpayPaymentId: entity.id,
    amount: entity.amount,
    currency: entity.currency,
    method: entity.method || null,
    email: entity.email || null,
    contact: entity.contact || null,
    errorReason:
      status === PaymentStatus.FAILED ? entity.error_description || "Payment failed" : null,
    paidAt: isPaid(status)
      ? new Date((entity.created_at ?? Math.floor(Date.now() / 1000)) * 1000)
      : null,
  };
}

/**
 * Save a Razorpay payment against its order. Safe to call repeatedly — the
 * verify route, the thank-you page and create-order can all record the same
 * payment.
 */
export async function recordPayment(entity: RazorpayPayment) {
  const status = FROM_RAZORPAY[entity.status];
  if (!status) return null;

  const existing = await prisma.payment.findUnique({
    where: { razorpayOrderId: entity.order_id },
  });

  if (!existing) {
    // No row for this order — attach it to the lead recorded in the order
    // notes, if there is one.
    const leadId = entity.notes?.leadId;
    if (!leadId) return null;
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } });
    if (!lead) return null;
    return prisma.payment.create({
      data: { leadId, razorpayOrderId: entity.order_id, ...paymentFields(entity, status) },
    });
  }

  if (RANK[status] < RANK[existing.status]) return existing;

  return prisma.payment.update({
    where: { id: existing.id },
    data: paymentFields(entity, status),
  });
}

/**
 * Ask Razorpay for an order's payments and save the most relevant one.
 *
 * There's no webhook, so this is how a payment gets recorded when the
 * browser's verify call never reached us (tab closed mid-payment, network
 * drop, a failed database write).
 */
export async function syncOrderFromRazorpay(orderId: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  const res = await fetch(
    `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Razorpay HTTP ${res.status}`);

  const { items = [] } = (await res.json()) as { items?: RazorpayPayment[] };
  const best =
    items.find((p) => p.status === "captured") ??
    items.find((p) => p.status === "authorized") ??
    items.find((p) => p.status === "failed");

  return best ? recordPayment(best) : null;
}
