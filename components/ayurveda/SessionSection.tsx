"use client";

import { useRef } from "react";
import { Container } from "./ui/Container";
import { Reveal, type RevealVariant } from "./ui/Reveal";
import { borderDelay, cardBorder, cardLift, cardShine } from "./ui/fx";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

const STEPS = [
  { title: "We review your real numbers", text: "Ad account, leads, bookings." },
  { title: "We find the leaks", text: "Where the money goes and why." },
  { title: "We build your plan live", text: "Clear steps to fix and scale your revenue." },
];

/** Card with a hover lift. */
function SessionCard({ n, title, text, delay, variant }: (typeof STEPS)[number] & { n: number; delay: number; variant: RevealVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Reveal as="article" delay={delay} variant={variant} className="h-full">
      <div
        ref={ref}
        onPointerMove={(e) => {
          const c = ref.current!, r = c.getBoundingClientRect();
          c.style.setProperty("--mx", `${e.clientX - r.left}px`);
          c.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        style={{ "--mx": "50%", "--my": "0%", ...borderDelay(n) } as React.CSSProperties}
        className={`group relative h-full overflow-hidden rounded-[20px] border border-ay-line px-7 py-[30px] backdrop-blur-[6px] bg-ay-panel ${cardLift} ${cardBorder} ${cardShine} max-[860px]:px-6 max-[860px]:py-6 max-[560px]:rounded-2xl max-[560px]:px-5 max-[560px]:py-5`}
      >
        {/* numbered badge that pops in, then spins a quarter turn on hover */}
        <div
          style={{ animationDelay: `${delay + 0.5}s` }}
          className="grid h-10 w-10 place-items-center rounded-xl border border-ay-brand/40 bg-ay-brand/[.08] text-[14.5px] font-bold tracking-[.1em] text-ay-brand opacity-0 transition-[transform,background] duration-500 group-hover:[transform:rotate(90deg)] group-hover:bg-ay-brand/[.16] group-data-[in=true]/rv:animate-pop"
        >
          <span className="transition-transform duration-500 group-hover:[transform:rotate(-90deg)]">0{n}</span>
        </div>
        <h3 className="mt-5 text-balance text-[24px] font-semibold leading-[1.2] tracking-[-0.025em] max-[860px]:mt-3 max-[560px]:text-[20px]">{title}</h3>
        <p className="relative mt-[18px] pl-[22px] max-[860px]:mt-2.5 text-[15px] font-medium text-ay-fg before:absolute before:left-0 before:text-ay-muted before:transition-transform before:duration-300 before:content-['\2192'] group-hover:before:[transform:translateX(4px)]">
          {text}
        </p>
      </div>
    </Reveal>
  );
}

export function SessionSection() {
  return (
    <Section id="session">
      <Container>
        <SectionHead center kicker="What happens in the session" title="One hour. One‑on‑one strategy. Your clinic." />
        <div className="mt-10 grid grid-cols-3 gap-[18px] max-[860px]:grid-cols-1 max-[860px]:gap-3 max-[560px]:mt-8">
          {STEPS.map((s, i) => (
            <SessionCard key={s.title} n={i + 1} {...s} delay={i * 0.12} variant={(["left", "up", "right"] as const)[i]} />
          ))}
        </div>
        <Reveal variant="scale" delay={0.3} className="mt-8 text-center">
          <p className="inline-block rounded-full border border-ay-brand/45 bg-ay-panel px-[22px] py-3 text-[14px] font-bold uppercase tracking-[.22em] backdrop-blur-[6px]">
            <span className="text-ay-brand">
              Not a sales call! Not a generic webinar!
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
