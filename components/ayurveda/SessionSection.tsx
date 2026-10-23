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

/** Card with a gold spotlight that follows the pointer. */
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
        className={`group relative h-full overflow-hidden rounded-[20px] border border-ay-line px-7 py-[30px] backdrop-blur-[6px] [background:radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(242,181,61,.13),transparent_60%),var(--color-ay-panel)] ${cardLift} ${cardBorder} ${cardShine} max-[860px]:px-6 max-[860px]:py-6 max-[560px]:rounded-2xl max-[560px]:px-5 max-[560px]:py-5`}
      >
        {/* numbered badge that pops in, then spins a quarter turn on hover */}
        <div
          style={{ animationDelay: `${delay + 0.5}s` }}
          className="grid h-10 w-10 place-items-center rounded-xl border border-ay-gold/40 bg-ay-gold/[.08] text-[13px] font-bold tracking-[.1em] text-ay-gold opacity-0 transition-[transform,background] duration-500 group-hover:[transform:rotate(90deg)] group-hover:bg-ay-gold/[.16] group-data-[in=true]/rv:animate-pop"
        >
          <span className="transition-transform duration-500 group-hover:[transform:rotate(-90deg)]">0{n}</span>
        </div>
        <h3 className="mt-5 text-balance text-[24px] font-semibold leading-[1.2] tracking-[-0.025em] max-[860px]:mt-3 max-[560px]:text-[20px]">{title}</h3>
        <p className="relative mt-[18px] pl-[22px] max-[860px]:mt-2.5 text-[15px] text-[#C3D0C6] before:absolute before:left-0 before:text-ay-leaf before:transition-transform before:duration-300 before:content-['\2192'] group-hover:before:[transform:translateX(4px)]">
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
          <p className="inline-block rounded-full border border-ay-gold/45 bg-[rgba(5,10,7,.82)] px-[22px] py-3 text-[12.5px] font-semibold uppercase tracking-[.22em] backdrop-blur-[6px]">
            {/* slow light shimmer across the text */}
            <span className="animate-shimmer bg-[linear-gradient(90deg,#FFD27A_0%,#FFD27A_35%,#FFF4D6_50%,#FFD27A_65%,#FFD27A_100%)] bg-[length:200%_100%] bg-clip-text text-transparent">
              Not a sales call! Not a generic webinar!
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
