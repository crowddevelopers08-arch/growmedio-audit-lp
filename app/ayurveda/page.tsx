import { LandingProvider } from "@/components/ayurveda/LandingProvider";
import { LotusCanvas } from "@/components/ayurveda/LotusCanvas";
import { Banner } from "@/components/ayurveda/Banner";
import { Navbar } from "@/components/ayurveda/Navbar";
import { DiveHero } from "@/components/ayurveda/DiveHero";
import { ProblemSection } from "@/components/ayurveda/ProblemSection";
import { LeaksSection } from "@/components/ayurveda/LeaksSection";
import { SessionSection } from "@/components/ayurveda/SessionSection";
import { OutcomesSection } from "@/components/ayurveda/OutcomesSection";
import { FitSection } from "@/components/ayurveda/FitSection";
import { WhyAboutSection } from "@/components/ayurveda/WhyAboutSection";
import { ProofSection } from "@/components/ayurveda/ProofSection";
import { ProcessSection } from "@/components/ayurveda/ProcessSection";
import { FaqSection } from "@/components/ayurveda/FaqSection";
import { FinalCta } from "@/components/ayurveda/FinalCta";
import { Footer } from "@/components/ayurveda/Footer";
import { SageWidget } from "@/components/ayurveda/SageWidget";
import { LeadModal } from "@/components/ayurveda/LeadModal";

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
        <WhyAboutSection />
        <ProofSection />
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
