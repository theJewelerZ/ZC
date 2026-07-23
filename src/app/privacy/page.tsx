import type { Metadata } from "next";

import { businessConfig } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description:
    "How the Zarka Construction website handles contact information, site analytics, and service-provider processing.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="legal-page" id="main-content">
      <header className="legal-hero">
        <div className="site-container">
          <p className="eyebrow">Website information</p>
          <h1>Privacy</h1>
          <p>Effective {businessConfig.effectiveDate}</p>
        </div>
      </header>
      <article className="site-container legal-content">
        <p className="legal-intro">
          This notice explains how the Zarka Construction website handles
          information submitted through the consultation form, website
          analytics, and supporting service providers. It is not presented as
          attorney-reviewed legal advice.
        </p>

        <h2>Information you choose to provide</h2>
        <p>
          When online contact delivery is enabled, the consultation form asks
          for your name, email address, optional phone number, general project
          location, requested service, approximate timeline, project
          description, and optional referral source. Please do not submit
          payment information, account credentials, or highly sensitive data.
        </p>

        <h2>How contact information is used</h2>
        <p>
          Submitted information is used to review and respond to the inquiry,
          evaluate project fit, maintain basic security, and troubleshoot
          delivery. A form submission is not a construction agreement or a
          promise that work will be accepted.
        </p>

        <h2>Delivery and security providers</h2>
        <p>
          The website is hosted by Vercel. When online contact delivery is
          available, Resend processes contact email delivery. Cloudflare
          Turnstile may process technical request information to reduce
          automated abuse when its production credentials are enabled.
          The form also uses server validation, a hidden anti-spam field,
          timing checks, and a limited request-rate control.
        </p>
        <p>
          If secure email delivery is not configured, the form is disabled and
          information entered into it is not sent or stored by this website.
        </p>

        <h2>Analytics</h2>
        <p>
          The website uses Vercel Web Analytics when enabled to understand
          aggregate page use and a small set of events such as consultation CTA
          activation, successful form delivery, and visits to related project
          websites. Custom analytics events are not designed to include names,
          email addresses, phone numbers, project descriptions, or exact
          locations.
        </p>

        <h2>Retention and sharing</h2>
        <p>
          The website does not currently store inquiries in a separate lead
          database. Delivered inquiries may remain in the configured
          recipient&apos;s email system according to that system&apos;s operating
          and retention practices. Information is not sold through this
          website. Service providers process information only as needed to
          host, secure, measure, or deliver the website.
        </p>

        <h2>Notice updates</h2>
        <p>
          This notice may be revised when the form, analytics, storage,
          providers, or business contact practices materially change. The
          effective date above identifies the current published version.
        </p>
      </article>
    </main>
  );
}
