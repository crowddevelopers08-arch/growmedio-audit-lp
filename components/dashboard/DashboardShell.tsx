import Link from "next/link";
import type { ReactNode } from "react";
import { ctaClass } from "@/components/ui/CtaButton";
import Logo from "@/components/ui/Logo";

/** One tab per lead form. */
const TABS = [
  { key: "audit", href: "/dashboard", label: "Audit LP (₹199 session)" },
  { key: "ayurveda", href: "/dashboard/ayurveda", label: "Ayurveda funnel" },
] as const;

export type DashboardTab = (typeof TABS)[number]["key"];

/** Header, form tabs and page title shared by every /dashboard page. */
export function DashboardShell({
  tab,
  title,
  description,
  siteHref = "/",
  children,
}: {
  tab: DashboardTab;
  title: string;
  description: string;
  siteHref?: string;
  children: ReactNode;
}) {
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
          <Link href={siteHref} className={ctaClass({ variant: "ghost", size: "sm" })}>
            View site
          </Link>
        </div>
        <nav aria-label="Lead forms" className="mx-auto flex w-full max-w-[1280px] gap-1 overflow-x-auto px-4 min-[480px]:px-6">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              aria-current={t.key === tab ? "page" : undefined}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-[0.9rem] font-semibold transition-colors ${
                t.key === tab ? "border-brand text-ink" : "border-transparent text-dim hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 py-6 min-[480px]:px-6 md:py-8">
        <h1 className="font-display text-[1.6rem] font-semibold leading-[1.15]">{title}</h1>
        <p className="mt-1 mb-6 text-[0.9rem] text-dim">{description}</p>
        {children}
      </main>
    </div>
  );
}
