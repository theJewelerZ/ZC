import type { Metadata } from "next";

import { businessConfig } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Website Terms",
  description:
    "Website terms for information and golf simulator environment inquiries submitted through the Zarka Construction website.",
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
          marketing website. They are not presented as attorney-reviewed legal advice.
        </p>

        <h2>Informational purpose</h2>
        <p>
          This website provides general information about room evaluation,
          construction planning, and specialty construction for golf simulator
          environments. Content may be updated as services and operating scope
          are confirmed.
        </p>

        <h2>Business scope and qualifications</h2>
        <p>
          Zarka Construction is presented on this website as a Golf Simulator
          Construction Specialist. Website content does not represent Zarka as
          an equipment dealer or manufacturer, an architectural or engineering
          provider, the general contractor for an entire home or commercial
          facility, or the party automatically responsible for permits or every
          licensed trade. Actual responsibilities depend on the individual
          project and written scope.
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
          establish final feasibility or scope. Existing conditions, dimensions,
          player clearances, equipment requirements, structure, access, permits,
          and other constraints must be considered for the individual space.
          Zarka&apos;s work, customer and equipment-provider responsibilities,
          and any qualified-trade coordination are established in writing.
        </p>

        <h2>Equipment, permits, and professional responsibilities</h2>
        <p>
          Equipment selection, purchasing, manufacturer requirements,
          warranties, permits, architectural or engineering work, electrical
          work, mechanical work, and other professional or licensed-trade
          responsibilities remain separate unless explicitly assigned in a
          written project scope by an appropriately authorized party.
        </p>

        <h2>Commercial settings</h2>
        <p>
          References to teaching studios, commercial golf spaces,
          entertainment venues, simulator businesses, country clubs, or
          training environments describe settings in which simulator-environment
          work may be considered. They do not state that Zarka constructs or
          assumes responsibility for an entire commercial facility.
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
          Website text, layout, approved project photography, and brand
          materials may not be copied or represented as another business&apos;s
          work except as allowed by law or written permission. Third-party names
          and marks remain the property of their respective owners.
        </p>

        <h2>Updates</h2>
        <p>
          These terms may change when business policies, scope, or website
          functions materially change. The effective date above identifies the
          current published version.
        </p>
      </article>
    </main>
  );
}
