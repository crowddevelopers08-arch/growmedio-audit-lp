import AnnouncementBar from "@/components/sections/AnnouncementBar";
import SiteHeader from "@/components/sections/SiteHeader";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import ShiftSection from "@/components/sections/ShiftSection";
import ProofSection from "@/components/sections/ProofSection";
import CampaignsSection from "@/components/sections/CampaignsSection";
import OfferSection from "@/components/sections/OfferSection";
import StepsSection from "@/components/sections/StepsSection";
import FounderSection from "@/components/sections/FounderSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";
import SiteFooter from "@/components/sections/SiteFooter";
import MobileBar from "@/components/sections/MobileBar";
import { BookingProvider } from "@/components/booking/BookingProvider";

export default function Page() {
  return (
    <BookingProvider>
      <a
        href="#main"
        className="absolute top-0 -left-[999px] z-[200] rounded-br-lg bg-brand px-4 py-2.5 font-semibold text-[#04140D] focus:left-0"
      >
        Skip to content
      </a>

      <AnnouncementBar />
      <SiteHeader />

      <main id="main">
        <Hero />
        <ProblemSection />
        <ShiftSection />
        <ProofSection />
        <CampaignsSection />
        <OfferSection />
        <StepsSection />
        <FounderSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
      </main>

      <SiteFooter />
      <MobileBar />
    </BookingProvider>
  );
}
