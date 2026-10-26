import { Container } from "./ui/Container";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";
import { Counters } from "./proof/Counters";
import { GrowthChart } from "./proof/GrowthChart";

export function ProofSection() {
  return (
    <Section id="proof" className="bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,181,61,.08),transparent_60%)]">
      <Container>
        <SectionHead
          center
          kicker={
            <span>
              One of our proof&nbsp;-&nbsp;<span className="text-ay-gold">Ayush Ortho Ayurveda Clinic</span>
            </span>
          }
          title={<>The numbers behind &#8377;44&nbsp;lakhs.</>}
          desc="One Ayurveda clinic, one steady climb."
        />
        <Counters />
        <GrowthChart />
      </Container>
    </Section>
  );
}
