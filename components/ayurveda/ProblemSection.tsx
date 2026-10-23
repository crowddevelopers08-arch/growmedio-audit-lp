import { Container } from "./ui/Container";
import { borderDelay, cardBorder, cardLift, cardShine } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

const PROBLEMS = [
  "Leads come in, but patients don't",
  "Your team calls, but nobody books",
  "Reports look good, but the bank balance doesn't",
  "You've changed agencies, and nothing changed",
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <Container>
        <SectionHead center kicker="The problem" title="You spend a lot. The revenue doesn't show up." />
        <div className="mt-10 grid grid-cols-4 gap-[18px] max-[1100px]:grid-cols-2 max-[560px]:mt-8 max-[560px]:grid-cols-1 max-[560px]:gap-3">
          {PROBLEMS.map((t, i) => (
            <Reveal key={t} as="article" variant="scale" delay={i * 0.1} className="h-full">
              <div
                style={borderDelay(i)}
                className={`group relative h-full overflow-hidden rounded-[20px] border border-ay-line bg-[rgba(6,12,9,.86)] px-7 py-[30px] backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[1100px]:px-6 max-[1100px]:py-6 max-[560px]:flex max-[560px]:items-baseline max-[560px]:gap-4 max-[560px]:rounded-2xl max-[560px]:px-5 max-[560px]:py-[18px]`}
              >
                {/* number pops in after the card lands */}
                <div
                  style={{ animationDelay: `${i * 0.1 + 0.45}s` }}
                  className="flex-none origin-left text-[13px] font-bold tracking-[.22em] text-ay-gold opacity-0 group-data-[in=true]/rv:animate-pop"
                >
                  0{i + 1}
                </div>
                <h3 className="mt-5 text-balance text-[22px] font-semibold leading-[1.25] tracking-[-0.025em] max-[1100px]:mt-3 max-[560px]:mt-0 max-[560px]:text-[18px]">{t}</h3>
                {/* gold edge that grows along the bottom on hover */}
                <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-ay-gold),var(--color-ay-leaf))] transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="blur" delay={0.1} className="mx-auto mt-10 max-w-[900px] text-center max-[560px]:mt-8">
          <p className="text-balance text-[clamp(22px,2.6vw,34px)] font-semibold leading-[1.2] tracking-[-0.025em] [text-shadow:0_2px_24px_rgba(5,10,7,.95)]">
            <span className="block">The problem is rarely the budget.</span>
            {/* underline draws in under the gold line */}
            <span className="relative mt-[.12em] inline-block text-ay-gold after:absolute after:-bottom-1.5 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[linear-gradient(90deg,var(--color-ay-gold),var(--color-ay-leaf))] after:transition-transform after:delay-700 after:duration-1000 after:content-[''] group-data-[in=true]/rv:after:scale-x-100 max-[560px]:after:hidden">
              It&apos;s all about what happens after the click.
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
