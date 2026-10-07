import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ctaClass } from "@/components/ui/CtaButton";
import Logo from "@/components/ui/Logo";
import {
  countLeads,
  FILTERS,
  formatIST,
  formatRupees,
  leadStats,
  listLeads,
  parseFilter,
  sourceOf,
  type FilterKey,
  type Lead,
  type LeadPaymentStatus,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads Dashboard — Grow Medico",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 50;

type SearchParams = Record<string, string | string[] | undefined>;

const BADGES: Record<LeadPaymentStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "border-[rgba(22,212,146,0.35)] bg-brand-wash text-brand" },
  checkout: { label: "Checkout opened", className: "border-[rgba(242,184,75,0.35)] bg-gold-wash text-gold" },
  failed: { label: "Payment failed", className: "border-[rgba(255,107,107,0.3)] bg-danger-wash text-danger" },
  pending: { label: "Not paid", className: "border-line text-faint" },
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

async function loadDashboard(filter: FilterKey, q: string, page: number) {
  const [leads, matching, stats] = await Promise.all([
    listLeads({ filter, q, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    countLeads(filter, q),
    leadStats(),
  ]);
  return { leads, matching, stats };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filter = parseFilter(first(sp.filter));
  const q = first(sp.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  const data = await loadDashboard(filter, q, page).catch((err) => {
    console.error("[dashboard] Query failed:", err instanceof Error ? err.message : err);
    return null;
  });

  if (!data) {
    return (
      <Shell>
        <div className="rounded-[18px] border border-[rgba(255,107,107,0.3)] bg-danger-wash p-6 text-[0.95rem] text-danger">
          Couldn&apos;t load leads from the database. Check that{" "}
          <code className="font-mono">DATABASE_URL</code> is set and the table exists (
          <code className="font-mono">npm run db:deploy</code>).
        </div>
      </Shell>
    );
  }

  const { leads, matching, stats } = data;
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const conversion = stats.total ? Math.round((stats.paid / stats.total) * 100) : 0;
  const from = matching ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, matching);
  const exportQs = new URLSearchParams({ ...(filter !== "all" && { filter }), ...(q && { q }) });

  return (
    <Shell>
      <div className="grid grid-cols-2 gap-3 min-[900px]:grid-cols-5">
        <Stat label="Total leads" value={stats.total.toLocaleString("en-IN")} />
        <Stat label="Today" value={stats.today.toLocaleString("en-IN")} />
        <Stat label="Paid" value={stats.paid.toLocaleString("en-IN")} accent />
        <Stat label="Lead → paid" value={`${conversion}%`} />
        <Stat label="Revenue collected" value={formatRupees(stats.revenuePaise)} accent />
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

        <div className="flex w-full flex-wrap gap-2 min-[760px]:w-auto">
          <form method="get" className="flex min-w-0 flex-1 gap-2">
            {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, phone, payment ID…"
              className="min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 py-2 text-[0.88rem] text-ink outline-none placeholder:text-faint focus:border-brand min-[760px]:w-[280px]"
            />
            <button type="submit" className={ctaClass({ size: "sm" })}>
              Search
            </button>
          </form>
          <a
            href={`/dashboard/export${exportQs.size ? `?${exportQs}` : ""}`}
            className={ctaClass({ variant: "ghost", size: "sm" })}
          >
            Export CSV
          </a>
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="mt-4 rounded-[18px] border border-line bg-surface px-4 py-14 text-center text-dim">
          {q || filter !== "all"
            ? "No leads match these filters."
            : "No leads yet — they appear here as soon as someone submits the booking form."}
        </p>
      ) : (
        <>
          {/* Table on wide screens, cards on phones — six columns don't fit at 375px. */}
          <div className="mt-4 hidden overflow-hidden rounded-[18px] border border-line bg-surface min-[900px]:block">
            <table className="w-full text-left text-[0.88rem]">
              <thead className="border-b border-line text-[0.72rem] tracking-[0.04em] text-faint uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">WhatsApp</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Submitted (IST)</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {lead.name}
                      <div className="text-[0.78rem] font-normal text-faint">{lead.country}</div>
                    </td>
                    <td className="px-5 py-3.5"><Contact lead={lead} /></td>
                    <td className="px-5 py-3.5"><Badge status={lead.paymentStatus} /></td>
                    <td className="px-5 py-3.5"><PaymentInfo lead={lead} /></td>
                    <td className="px-5 py-3.5 text-dim"><Source lead={lead} /></td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-dim">{formatIST(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 min-[900px]:hidden">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-[18px] border border-line bg-surface p-4">
                <header className="flex items-start justify-between gap-3 border-b border-line pb-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-[1.05rem] font-semibold text-ink">{lead.name}</h2>
                    <p className="mt-0.5 text-[0.8rem] text-faint">{formatIST(lead.createdAt)}</p>
                  </div>
                  <Badge status={lead.paymentStatus} />
                </header>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 text-[0.88rem]">
                  <Cell label="WhatsApp"><Contact lead={lead} /></Cell>
                  <Cell label="Payment"><PaymentInfo lead={lead} /></Cell>
                  <Cell label="Country">{lead.country}</Cell>
                  <Cell label="Source"><Source lead={lead} /></Cell>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-dim">
        <span>
          {matching ? `Showing ${from}–${to} of ${matching.toLocaleString("en-IN")}` : "No results"}
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
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3 min-[480px]:px-6 md:py-4">
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

      <main className="mx-auto w-full max-w-[1280px] px-4 py-6 min-[480px]:px-6 md:py-8">
        <h1 className="font-display text-[1.6rem] font-semibold leading-[1.15]">Leads</h1>
        <p className="mt-1 mb-6 text-[0.9rem] text-dim">
          Submissions from the ₹199 Strategy Session booking form, with their Razorpay payment status.
        </p>
        {children}
      </main>
    </div>
  );
}

function Contact({ lead }: { lead: Lead }) {
  return (
    <>
      <a href={`tel:+${lead.phone}`} className="whitespace-nowrap text-ink hover:text-brand">
        +{lead.phone}
      </a>
      <div>
        <a
          href={`https://wa.me/${lead.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.8rem] text-brand hover:underline"
        >
          Open WhatsApp
        </a>
      </div>
    </>
  );
}

function PaymentInfo({ lead }: { lead: Lead }) {
  if (lead.paymentStatus !== "paid") return <span className="text-faint">—</span>;
  return (
    <>
      <span className="text-ink">
        {lead.amountPaise != null ? formatRupees(lead.amountPaise) : "Paid"}
        {lead.paymentMethod ? ` · ${lead.paymentMethod.toUpperCase()}` : ""}
      </span>
      {lead.razorpayPaymentId && (
        <div className="font-mono text-[0.72rem] break-all text-faint">{lead.razorpayPaymentId}</div>
      )}
    </>
  );
}

function Source({ lead }: { lead: Lead }) {
  const source = sourceOf(lead.pageUrl);
  if (!source) return <span className="text-faint">—</span>;
  return (
    <span className="break-words" title={lead.pageUrl ?? undefined}>
      {source}
    </span>
  );
}

function Badge({ status }: { status: LeadPaymentStatus }) {
  const badge = BADGES[status] ?? BADGES.pending;
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[0.75rem] font-semibold whitespace-nowrap ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[0.72rem] tracking-[0.04em] text-faint uppercase">{label}</div>
      <div className="mt-1 leading-snug text-ink">{children}</div>
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
