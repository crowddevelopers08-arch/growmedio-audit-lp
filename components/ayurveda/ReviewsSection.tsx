import { TESTIMONIALS } from "@/lib/testimonials";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

/* Ayurveda clients to show, by their credit in lib/testimonials.ts. Quotes only ever come from that list. */
const CLIENTS = ["Team Ayush Ortho", "Team AVN", "Team VK Ayurveda", "Team Madhavbaug"];

/* A client goes live once their approved words are in that list. Until then their card appears only on
   the local dev server, with dummy text, so a production build can never show an invented review. */
const SHOW_SAMPLES = process.env.NODE_ENV !== "production";

const REVIEWS = TESTIMONIALS.filter((t) => CLIENTS.includes(t.name) && (t.consentOnFile || (SHOW_SAMPLES && t.sample))).map((t) => ({
  name: t.name,
  detail: t.city ? `${t.specialty} · ${t.city}` : t.specialty,
  quote: t.consentOnFile ? t.quote : (t.sample ?? ""),
}));

/** Written reviews from Ayurveda clients. */
export function ReviewsSection() {
  return (
    <Section id="reviews">
      <Container>
        <SectionHead center kicker="In their own words" title="What our Ayurveda clients say." />
        <Reveal variant="scale" className="mt-10 max-[560px]:mt-8">
          <ReviewsCarousel reviews={REVIEWS} />
        </Reveal>
      </Container>
    </Section>
  );
}
