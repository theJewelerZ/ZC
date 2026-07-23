import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Request a Consultation",
  description:
    "Share your construction, specialty installation, or indoor golf simulator project with Zarka Construction.",
  path: "/contact",
});

export default function ContactPage() {
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
            <p className="eyebrow">Request a consultation</p>
            <h1>Start with the space, the work, and the constraints.</h1>
          </div>
          <p>
            Share enough context to begin a useful conversation. Zarka
            Construction will review the project type, general location,
            timeline, and scope before discussing fit or next steps.
          </p>
        </div>
      </section>

      <section className="section contact-form-section">
        <div className="site-container contact-layout">
          <aside className="contact-aside">
            <p className="contact-aside-number">01 / PROJECT CONTEXT</p>
            <h2>What helps at the start</h2>
            <ul>
              <li>The kind of space or project</li>
              <li>The general project location</li>
              <li>Your approximate timing</li>
              <li>The result or problem you are working toward</li>
            </ul>
            <p id="contact-disabled-context">
              Do not include payment information, account credentials, or other
              highly sensitive information.
            </p>
          </aside>
          <div>
            <ContactForm
              deliveryEnabled={deliveryEnabled}
              turnstileSiteKey={turnstileSiteKey}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

