import type { Metadata } from "next";

import { businessConfig } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Website Terms",
  description:
    "Website terms for information and simulator-room inquiries submitted through the Zarka Construction website.",
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
          These terms explain the intended use of the Zarka Construction
          marketing website. They are not presented as attorney-reviewed legal
          advice.
        </p>

        <h2>Informational purpose</h2>
        <p>
          This website provides general information about custom indoor golf
          simulator room planning, construction, specialty installation, and
          supporting construction capabilities. Content may be updated as
          services and operating scope are confirmed.
        </p>

        <h2>No project agreement</h2>
        <p>
          A consultation request, remote room review, on-site discussion,
          email, phone conversation, or website visit does not create a
          construction contract, professional-services relationship, price
          commitment, schedule commitment, warranty, or obligation to accept
          work. Project terms must be documented separately by authorized parties.
        </p>

        <h2>Room review and project scope</h2>
        <p>
          Website descriptions and preliminary room-review discussions do not
          establish final feasibility or scope. Dimensions, player clearances,
          equipment requirements, structure, access, and other constraints must
          be reviewed for the individual space. Exact responsibilities and any
          qualified trade coordination are established for each project.
        </p>

        <h2>Equipment and trade responsibilities</h2>
        <p>
          The website does not represent Zarka Construction as the manufacturer
          or seller of every simulator technology component. Equipment
          selection, purchasing, manufacturer requirements, electrical work,
          and other licensed trade responsibilities are confirmed separately
          unless explicitly included in a written project scope.
        </p>

        <h2>Accuracy and availability</h2>
        <p>
          Reasonable care is taken with website content, but the site may not
          always be complete, current, or uninterrupted. Do not rely on website
          content as a substitute for a written project scope, room review,
          manufacturer documentation, or advice from an appropriately qualified
          professional.
        </p>

        <h2>Website materials</h2>
        <p>
          Website text, layout, project photography, and brand materials may not
          be copied or represented as another business&apos;s work except as allowed
          by law or written permission. Third-party names and marks remain the
          property of their respective owners.
        </p>

        <h2>Updates</h2>
        <p>
          These terms may change when business policies or website functions
          materially change. The effective date above identifies the current
          published version.
        </p>
      </article>
    </main>
  );
}