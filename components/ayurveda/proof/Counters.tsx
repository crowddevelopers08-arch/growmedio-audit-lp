"use client";

import { useInView } from "../useInView";
import { CountUp } from "./CountUp";
import { borderDelay, cardBorder, cardLift, cardShine } from "../ui/fx";

type Counter = { pre?: string; to: number; post?: string; label: React.ReactNode };

const COUNTERS: Counter[] = [
  { to: 656, label: <>consultations last month, up from 25&ndash;30</> },
  { pre: "₹", to: 44, post: "L", label: <>monthly revenue, up from &#8377;1&nbsp;lakh</> },
  { to: 44, post: "×", label: "growth in monthly revenue" },
  { pre: "≈₹", to: 6700, label: "revenue per consultation" },
];

function CounterCard({ pre, to, post, label, delay }: Counter & { delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    // outer handles the entrance, inner handles hover, so the two transforms never fight
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`h-full transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:[transform:none] motion-reduce:opacity-100 ${
        inView ? "[transform:none] opacity-100" : "[transform:translateY(18px)_scale(.94)] opacity-0"
      }`}
    >
      <div
        style={borderDelay(Math.round(delay / 0.08))}
        className={`group relative h-full overflow-hidden rounded-[18px] border border-ay-line bg-[rgba(6,12,9,.86)] px-6 py-7 backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[760px]:px-5 max-[760px]:py-5`}
      >
        {/* gold bar fills along the top while the number counts */}
        <span
          aria-hidden="true"
          style={{ transitionDelay: `${delay + 0.2}s` }}
          className={`pointer-events-none absolute left-0 top-0 h-0.5 w-full origin-left bg-[linear-gradient(90deg,var(--color-ay-leaf),var(--color-ay-gold))] transition-transform duration-[2200ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
            inView ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <div className="text-[clamp(36px,4vw,54px)] font-bold leading-none tracking-[-.04em] text-ay-gold tabular-nums transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_24px_rgba(242,181,61,.55)]">
          {pre}
          <CountUp to={to} start={inView} />
          {post}
        </div>
        <div className="mt-3 text-[14.5px] text-ay-muted">{label}</div>
      </div>
    </div>
  );
}

export function Counters() {
  return (
    <div className="mt-10 grid grid-cols-4 gap-[18px] max-[980px]:grid-cols-2 max-[760px]:gap-3 max-[560px]:mt-8">
      {COUNTERS.map((c, i) => (
        <CounterCard key={i} {...c} delay={i * 0.08} />
      ))}
    </div>
  );
}
