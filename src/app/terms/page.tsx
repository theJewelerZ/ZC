import type { Metadata } from "next";

import { businessConfig } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Website Terms",
  description:
    "Starter website terms for information and inquiries submitted through the Zarka Construction website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="legal-page" id="main-content">
      <header className="legal-hero">
        <div className="site-container">
          <p className="eyebrow">Website information</p>
          <h1>Terms</h1>
          <p>Effective {businessConfig.effectiveDate}</p>
        </div>
      </header>
      <article className="site-container legal-content">
        <p className="legal-intro">
          These starter terms explain the intended use of this marketing
          website. They are easy to revise as production contact details and
          business policies are confirmed and are not presented as
          attorney-reviewed legal advice.
        </p>

        <h2>Informational purpose</h2>
        <p>
          This website provides general information about Zarka Construction,
          potential project capabilities, specialty simulator environments, and
          related tools or businesses. Content may be updated as services and
          operating scope are confirmed.
        </p>

        <h2>No project agreement</h2>
        <p>
          A consultation request, email, phone conversation, website visit, or
          preliminary discussion does not create a construction contract,
          professional-services relationship, price commitment, schedule
          commitment, warranty, or obligation to accept work. Project terms must
          be documented separately by authorized parties.
        </p>

        <h2>Scope and trade coordination</h2>
        <p>
          Service descriptions are intentionally broad. The exact scope,
          responsibility, availability, and use of qualified trade partners are
          established for each project. This website does not represent that
          Zarka Construction self-performs every trade or service described.
        </p>

        <h2>Accuracy and availability</h2>
        <p>
          Reasonable care is taken with website content, but the site may not
          always be complete, current, or uninterrupted. Do not rely on website
          content as a substitute for a written project scope, site review,
          manufacturer documentation, or advice from an appropriately qualified
          professional.
        </p>

        <h2>Related websites</h2>
        <p>
          Links to CapProof, Precision Impact Screens, and other external sites
          are provided for context. Those websites operate under their own
          content, availability, privacy, and terms. A link does not add an
          unlisted warranty, certification, dealer relationship, or approval.
        </p>

        <h2>Website materials</h2>
        <p>
          Website text, layout, and brand materials may not be copied or
          represented as another business&apos;s work except as allowed by law
          or written permission. Third-party names and marks remain the property
          of their respective owners.
        </p>

        <h2>Updates</h2>
        <p>
          These terms may change when production contact information, business
          policies, or website functions are finalized. A confirmed public
          contact method for terms-related questions must be added before the
          production-domain cutover.
        </p>
      </article>
    </main>
  );
}

