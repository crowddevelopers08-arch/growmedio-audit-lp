"use client";

import { Container } from "./ui/Container";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";
import { useInView } from "./useInView";

const STEPS = [
  "Fill out the short form",
  "Join your one-on-one session",
  "We review your Ayurveda business",
  "Get your strategy",
];

/* the rail runs horizontally on desktop (first dot's centre to last dot's centre: half a column in from
   each edge, columns being (100% - 3 gaps of 14px) / 4) and vertically below 980px */
const rail =
  "absolute left-[calc(12.5%-5.25px)] right-[calc(12.5%-5.25px)] top-[21px] h-0.5 max-[980px]:bottom-0 max-[980px]:left-[21px] max-[980px]:right-auto max-[980px]:top-0 max-[980px]:h-auto max-[980px]:w-0.5";

export function ProcessSection() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Section id="process">
      <Container>
        <SectionHead center title="How it works" />
        <div
          ref={ref}
          data-in={inView}
          className="group/rv relative mt-10 grid grid-cols-4 gap-[14px] max-[980px]:grid-cols-[minmax(0,1fr)] max-[980px]:gap-5 max-[560px]:mt-8"
        >
          <div className={`${rail} bg-ay-line`} />
          <div
            className={`${rail} bg-[linear-gradient(90deg,var(--color-ay-leaf),var(--color-ay-gold))] shadow-[0_0_12px_rgba(0,96,47,.6)] [transition:transform_2.2s_cubic-bezier(.2,.7,.2,1)_.2s] origin-left max-[980px]:origin-top motion-reduce:[transform:none] ${
              inView ? "[transform:none]" : "[transform:scaleX(0)] max-[980px]:[transform:scaleY(0)]"
            }`}
          />
          {/* each dot pops in as the line reaches it, then its label rises in */}
          {STEPS.map((s, i) => (
            <div key={s} className="group relative pt-[58px] text-center max-[980px]:flex max-[980px]:text-left max-[980px]:min-h-11 max-[980px]:items-center max-[980px]:pl-[66px] max-[980px]:pt-0">
              <span
                style={{ animationDelay: `${0.2 + i * 0.55}s` }}
                className="absolute left-[calc(50%-22px)] top-0 grid h-11 w-11 max-[980px]:left-0 place-items-center rounded-full border-2 border-ay-gold bg-ay-bg font-bold text-ay-gold opacity-0 shadow-[0_0_22px_rgba(0,96,47,.35)] transition-[background,color,box-shadow] duration-300 group-hover:bg-ay-gold group-hover:text-ay-ink group-hover:shadow-[0_0_30px_rgba(0,96,47,.7)] group-data-[in=true]/rv:animate-pop"
              >
                {i + 1}
              </span>
              <h3
                style={{ animationDelay: `${0.4 + i * 0.55}s` }}
                className="text-balance text-[20px] font-semibold tracking-[-0.025em] opacity-0 transition-colors duration-300 group-hover:text-ay-gold group-data-[in=true]/rv:animate-rise"
              >
                {s}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
