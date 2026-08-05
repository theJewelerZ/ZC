import type { Metadata } from "next";

import { AboutSection } from "@/components/home/about-section";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { Hero } from "@/components/home/hero";
import { PlanningProcessSection } from "@/components/home/planning-process-section";
import { ServicesSection } from "@/components/home/services-section";
import { SimulatorSection } from "@/components/home/simulator-section";
import { WhySection } from "@/components/home/why-section";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Simulator Construction Specialist",
  description:
    "Specialty construction for premium golf simulator environments, from room evaluation and planning through protection, turf, carpentry, and finish details.",
  path: "/",
});

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ExperienceSection />
      <SimulatorSection />
      <ServicesSection />
      <PlanningProcessSection />
      <CapabilitiesSection />
      <WhySection />
      <AboutSection />
      <ContactCtaSection />
    </main>
  );
}
