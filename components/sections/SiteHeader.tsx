"use client";

import { useEffect, useState } from "react";
import BookNowButton from "@/components/booking/BookNowButton";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#proof", label: "Proof" },
  { href: "#offer", label: "Pricing" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] flex h-[72px] items-center border-b border-line backdrop-blur-[14px] transition-[background-color,box-shadow] duration-200 ${
        scrolled
          ? "bg-[rgba(7,8,10,0.92)] shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)]"
          : "bg-[rgba(7,8,10,0.7)]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6">
        {/* Below 480px the two-line wordmark gets too small to read, so the
            G mark carries the brand on its own. */}
        <a href="#" aria-label="Grow Medico — back to top" className="shrink-0">
          <Logo
            variant="mark"
            height={34}
            priority
            className="min-[480px]:hidden"
          />
          {/* 44px keeps the stacked GROW / MEDICO lines readable; much smaller
              and the two-line wordmark turns to mush. */}
          <Logo height={44} priority className="hidden min-[480px]:block" />
        </a>

        <nav
          aria-label="Primary"
          className="hidden gap-8 text-[0.92rem] text-dim min-[900px]:flex"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[18px]">
          <BookNowButton size="sm">Book ₹299 Session</BookNowButton>
        </div>
      </div>
    </header>
  );
}
