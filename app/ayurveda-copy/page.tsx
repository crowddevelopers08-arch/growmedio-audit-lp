import { LandingProvider } from "@/components/ayurveda-copy/LandingProvider";
import { LotusCanvas } from "@/components/ayurveda-copy/LotusCanvas";
import { Banner } from "@/components/ayurveda-copy/Banner";
import { Navbar } from "@/components/ayurveda-copy/Navbar";
import { DiveHero } from "@/components/ayurveda-copy/DiveHero";
import { ProblemSection } from "@/components/ayurveda-copy/ProblemSection";
import { LeaksSection } from "@/components/ayurveda-copy/LeaksSection";
import { SessionSection } from "@/components/ayurveda-copy/SessionSection";
import { OutcomesSection } from "@/components/ayurveda-copy/OutcomesSection";
import { FitSection } from "@/components/ayurveda-copy/FitSection";
import { AboutSection } from "@/components/ayurveda-copy/AboutSection";
import { ProofSection } from "@/components/ayurveda-copy/ProofSection";
import { VideoSection } from "@/components/ayurveda-copy/VideoSection";
import { ReviewsSection } from "@/components/ayurveda-copy/ReviewsSection";
import { ProcessSection } from "@/components/ayurveda-copy/ProcessSection";
import { FaqSection } from "@/components/ayurveda-copy/FaqSection";
import { FinalCta } from "@/components/ayurveda-copy/FinalCta";
import { Footer } from "@/components/ayurveda-copy/Footer";
import { SageWidget } from "@/components/ayurveda-copy/SageWidget";
import { LeadModal } from "@/components/ayurveda-copy/LeadModal";

export default function AyurvedaPage() {
  return (
    <LandingProvider>
      <LotusCanvas />
      <Banner />
      <Navbar />
      <main id="top" className="relative z-[1]">
        <DiveHero />
        <ProblemSection />
        <LeaksSection />
        <SessionSection />
        <OutcomesSection />
        <FitSection />
        <AboutSection />
        <ProofSection />
        <VideoSection />
        <ReviewsSection />
        <ProcessSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <SageWidget />
      <LeadModal />
    </LandingProvider>
  );
}
