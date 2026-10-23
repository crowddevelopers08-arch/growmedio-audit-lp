import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ctaClass } from "@/components/ui/CtaButton";
import { ayurvedaLeadStats, countAyurvedaLeads, listAyurvedaLeads, type AyurvedaLead } from "@/lib/ayurvedaLeads";
import { formatIST, sourceOf } from "@/lib/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ayurveda Leads — Grow Medico",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 50;

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

function pageHref({ q, page }: { q: string; page?: number }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/dashboard/ayurveda?${qs}` : "/dashboard/ayurveda";
}

async function load(q: string, page: number) {
  const [leads, matching, stats] = await Promise.all([
    listAyurvedaLeads({ q, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    countAyurvedaLeads(q),
    ayurvedaLeadStats(),
  ]);
  return { leads, matching, stats };
}

export default async function AyurvedaDashboardPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = first(sp.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  const data = await load(q, page).catch((err) => {
    console.error("[dashboard/ayurveda] Query failed:", err instanceof Error ? err.message : err);
    return null;
  });

  if (!data) {
    return (
      <Shell>
        <div className="rounded-[18px] border border-[rgba(255,107,107,0.3)] bg-danger-wash p-6 text-[0.95rem] text-danger">
          Couldn&apos;t load Ayurveda leads from the database. Check that <code className="font-mono">DATABASE_URL</code> is
          set and the table exists (<code className="font-mono">npm run db:deploy</code>).
        </div>
      </Shell>
    );
  }

  const { leads, matching, stats } = data;
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const from = matching ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, matching);

  return (
    <Shell>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total leads" value={stats.total.toLocaleString("en-IN")} accent />
        <Stat label="Today" value={stats.today.toLocaleString("en-IN")} />
        <Stat label="Last 7 days" value={stats.last7.toLocaleString("en-IN")} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
        <form method="get" className="flex min-w-0 flex-1 gap-2 min-[760px]:flex-none">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, email, clinic…"
            className="min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 py-2 text-[0.88rem] text-ink outline-none placeholder:text-faint focus:border-brand min-[760px]:w-[300px]"
          />
          <button type="submit" className={ctaClass({ size: "sm" })}>
            Search
          </button>
        </form>
        <a
          href={`/dashboard/ayurveda/export${q ? `?${new URLSearchParams({ q })}` : ""}`}
          className={ctaClass({ variant: "ghost", size: "sm" })}
        >
          Export CSV
        </a>
      </div>

      {leads.length === 0 ? (
        <p className="mt-4 rounded-[18px] border border-line bg-surface px-4 py-14 text-center text-dim">
          {q ? "No leads match this search." : "No leads yet — they appear here as soon as someone submits the Ayurveda page form."}
        </p>
      ) : (
        <>
          {/* Table on wide screens, cards on phones. */}
          <div className="mt-4 hidden overflow-hidden rounded-[18px] border border-line bg-surface min-[900px]:block">
            <table className="w-full text-left text-[0.88rem]">
              <thead className="border-b border-line text-[0.72rem] tracking-[0.04em] text-faint uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Clinic / Hospital</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Submitted (IST)</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-line align-top last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {lead.name}
                      <div className="text-[0.78rem] font-normal text-faint">{lead.occupation}</div>
                    </td>
                    <td className="px-5 py-3.5"><Contact lead={lead} /></td>
                    <td className="px-5 py-3.5"><Email lead={lead} /></td>
                    <td className="px-5 py-3.5 text-ink">{lead.clinic}</td>
                    <td className="px-5 py-3.5 text-dim"><Source lead={lead} /></td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-dim">{formatIST(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 min-[900px]:hidden">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-[18px] border border-line bg-surface p-4">
                <header className="border-b border-line pb-3">
                  <h2 className="font-display text-[1.05rem] font-semibold text-ink">{lead.name}</h2>
                  <p className="mt-0.5 text-[0.8rem] text-faint">
                    {lead.occupation} · {formatIST(lead.createdAt)}
                  </p>
                </header>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 text-[0.88rem]">
                  <Cell label="Phone"><Contact lead={lead} /></Cell>
                  <Cell label="Clinic / Hospital">{lead.clinic}</Cell>
                  <Cell label="Email"><Email lead={lead} /></Cell>
                  <Cell label="Source"><Source lead={lead} /></Cell>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-dim">
        <span>{matching ? `Showing ${from}–${to} of ${matching.toLocaleString("en-IN")}` : "No results"}</span>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link href={pageHref({ q, page: page - 1 })} className={ctaClass({ variant: "ghost", size: "sm" })}>
                ← Previous
              </Link>
            )}
            <span className="px-2">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link href={pageHref({ q, page: page + 1 })} className={ctaClass({ variant: "ghost", size: "sm" })}>
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
    <DashboardShell
      tab="ayurveda"
      title="Ayurveda leads"
      description="Submissions from the free strategy session form on the Ayurveda page (/ayurveda)."
      siteHref="/ayurveda"
    >
      {children}
    </DashboardShell>
  );
}

function Contact({ lead }: { lead: AyurvedaLead }) {
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

function Email({ lead }: { lead: AyurvedaLead }) {
  return (
    <a href={`mailto:${lead.email}`} className="break-all text-ink hover:text-brand">
      {lead.email}
    </a>
  );
}

function Source({ lead }: { lead: AyurvedaLead }) {
  const source = sourceOf(lead.pageUrl);
  if (!source) return <span className="text-faint">—</span>;
  return (
    <span className="break-words" title={lead.pageUrl ?? undefined}>
      {source}
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
      <div className={`font-display text-[1.5rem] font-bold tabular-nums ${accent ? "text-brand" : "text-ink"}`}>{value}</div>
      <div className="mt-0.5 text-[0.8rem] text-faint">{label}</div>
    </div>
  );
}
