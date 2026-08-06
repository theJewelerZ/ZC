import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";
import { isServiceOptionValue } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedBuildContext } from "@/lib/projects/repository";
import { getSupabasePublicConfig, isConsultationBackendConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = createPageMetadata({
  title: "Request a Simulator Consultation",
  description: "Start a secure conversation about the space, intended use, and potential specialty-construction scope for a golf simulator environment.",
  path: "/contact",
});

type ContactPageProps = { searchParams: Promise<{ service?: string | string[]; build?: string | string[] }> };

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requested = await searchParams;
  const initialService = typeof requested.service === "string" && isServiceOptionValue(requested.service)
    ? requested.service : "simulator-construction";
  const sourceBuild = typeof requested.build === "string"
    ? await getPublishedBuildContext(requested.build)
    : null;
  const deliveryEnabled = isConsultationBackendConfigured();
  const supabaseConfig = deliveryEnabled ? getSupabasePublicConfig() : null;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null;

  if (!deliveryEnabled) console.warn(JSON.stringify({
    event: "consultation_backend_configuration_missing",
    required: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
  }));
  if (!turnstileSiteKey) console.warn(JSON.stringify({
    event: "contact_turnstile_configuration_missing",
    protection: "honeypot_timing_validation_and_best_effort_rate_limit",
  }));

  return <main className="contact-page" id="main-content">
    <section className="contact-hero"><div className="site-container contact-hero-grid"><div><p className="eyebrow">Request a simulator consultation</p><h1>Every project begins with understanding the space.</h1></div><p>Tell us how the simulator environment will be used, who will play, what conditions already exist, and what equipment is being considered. The purpose is to begin a practical conversation—not to sell a package or quote equipment.</p></div></section>
    <section className="section contact-form-section" id="review-options"><div className="site-container contact-layout"><aside className="contact-aside"><p className="contact-aside-number">01 / INITIAL ROOM REVIEW</p><h2>Two ways a conversation can begin</h2><div className="contact-review-option"><h3>On-site consultation</h3><p>When location and potential scope make a visit appropriate, Zarka can review existing conditions, intended use, constraints, and the simulator-environment work being considered.</p></div><div className="contact-review-option"><h3>Guided remote room review</h3><p>A remote review can begin with guided measurements, optional room photographs, intended players, and known equipment information. It is an initial evaluation, not a final feasibility or construction commitment.</p></div><p id="contact-disabled-context">Do not include payment information, account credentials, private documents, or photographs of people without permission.</p></aside><div>{sourceBuild ? <div className="contact-build-context"><p className="eyebrow">Inside the Build</p><h2>Ask about a Build like this.</h2><p>Your consultation will include context from <strong>{sourceBuild.title}</strong>. The room will still be evaluated on its own conditions and intended use.</p><Link href={`/projects/${sourceBuild.slug}`}>Return to this Build</Link></div> : null}<ContactForm deliveryEnabled={deliveryEnabled} initialService={initialService} sourceBuild={sourceBuild ? { slug: sourceBuild.slug, title: sourceBuild.title } : null} supabaseConfig={supabaseConfig} turnstileSiteKey={turnstileSiteKey} /></div></div></section>
  </main>;
}
