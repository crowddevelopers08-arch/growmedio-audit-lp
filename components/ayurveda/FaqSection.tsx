"use client";

import { useState } from "react";
import { Container } from "./ui/Container";
import { cardBorder } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

const FAQS = [
  { q: "Is it really free?", a: "Yes. No fee, no hidden charges." },
  { q: "Is there a catch?", a: "No. You get a real strategy. What you do next is your choice." },
  { q: "Do I have to sign up with you?", a: "No. There's no obligation." },
  { q: "Why only ₹5L+?", a: "At this spend, leaks cost the most, and a strategy makes the biggest difference." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <Container>
        <SectionHead center title="FAQ" />
        <Reveal variant="scale" className={`relative mx-auto mt-10 max-w-[860px] rounded-[20px] max-[560px]:mt-8 ${cardBorder}`}>
          <div className="overflow-hidden rounded-[20px] border border-ay-line bg-ay-panel backdrop-blur-[6px]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              // rows rise in one by one; the open row gets a gold bar on its left edge
              <div
                key={f.q}
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                className={`relative opacity-0 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:origin-top before:bg-[linear-gradient(var(--color-ay-gold),var(--color-ay-leaf))] before:transition-transform before:duration-500 before:content-[''] hover:bg-white/[.02] group-data-[in=true]/rv:animate-rise ${
                  isOpen ? "bg-ay-gold/[.03] before:scale-y-100" : "before:scale-y-0"
                } ${i ? "border-t border-ay-line" : ""}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent px-7 py-6 text-left text-[19px] font-semibold leading-[1.3] tracking-[-0.015em] transition-colors duration-200 max-[560px]:gap-4 max-[560px]:px-5 max-[560px]:py-[18px] max-[560px]:text-[17px] ${
                    isOpen ? "text-ay-gold" : "text-ay-fg hover:text-ay-gold"
                  }`}
                >
                  {f.q}
                  <span
                    aria-hidden="true"
                    className={`grid h-8 w-8 flex-none place-items-center rounded-full border text-[20px] leading-none transition-[transform,border-color,background] duration-300 ${
                      isOpen ? "[transform:rotate(45deg)] border-ay-gold bg-ay-gold text-ay-ink" : "border-ay-line-2 text-ay-muted"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-6 text-[16px] text-ay-muted max-[560px]:px-5 max-[560px]:pb-[18px] max-[560px]:text-[15px]">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
