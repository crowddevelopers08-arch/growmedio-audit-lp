"use client";

import { useEffect, useRef, useState } from "react";
import { FlowCard } from "./FlowCard";
import { Container } from "./ui/Container";
import { borderDelay, cardBorder } from "./ui/fx";
import { Section } from "./ui/Section";
import { SectionHead, TwoLine } from "./ui/SectionHead";
import { clamp } from "@/lib/ayurveda/motion";

const LEAKS = [
  { title: "Wrong audience", text: "Clicks from people who never book." },
  { title: "Weak offers", text: "The ad promises one thing, the page says another." },
  { title: "Slow follow-up", text: "Good leads go cold." },
  { title: "Poor tracking", text: "You can't see which ad brings paying patients." },
  { title: "Scaling too early", text: "More spend on a leaking system." },
];

function LeakCard({ n, on, current, title, text }: { n: number; on: boolean; current: boolean } & (typeof LEAKS)[number]) {
  return (
    <article
      style={borderDelay(n)}
      className={`group relative rounded-[18px] border px-7 py-[26px] ${cardBorder} backdrop-blur-[6px] transition-[opacity,border-color,background,transform,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] max-[560px]:px-[18px] max-[560px]:py-5 ${
        on
          ? "border-ay-gold/50 bg-[linear-gradient(135deg,rgba(0,96,47,.08),rgba(246,250,223,.84)_60%)] opacity-100"
          : "border-ay-line bg-[rgba(246,250,223,.86)] opacity-[.78]"
      } ${current ? "[transform:translateX(8px)] shadow-[0_18px_40px_-22px_rgba(0,96,47,.55)] max-[560px]:[transform:translateX(4px)]" : ""}`}
    >
      {/* light sweep on hover, clipped to the card (the number badge sits outside it) */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.55)_50%,transparent_75%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
      </span>
      <span
        className={`absolute -left-[46px] top-6 grid h-8 w-8 place-items-center rounded-full border-2 text-[14px] font-bold transition-all duration-500 ${
          on ? "border-ay-gold bg-ay-gold text-ay-ink shadow-[0_0_22px_rgba(0,96,47,.6)]" : "border-ay-line-2 bg-ay-bg text-ay-muted"
        } ${current ? "[transform:scale(1.12)]" : ""}`}
      >
        {/* pulsing ring around the current leak */}
        {current && <i aria-hidden="true" className="absolute inset-[-2px] animate-ring rounded-full border-2 border-ay-gold" />}
        {n}
      </span>
      <h3 className="text-balance text-[23px] font-semibold tracking-[-0.025em]">{title}</h3>
      <p className="mt-2 text-[16px] text-ay-muted">{text}</p>
    </article>
  );
}

/** Where the money leaks: a scroll-tracked chain with the leaking-pipe animation pinned beside it. */
export function LeaksSection() {
  const chainRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const chain = chainRef.current!;
    const cards = Array.from(chain.querySelectorAll("article"));
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let best: number | null = null, bd = 1e9;
      cards.forEach((s, i) => {
        const r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      const cr = chain.getBoundingClientRect();
      fillRef.current!.style.transform = `scaleY(${clamp((mid - cr.top) / cr.height, 0, 1)})`;
      setActive(cr.top < mid && cr.bottom > mid * 0.6 && best !== null ? best : -1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section id="leaks">
      <Container>
        <SectionHead
          kicker="Where the money leaks"
          title={<TwoLine first="At ₹5L a month," second="small leaks become big losses." />}
        />
        <div className="mt-10 grid grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] items-start gap-[56px] max-[980px]:grid-cols-[minmax(0,1fr)] max-[980px]:gap-8 max-[560px]:mt-8">
          <div className="sticky top-[110px] max-[980px]:static">
            <FlowCard />
          </div>
          <div
            ref={chainRef}
            className="relative grid gap-[18px] pl-[46px] before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-0.5 before:bg-ay-line before:content-['']"
          >
            <div
              ref={fillRef}
              style={{ transform: "scaleY(0)" }}
              className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-0.5 origin-top bg-[linear-gradient(var(--color-ay-gold),var(--color-ay-leaf))] shadow-[0_0_12px_rgba(0,96,47,.7)]"
            />
            {LEAKS.map((s, i) => (
              <LeakCard key={s.title} n={i + 1} on={i <= active} current={i === active} {...s} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
