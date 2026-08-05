import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { isServiceOptionValue } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Plan Your Golf Simulator Room",
  description:
    "Start an on-site consultation or guided remote room review for a custom residential or commercial golf simulator room.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestedService = (await searchParams).service;
  const initialService =
    typeof requestedService === "string" && isServiceOptionValue(requestedService)
      ? requestedService
      : "simulator-construction";
  const deliveryEnabled = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_RECIPIENT_EMAIL &&
      process.env.CONTACT_FROM_EMAIL,
  );
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.TURNSTILE_SECRET_KEY
      ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      : null;

  if (!deliveryEnabled) {
    console.warn(
      JSON.stringify({
        event: "contact_delivery_configuration_missing",
        required: [
          "RESEND_API_KEY",
          "CONTACT_RECIPIENT_EMAIL",
          "CONTACT_FROM_EMAIL",
        ],
      }),
    );
  }

  if (!turnstileSiteKey) {
    console.warn(
      JSON.stringify({
        event: "contact_turnstile_configuration_missing",
        protection: "honeypot_timing_validation_and_best_effort_rate_limit",
      }),
    );
  }

  return (
    <main className="contact-page" id="main-content">
      <section className="contact-hero">
        <div className="site-container contact-hero-grid">
          <div>
            <p className="eyebrow">Plan your simulator room</p>
            <h1>Start with a review of the actual space.</h1>
          </div>
          <p>
            Every simulator room depends on dimensions, player position, screen
            geometry, protection, projection, and construction constraints.
            Choose the review approach that best fits the project.
          </p>
        </div>
      </section>

      <section className="section contact-form-section" id="review-options">
        <div className="site-container contact-layout">
          <aside className="contact-aside">
            <p className="contact-aside-number">01 / ROOM REVIEW</p>
            <h2>Two ways to begin</h2>
            <div className="contact-review-option">
              <h3>On-site consultation</h3>
              <p>
                Review the dimensions, structure, access, obstructions, and
                existing finishes in person when the location and scope make an
                on-site visit appropriate.
              </p>
            </div>
            <div className="contact-review-option">
              <h3>Guided remote room review</h3>
              <p>
                Begin with guided measurements and room photographs. Zarka will
                explain what is needed after the initial inquiry; this website
                does not accept uploads.
              </p>
            </div>
            <p id="contact-disabled-context">
              Do not include payment information, account credentials, or other
              highly sensitive information.
            </p>
          </aside>
          <div>
            <ContactForm
              deliveryEnabled={deliveryEnabled}
              initialService={initialService}
              turnstileSiteKey={turnstileSiteKey}
            />
          </div>
        </div>
      </section>
    </main>
  );
}