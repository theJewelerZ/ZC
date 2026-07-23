import type { Metadata } from "next";

import { AboutSection } from "@/components/home/about-section";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { EcosystemSection } from "@/components/home/ecosystem-section";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { SimulatorSection } from "@/components/home/simulator-section";
import { WhySection } from "@/components/home/why-section";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Construction Experience. Modern Project Execution.",
  description:
    "Zarka Construction combines hands-on construction, specialty installation, indoor golf simulator environments, and modern project support.",
  path: "/",
});

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ServicesSection />
      <SimulatorSection />
      <WhySection />
      <CapabilitiesSection />
      <EcosystemSection />
      <AboutSection />
      <ContactCtaSection />
    </main>
  );
}

