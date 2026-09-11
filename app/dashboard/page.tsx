import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PaymentStatus, Prisma } from "@/generated/prisma/client";
import { ctaClass } from "@/components/ui/CtaButton";
import Logo from "@/components/ui/Logo";
import { formatCount, formatIST, formatPaise, paymentMethodLabel } from "@/lib/format";
import { PAID_STATUSES, primaryPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads Dashboard — Grow Medico",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 50;

const FILTERS = [
  { key: "all", label: "All leads" },
  { key: "paid", label: "Paid" },
  { key: "unpaid", label: "Not paid" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];
type SearchParams = Record<string, string | string[] | undefined>;

const BADGES: Record<PaymentStatus | "NONE", { label: string; className: string }> = {
  CAPTURED: { label: "Paid", className: "border-[rgba(22,212,146,0.35)] bg-brand-wash text-brand" },
  AUTHORIZED: { label: "Authorized", className: "border-[rgba(242,184,75,0.35)] bg-gold-wash text-gold" },
  FAILED: { label: "Failed", className: "border-[rgba(255,107,107,0.3)] bg-danger-wash text-danger" },
  CREATED: { label: "Checkout opened", className: "border-line-strong bg-surface-2 text-dim" },
  NONE: { label: "Not paid", className: "border-line text-faint" },
};

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

function dashboardHref({ filter, q, page }: { filter: FilterKey; q: string; page?: number }) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}

/** Path + query of the page the form was sent from — keeps UTM tags visible. */
function sourceLabel(url: string) {
  try {
    const { pathname, search } = new URL(url);
    return `${pathname}${search}`;
  } catch {
    return url;
  }
}

async function loadDashboard({ filter, q, page }: { filter: FilterKey; q: string; page: number }) {
  const conditions: Prisma.LeadWhereInput[] = [];
  const paid = { some: { status: { in: PAID_STATUSES } } };

  if (filter === "paid") conditions.push({ payments: paid });
  if (filter === "unpaid") conditions.push({ payments: { none: { status: { in: PAID_STATUSES } } } });

  if (q) {
    const digits = q.replace(/\D/g, "");
    conditions.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { specialty: { contains: q, mode: "insensitive" } },
        ...(digits ? [{ phone: { contains: digits } }] : []),
        {
          payments: {
            some: {
              OR: [
                { razorpayPaymentId: { contains: q } },
                { razorpayOrderId: { contains: q } },
              ],
            },
          },
        },
      ],
    });
  }

  const where: Prisma.LeadWhereInput = { AND: conditions };

  const [leads, matching, totalLeads, paidLeads, revenue] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { payments: { orderBy: { updatedAt: "desc" } } },
    }),
    prisma.lead.count({ where }),
    prisma.lead.count(),
    prisma.lead.count({ where: { payments: paid } }),
    prisma.payment.aggregate({ where: { status: "CAPTURED" }, _sum: { amount: true } }),
  ]);

  return { leads, matching, totalLeads, paidLeads, revenue: revenue._sum.amount ?? 0 };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filter: FilterKey = FILTERS.find((f) => f.key === first(sp.filter))?.key ?? "all";
  const q = first(sp.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  const data = await loadDashboard({ filter, q, page }).catch((err) => {
    console.error("[dashboard] Query failed:", err instanceof Error ? err.message : err);
    return null;
  });

  if (!data) {
    return (
      <Shell>
        <div className="rounded-[18px] border border-[rgba(255,107,107,0.3)] bg-danger-wash p-6 text-[0.95rem] text-danger">
          Couldn&apos;t load leads from the database. Check that{" "}
          <code className="font-mono">DATABASE_URL</code> is set and the schema has
          been applied (<code className="font-mono">npm run db:migrate</code>).
        </div>
      </Shell>
    );
  }

  const { leads, matching, totalLeads, paidLeads, revenue } = data;
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const conversion = totalLeads ? Math.round((paidLeads / totalLeads) * 100) : 0;
  const from = matching ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, matching);

  return (
    <Shell>
      <div className="grid grid-cols-2 gap-3 min-[900px]:grid-cols-5">
        <Stat label="Total leads" value={formatCount(totalLeads)} />
        <Stat label="Paid" value={formatCount(paidLeads)} accent />
        <Stat label="Not paid" value={formatCount(totalLeads - paidLeads)} />
        <Stat label="Conversion" value={`${conversion}%`} />
        <Stat label="Revenue collected" value={formatPaise(revenue)} accent />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter leads" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={dashboardHref({ filter: f.key, q })}
              aria-current={f.key === filter ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-[0.85rem] transition-colors ${
                f.key === filter
                  ? "border-brand bg-brand-wash text-brand"
                  : "border-line-strong text-dim hover:text-ink"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>

        <form method="get" className="flex w-full gap-2 min-[760px]:w-auto">
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, email, payment ID…"
            className="min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 py-2 text-[0.88rem] text-ink outline-none placeholder:text-faint focus:border-brand min-[760px]:w-[320px]"
          />
          <button type="submit" className={ctaClass({ size: "sm" })}>
            Search
          </button>
        </form>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[18px] border border-line bg-surface">
        <table className="w-full min-w-[1040px] border-collapse text-left text-[0.86rem]">
          <thead className="border-b border-line text-[0.72rem] tracking-[0.04em] text-faint uppercase">
            <tr>
              {["Submitted", "Lead", "Contact", "Clinic", "Payment", "Razorpay IDs", "Paid on"].map(
                (heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 font-medium">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-dim">
                  {q || filter !== "all"
                    ? "No leads match these filters."
                    : "No leads yet — they appear here as soon as someone submits the booking form."}
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const payment = primaryPayment(lead.payments);
                const badge = BADGES[payment?.status ?? "NONE"];

                return (
                  <tr key={lead.id} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-dim">
                      {formatIST(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{lead.name}</div>
                      {lead.pageUrl && (
                        <div
                          className="mt-0.5 max-w-[200px] truncate text-[0.75rem] text-faint"
                          title={lead.pageUrl}
                        >
                          {sourceLabel(lead.pageUrl)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="whitespace-nowrap">
                        <a href={`tel:+91${lead.phone}`} className="text-ink hover:text-brand">
                          +91 {lead.phone}
                        </a>
                        <span className="text-faint"> · </span>
                        <a
                          href={`https://wa.me/91${lead.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline"
                        >
                          WhatsApp
                        </a>
                      </div>
                      <div className="mt-0.5 break-all text-dim">{lead.email ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-ink">{lead.specialty ?? "—"}</div>
                      <div className="mt-0.5 text-faint">{lead.city ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {payment && (
                        <div className="mt-1 whitespace-nowrap text-dim">
                          {formatPaise(payment.amount, payment.currency)}
                          {payment.method ? ` · ${paymentMethodLabel(payment.method)}` : ""}
                        </div>
                      )}
                      {payment?.status === "FAILED" && payment.errorReason && (
                        <div className="mt-1 max-w-[220px] text-[0.75rem] text-danger">
                          {payment.errorReason}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[0.75rem]">
                      {payment ? (
                        <>
                          <div className="text-dim">{payment.razorpayPaymentId ?? "—"}</div>
                          <div className="mt-0.5 text-faint">{payment.razorpayOrderId}</div>
                        </>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-dim">
                      {payment?.paidAt ? formatIST(payment.paidAt) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-dim">
        <span>
          {matching ? `Showing ${from}–${to} of ${formatCount(matching)}` : "No results"}
        </span>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={dashboardHref({ filter, q, page: page - 1 })}
                className={ctaClass({ variant: "ghost", size: "sm" })}
              >
                ← Previous
              </Link>
            )}
            <span className="px-2">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link
                href={dashboardHref({ filter, q, page: page + 1 })}
                className={ctaClass({ variant: "ghost", size: "sm" })}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh]">
      <header className="border-b border-line bg-bg-alt">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Grow Medico — home">
              <Logo height={36} />
            </Link>
            <span className="hidden border-l border-line pl-4 font-display text-[1rem] font-semibold min-[560px]:inline">
              Leads dashboard
            </span>
          </div>
          <Link href="/" className={ctaClass({ variant: "ghost", size: "sm" })}>
            View site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <h1 className="font-display text-[1.6rem] font-semibold leading-[1.15]">Leads</h1>
        <p className="mt-1 mb-6 text-[0.9rem] text-dim">
          Every booking-form submission, with its Razorpay payment.
        </p>
        {children}
      </main>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[16px] border border-line bg-surface px-5 py-4">
      <div className={`font-display text-[1.5rem] font-bold tabular-nums ${accent ? "text-brand" : "text-ink"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[0.8rem] text-faint">{label}</div>
    </div>
  );
}
