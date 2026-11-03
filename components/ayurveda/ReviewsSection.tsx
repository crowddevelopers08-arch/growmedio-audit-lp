import { PUBLISHABLE } from "@/lib/testimonials";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

/* Clients to show, by their credit in lib/testimonials.ts. Only their own approved words ever appear, so
   VK Ayurveda and Madhavbaug join the row once consentOnFile is true for them. */
const CLIENTS = ["Team Ayush Ortho", "Team AVN", "Team Dr. Shreevarma’s Wellness", "Team VK Ayurveda", "Team Madhavbaug"];

const REVIEWS = CLIENTS.flatMap((name) => PUBLISHABLE.filter((t) => t.name === name)).map((t) => ({
  name: t.name,
  detail: t.city ? `${t.specialty} · ${t.city}` : t.specialty,
  quote: t.quote,
}));

/** Written reviews from clients. */
export function ReviewsSection() {
  return (
    <Section id="reviews">
      <Container>
        <SectionHead center kicker="In their own words" title="What our clients say." />
        <Reveal variant="scale" className="mt-10 max-[560px]:mt-8">
          <ReviewsCarousel reviews={REVIEWS} />
        </Reveal>
      </Container>
    </Section>
  );
}
