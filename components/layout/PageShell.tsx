import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/sections/SiteFooter";
import Logo from "@/components/ui/Logo";

/**
 * Header + footer frame for the legal pages (privacy, terms, refunds).
 * The landing page keeps its own sticky header with section anchors, which
 * would point nowhere from here.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-[100] flex h-16 items-center md:h-[72px] border-b border-line bg-[rgba(7,8,10,0.92)] backdrop-blur-[14px]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3 px-4 min-[480px]:px-6">
          <Link href="/" aria-label="Grow Medico — home" className="shrink-0">
            <Logo height={36} priority className="min-[480px]:hidden" />
            <Logo height={44} priority className="hidden min-[480px]:block" />
          </Link>
          <Link href="/" className="text-[0.9rem] text-dim transition-colors hover:text-ink">
            ← Back to home
          </Link>
        </div>
      </header>

      <main id="main">{children}</main>

      <SiteFooter />
    </>
  );
}
