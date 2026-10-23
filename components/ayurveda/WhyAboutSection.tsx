import { Container } from "./ui/Container";
import { Kicker } from "./ui/Kicker";
import { Reveal } from "./ui/Reveal";
import { borderDelay, cardBorder, cardLift, cardShine } from "./ui/fx";
import { Section } from "./ui/Section";

const BLOCKS = [
  {
    kicker: "Why is it free?",
    title: "Because we'd rather show you than tell you.",
    text: "Most agencies ask for your trust first. We do it the other way round. You see how we think and what we'd do for your clinic before you decide anything.",
  },
  {
    kicker: "About Grow Medico",
    title: "We only grow healthcare practices.",
    text: "We work with clinics across India: Ayurveda, skin and hair, fertility, dental and more. We know what makes patients book, and where clinic marketing breaks.",
  },
];

/** "Why is it free?" and "About Grow Medico", side by side. */
export function WhyAboutSection() {
  return (
    <Section id="about">
      <Container className="grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-[minmax(0,1fr)] max-[980px]:gap-3">
        {BLOCKS.map((b, i) => (
          <Reveal key={b.kicker} variant={i ? "right" : "left"} delay={i * 0.12} className="h-full">
            <div
              style={borderDelay(i * 2)}
              className={`group relative h-full overflow-hidden rounded-[22px] border border-ay-line-2 bg-[rgba(9,18,13,.8)] px-9 py-10 backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[980px]:px-7 max-[980px]:py-8 max-[560px]:px-5 max-[560px]:py-6`}
            >
              {/* soft gold corner glow that blooms on hover */}
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-ay-gold/[.10] blur-2xl transition-[transform,opacity] duration-700 group-hover:[transform:scale(1.6)] group-hover:opacity-100 opacity-60" />
              <Kicker tone="head">{b.kicker}</Kicker>
              <h2 className="mt-4 text-balance text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.15] tracking-[-0.025em]">
                {b.title}
              </h2>
              <p className="mt-[18px] text-[17px] text-ay-muted">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
