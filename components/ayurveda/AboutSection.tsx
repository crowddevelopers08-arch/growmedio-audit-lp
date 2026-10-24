import { Container } from "./ui/Container";
import { HighlightCard } from "./ui/HighlightCard";
import { Section } from "./ui/Section";
import { StickyStack } from "./ui/StickyStack";

const CARDS = [
  {
    kicker: "Why is it free?",
    title: (
      <>
        Because we&apos;d rather <span className="text-ay-gold">show you</span> than tell you.
      </>
    ),
    text: "Most agencies ask for your trust first. We do it the other way round. You see how we think and what we'd do for your clinic before you decide anything.",
  },
  {
    kicker: "About Grow Medico",
    title: (
      <>
        We only grow <span className="text-ay-gold">healthcare practices.</span>
      </>
    ),
    text: "We work with clinics across India: Ayurveda, skin and hair, fertility, dental and more. We know what makes patients book, and where clinic marketing breaks.",
  },
];

/** "Why is it free?" then "About Grow Medico", pinned and stacked as the page scrolls. */
export function AboutSection() {
  return (
    <Section id="about">
      <Container>
        <StickyStack>
          {CARDS.map((c, i) => (
            <HighlightCard key={c.kicker} kicker={c.kicker} title={c.title} text={c.text} delay={i * 2} />
          ))}
        </StickyStack>
      </Container>
    </Section>
  );
}
