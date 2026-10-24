import { Container } from "./ui/Container";
import { borderDelay, cardBorder, cardLift, cardShine } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead, TwoLine } from "./ui/SectionHead";

const OUTCOMES = [
  "A clear view of where your budget is leaking",
  "The real reasons your ads aren't converting",
  "A growth roadmap for your clinic",
  "Actions you can start right away",
];

/** "You walk away with": what the clinic owner keeps after the session. */
export function OutcomesSection() {
  return (
    <Section id="outcomes">
      <Container>
        <SectionHead
          center
          kicker="You walk away with"
          title={<TwoLine first="It's a plan, not a pitch." second="The strategy is yours to keep." />}
        />
        <div className="mt-10 grid grid-cols-4 gap-[18px] max-[1100px]:grid-cols-2 max-[560px]:mt-8 max-[560px]:grid-cols-1 max-[560px]:gap-3">
          {OUTCOMES.map((t, i) => (
            <Reveal key={t} variant="scale" delay={i * 0.1} className="h-full">
              <div
                style={borderDelay(i)}
                className={`group relative h-full overflow-hidden rounded-[18px] border border-ay-line bg-[rgba(246,250,223,.86)] px-6 py-7 backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[1100px]:py-6 max-[560px]:flex max-[560px]:items-center max-[560px]:gap-4 max-[560px]:rounded-2xl max-[560px]:px-5 max-[560px]:py-4`}
              >
                {/* circle pops in, then the tick draws itself; the circle glows brighter on hover */}
                <div
                  style={{ animationDelay: `${i * 0.1 + 0.4}s` }}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full bg-ay-leaf/[.14] text-ay-leaf opacity-0 shadow-[0_0_24px_rgba(63,154,82,.25)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(63,154,82,.55)] group-data-[in=true]/rv:animate-pop max-[560px]:h-9 max-[560px]:w-9"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 max-[560px]:h-4 max-[560px]:w-4">
                    <path
                      d="M4 10.5l4 4 8-9"
                      pathLength={20}
                      style={{ animationDelay: `${i * 0.1 + 0.75}s` }}
                      className="[stroke-dasharray:20] [stroke-dashoffset:20] group-data-[in=true]/rv:animate-draw-tick"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-balance text-[19px] font-semibold leading-[1.3] tracking-[-0.015em] max-[1100px]:mt-4 max-[560px]:mt-0 max-[560px]:text-[17px]">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
