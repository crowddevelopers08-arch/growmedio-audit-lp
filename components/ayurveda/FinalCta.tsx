"use client";

import { useLanding } from "./LandingProvider";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { ctaGlow } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { TwoLine } from "./ui/SectionHead";

export function FinalCta() {
  const { openModal } = useLanding();
  return (
    <Section id="book" className="bg-[radial-gradient(ellipse_at_50%_100%,rgba(242,181,61,.08),transparent_60%)] text-center">
      {/* soft gold glow that slowly breathes behind the headline */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-[260px] -mt-[160px] h-[320px] w-[520px] animate-aura rounded-full bg-[radial-gradient(closest-side,rgba(242,181,61,.16),transparent)] max-[560px]:-ml-[180px] max-[560px]:w-[360px]"
      />
      <Container className="relative">
        <Reveal variant="blur">
          <h2 className="mx-auto max-w-[28ch] text-balance text-[clamp(27px,4.4vw,60px)] font-semibold leading-[1.08] tracking-[-0.025em] [text-shadow:0_4px_30px_rgba(5,10,7,.9)]">
            <TwoLine
              first="Stop funding leaks."
              second={
                <span className="animate-shimmer bg-[linear-gradient(90deg,#F2B53D_0%,#F2B53D_35%,#FFE7AE_50%,#F2B53D_65%,#F2B53D_100%)] bg-[length:200%_100%] bg-clip-text text-transparent [text-shadow:none]">
                  Start building revenue.
                </span>
              }
            />
          </h2>
          <Button size="lg" arrow onClick={openModal} className={`mt-8 ${ctaGlow} max-[560px]:w-full`}>
            Reserve My Free Session
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
