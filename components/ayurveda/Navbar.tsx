"use client";

import { useLanding } from "./LandingProvider";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

const links = [
  { href: "#problem", label: "The problem" },
  { href: "#leaks", label: "Money leaks" },
  { href: "#session", label: "The session" },
  { href: "#proof", label: "Proof" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { openModal } = useLanding();
  return (
    <nav className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-ay-line bg-[rgba(255,255,255,.92)] backdrop-blur-[14px]">
      <Container className="flex items-center justify-between gap-[18px] py-[13px] max-[560px]:gap-3 max-[560px]:py-2.5">
        <a
          href="#top"
          aria-label="Grow Medico home"
          className="flex items-center gap-[10px] text-[19px] font-bold tracking-[-.02em] no-underline"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ayurveda/logo-light.png" alt="Grow Medico" className="block h-[46px] w-auto max-[560px]:h-[34px] max-[380px]:h-[30px]" />
        </a>
        <div className="flex gap-7 text-[14.5px] font-medium text-ay-muted max-[980px]:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="no-underline transition-colors duration-200 hover:text-ay-fg">
              {l.label}
            </a>
          ))}
        </div>
        <Button size="nav" onClick={openModal}>
          Reserve My Free Session
        </Button>
      </Container>
    </nav>
  );
}
