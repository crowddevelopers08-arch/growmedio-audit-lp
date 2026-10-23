import { Container } from "./ui/Container";
import { Section } from "./ui/Section";
import { SectionHead, TwoLine } from "./ui/SectionHead";
import { Counters } from "./proof/Counters";

export function ProofSection() {
  return (
    <Section id="proof" className="bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,181,61,.08),transparent_60%)]">
      <Container>
        <SectionHead center kicker="Proof" title={<TwoLine first="Ayush Ortho." second="Scaled from 1 to 4." />} />
        <Counters />
      </Container>
    </Section>
  );
}
