import { Container } from "./ui/Container";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-ay-line pb-[70px] pt-8 max-[560px]:pb-[100px] text-[15px] font-medium text-ay-muted">
      <Container className="grid gap-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/gm-logo-dark.png" alt="Grow Medico" className="block h-[44px] w-auto" />
        <span>&copy; Grow Medico. All rights reserved.</span>
        <p className="max-w-[92ch]">
          Results shown are from one Ayurveda clinic client over the stated period. Individual results depend on location,
          services, capacity and spend, and are not guaranteed. This page does not offer medical advice.
        </p>
      </Container>
    </footer>
  );
}
