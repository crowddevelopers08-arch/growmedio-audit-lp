import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";
import Ph from "@/components/ui/Ph";
import { LEGAL } from "@/lib/legal";

/**
 * Shared frame for the privacy, terms and refund pages, so the three stay
 * visually identical as any one of them is edited.
 */
export default function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-[760px] px-6 pt-8 pb-12 md:pb-16 min-[860px]:pt-12 lg:pb-[72px]">
        <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
          Legal
        </span>
        <h1 className="font-display text-[clamp(1.9rem,3vw_+_1rem,2.8rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
          {title}
        </h1>
        <p className="mt-3 text-[0.9rem] text-faint">Last updated: {lastUpdated}</p>

        <p className="mt-6 text-[1.02rem] leading-[1.75] text-dim md:mt-8">{intro}</p>

        {children}
      </article>
    </PageShell>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 md:mt-10">
      <h2 className="font-display text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.98rem] leading-[1.75] text-dim [&_li]:mt-2 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/**
 * Renders a business detail from lib/legal.ts, or a dashed placeholder naming
 * what is still missing — so an unfilled legal page is obvious on sight
 * instead of reading as a finished document with a gap in it.
 */
export function Fill({ value, label }: { value: string | null; label: string }) {
  if (value) return <>{value}</>;
  return <Ph title={`Add ${label} in lib/legal.ts`}>[{label}]</Ph>;
}

const linkClass = "text-brand underline underline-offset-4";

/** Tap-to-email — a good share of these pages are read on a phone. */
export function EmailLink() {
  if (!LEGAL.email) return <Fill value={null} label="support email" />;
  return (
    <a href={`mailto:${LEGAL.email}`} className={linkClass}>
      {LEGAL.email}
    </a>
  );
}

/** Tap-to-call. `tel:` needs the number unspaced; the label keeps its spacing. */
export function PhoneLink() {
  if (!LEGAL.phone) return <Fill value={null} label="support phone number" />;
  return (
    <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className={linkClass}>
      {LEGAL.phone}
    </a>
  );
}
