import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Booking-form leads (the `AuditLpLead` model, table `audit_lp_leads`).
 * Shared by the API routes, the dashboard page and its CSV export.
 */

export type { AuditLpLead as Lead, LeadPaymentStatus } from "@/generated/prisma/client";

export const FILTERS = [
  { key: "all", label: "All leads" },
  { key: "paid", label: "Paid" },
  { key: "unpaid", label: "Not paid" },
] as const;

export type FilterKey = (typeof FILTERS)[number]["key"];

export function parseFilter(value: string): FilterKey {
  return FILTERS.find((f) => f.key === value)?.key ?? "all";
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isLeadId = (value: unknown): value is string =>
  typeof value === "string" && UUID.test(value);

function leadWhere(filter: FilterKey, q: string): Prisma.AuditLpLeadWhereInput {
  const and: Prisma.AuditLpLeadWhereInput[] = [];

  if (filter === "paid") and.push({ paymentStatus: "paid" });
  if (filter === "unpaid") and.push({ paymentStatus: { not: "paid" } });

  if (q) {
    const digits = q.replace(/\D/g, "");
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { razorpayPaymentId: { contains: q } },
        { pageUrl: { contains: q, mode: "insensitive" } },
        ...(digits ? [{ phone: { contains: digits } }] : []),
      ],
    });
  }

  return { AND: and };
}

export function listLeads(opts: { filter: FilterKey; q: string; take: number; skip: number }) {
  return prisma.auditLpLead.findMany({
    where: leadWhere(opts.filter, opts.q),
    orderBy: { createdAt: "desc" },
    take: opts.take,
    skip: opts.skip,
  });
}

export function countLeads(filter: FilterKey, q: string) {
  return prisma.auditLpLead.count({ where: leadWhere(filter, q) });
}

/** Midnight today in India, as a UTC instant. */
function startOfTodayIST() {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}

/** Headline numbers for the dashboard. */
export async function leadStats() {
  const [total, today, paid, revenue] = await Promise.all([
    prisma.auditLpLead.count(),
    prisma.auditLpLead.count({ where: { createdAt: { gte: startOfTodayIST() } } }),
    prisma.auditLpLead.count({ where: { paymentStatus: "paid" } }),
    prisma.auditLpLead.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { amountPaise: true },
    }),
  ]);
  return { total, today, paid, revenuePaise: revenue._sum.amountPaise ?? 0 };
}

/**
 * Records a payment outcome on its lead — matched by Razorpay order id, or by
 * the `lead_id` note set in create-order. Both the verify route and the
 * webhook call this, so it is idempotent, and a failure never overwrites a
 * payment already marked paid.
 */
export async function markLeadPayment(p: {
  orderId: string;
  leadId?: string;
  paid: boolean;
  paymentId?: string;
  amountPaise?: number;
  method?: string;
}) {
  const lead = await prisma.auditLpLead.findFirst({
    where: {
      OR: [
        { razorpayOrderId: p.orderId },
        ...(isLeadId(p.leadId) ? [{ id: p.leadId }] : []),
      ],
    },
  });
  if (!lead) return;
  if (!p.paid && lead.paymentStatus === "paid") return;

  await prisma.auditLpLead.update({
    where: { id: lead.id },
    data: {
      paymentStatus: p.paid ? "paid" : "failed",
      razorpayOrderId: lead.razorpayOrderId ?? p.orderId,
      razorpayPaymentId: p.paymentId ?? lead.razorpayPaymentId,
      amountPaise: p.amountPaise ?? lead.amountPaise,
      paymentMethod: p.method ?? lead.paymentMethod,
      paidAt: p.paid ? (lead.paidAt ?? new Date()) : lead.paidAt,
    },
  });
}

const IST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const formatIST = (date: Date) => IST.format(date);

export const formatRupees = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/** utm_source / utm_campaign off the page URL, for "where did this come from". */
export function sourceOf(pageUrl: string | null) {
  if (!pageUrl) return null;
  try {
    const u = new URL(pageUrl);
    const src = u.searchParams.get("utm_source");
    const campaign = u.searchParams.get("utm_campaign");
    if (src || campaign) return [src, campaign].filter(Boolean).join(" · ");
    if (u.searchParams.get("fbclid")) return "facebook";
    if (u.searchParams.get("gclid")) return "google";
    return "direct";
  } catch {
    return null;
  }
}
