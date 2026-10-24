import { Container } from "./ui/Container";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-white/10 bg-[#003a1c] pb-[70px] pt-8 max-[560px]:pb-[100px] text-[13.5px] text-[#d6e59a]">
      <Container className="grid gap-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ayurveda/logo.png" alt="Grow Medico" className="block h-[52px] w-auto" />
        <span>&copy; Grow Medico. All rights reserved.</span>
        <p className="max-w-[92ch]">
          Results shown are from one Ayurveda clinic client over the stated period. Individual results depend on location,
          services, capacity and spend, and are not guaranteed. This page does not offer medical advice.
        </p>
      </Container>
    </footer>
  );
}
