"use client";

import { useLanding } from "./LandingProvider";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { ctaPulse } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { TwoLine } from "./ui/SectionHead";

export function FinalCta() {
  const { openModal } = useLanding();
  return (
    <Section id="book" className="text-center">
      <Container className="relative">
        <Reveal variant="blur">
          <h2 className="mx-auto max-w-[28ch] text-balance text-[clamp(27px,4.4vw,60px)] font-semibold leading-[1.08] tracking-[-0.025em]">
            <TwoLine
              first="Stop funding leaks."
              second={
                <span className="text-ay-brand">
                  Start building revenue.
                </span>
              }
            />
          </h2>
          <Button size="lg" arrow onClick={openModal} className={`mt-8 ${ctaPulse} max-[560px]:w-full`}>
            Reserve My Free Session
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
