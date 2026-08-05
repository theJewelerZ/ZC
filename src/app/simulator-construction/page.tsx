import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SimulatorMedia } from "@/components/simulator/simulator-media";
import { TrackedLink } from "@/components/tracked-link";
import { businessConfig } from "@/config/business";
import { simulatorFaqs, simulatorImageSlots, simulatorProcess } from "@/config/simulator";
import { createPageMetadata } from "@/lib/metadata";

const contactHref = "/contact?service=simulator-construction";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Simulator Construction Specialist",
  description:
    "Room evaluation, planning, specialty construction, impact environments, protection, turf, and finish work for premium golf simulator spaces.",
  path: "/simulator-construction",
});

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Golf simulator environment construction",
  description:
    "Defined specialty-construction scopes for golf simulator environments in homes and commercial golf settings.",
  url: new URL("/simulator-construction", businessConfig.canonicalUrl).toString(),
  provider: {
    "@type": "Organization",
    name: businessConfig.legalName,
    url: businessConfig.canonicalUrl,
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: simulatorFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const planningChecks = [
  "Comfortable swing clearance for the intended players",
  "A screen and image relationship suited to the hitting position",
  "Clear movement through the simulator area",
  "Protection appropriate to the room and anticipated use",
  "Practical access for installation, service, and future changes",
];

const constructionScope = [
  "Simulator-room preparation and framing",
  "Impact-screen structures and custom layered screens",
  "Wall and ceiling protection systems",
  "Turf, stance areas, and hitting surfaces",
  "Finish carpentry, trim, curtains, and detailing",
];

export default function SimulatorConstructionPage() {
  return (
    <main id="main-content">
      <section className="simulator-page-hero">
        <div className="simulator-page-grid" />
        <div className="site-container simulator-page-hero-inner">
          <div>
            <p className="eyebrow">Golf Simulator Construction Specialist</p>
            <h1>A better golf experience starts with a carefully prepared environment.</h1>
            <p className="simulator-page-hero-copy">
              Zarka Construction evaluates, plans, and completes defined
              specialty-construction scopes for golf simulator environments in
              homes and commercial golf settings.
            </p>
            <div className="hero-actions">
              <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "simulator_page_hero" }} href={contactHref}>
                Request a Simulator Consultation <ArrowRightIcon />
              </TrackedLink>
              <Link className="button button-secondary" href="#planning">See How the Space Is Evaluated</Link>
            </div>
          </div>
          <SimulatorMedia label="FINISHED ENVIRONMENT / REAL WORK" slot={simulatorImageSlots[3]} />
        </div>
      </section>

      <section className="section simulator-difference-section">
        <div className="site-container simulator-page-intro">
          <div>
            <p className="eyebrow">The specialist approach</p>
            <h2>We don&apos;t simply install equipment. We prepare the environment that allows a simulator experience to work.</h2>
          </div>
          <div className="simulator-page-prose">
            <p>
              A launch monitor, projector, and screen do not resolve the room by
              themselves. Player position, impact conditions, protection,
              surfaces, lighting, access, and finish details still have to work
              within the actual space.
            </p>
            <p>
              Zarka&apos;s role is the simulator environment and the work
              specifically included in its written scope—not equipment sales or
              responsibility for an entire home or commercial facility.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-detail-section" id="planning">
        <div className="site-container simulator-detail-grid">
          <SimulatorMedia label="ROOM EVALUATION / PLAYER POSITION" slot={simulatorImageSlots[0]} />
          <div>
            <p className="simulator-section-number">01 / ROOM EVALUATION</p>
            <h2>Start with the space and the people who will use it.</h2>
            <p>
              An initial evaluation considers the existing conditions, intended
              players, known equipment requirements, impact area, movement, and
              access. It helps shape a potential construction scope; it is not
              represented as architectural or engineering design.
            </p>
            <ul className="simulator-check-list">
              {planningChecks.map((item) => (
                <li key={item}><CheckIcon /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section simulator-scope-section">
        <div className="site-container">
          <div className="simulator-scope-heading">
            <div>
              <p className="simulator-section-number">02 / SPECIALTY CONSTRUCTION</p>
              <h2>Build the agreed simulator-environment scope with purpose.</h2>
            </div>
            <p>
              Depending on the room and written scope, Zarka&apos;s work may
              include preparation, framing, impact systems, protection, turf,
              finish carpentry, curtains, trim, and final detailing.
            </p>
          </div>
          <div className="simulator-scope-grid">
            {constructionScope.map((item, index) => (
              <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section simulator-system-section">
        <div className="site-container simulator-system-grid">
          <article>
            <p className="simulator-section-number">03 / IMPACT ENVIRONMENT</p>
            <h2>Plan the impact area as part of the room.</h2>
            <p>
              Screen structures, custom layered impact screens, curtains,
              enclosure depth, adjacent protection, and access affect both play
              and construction. The selected approach is confirmed for the
              individual room and agreed scope.
            </p>
          </article>
          <article>
            <p className="simulator-section-number">04 / PROTECTION</p>
            <h2>Integrate protection with the finished environment.</h2>
            <p>
              Wall and ceiling protection can help address missed shots while
              supporting a calm, resolved room. Coverage, attachment,
              durability, access, and finish transitions are considered for the
              anticipated use of the space.
            </p>
          </article>
        </div>
      </section>

      <section className="section simulator-detail-section simulator-detail-section-alt">
        <div className="site-container simulator-detail-grid simulator-detail-grid-reverse">
          <div>
            <p className="simulator-section-number">05 / PLAYING SURFACE</p>
            <h2>Coordinate turf and hitting surfaces with the room.</h2>
            <p>
              Turf height, stance area, hitting-surface thickness, seams,
              transitions, player position, doors, and adjacent trim can affect
              both use and finished appearance. The relevant layers are defined
              as part of the simulator-environment scope.
            </p>
          </div>
          <SimulatorMedia label="TURF / HITTING SURFACE / DETAIL" slot={simulatorImageSlots[2]} />
        </div>
      </section>

      <section className="section simulator-technology-section">
        <div className="site-container simulator-technology-grid">
          <div>
            <p className="simulator-section-number">06 / COORDINATION</p>
            <h2>Prepare the environment around known technology requirements.</h2>
          </div>
          <div className="simulator-page-prose">
            <p>
              Projector location, lighting, power, data, ventilation, mounting,
              and service access may affect the construction plan even when
              Zarka is not supplying the equipment.
            </p>
            <p>
              Equipment purchasing remains separate. Electrical, mechanical,
              permit, architectural, engineering, and other professional or
              licensed responsibilities are assigned separately or coordinated
              with appropriate parties when included in the written scope.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-process-section">
        <div className="site-container">
          <div className="simulator-process-heading">
            <p className="eyebrow">How the work is approached</p>
            <h2>From an initial room review to a clearly defined result.</h2>
          </div>
          <ol className="simulator-process-list">
            {simulatorProcess.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section simulator-precision-section" id="room-review">
        <div className="site-container simulator-detail-grid">
          <SimulatorMedia label="LISTEN / REVIEW / DEFINE" slot={simulatorImageSlots[0]} />
          <div>
            <p className="eyebrow">Two ways to begin</p>
            <h2>Start with an honest review of the space.</h2>
            <p>
              When appropriate, an on-site consultation documents existing
              conditions directly. A guided remote review begins with
              measurements, photographs, intended players, and known equipment
              information shared during follow-up.
            </p>
            <p>
              Either approach is an initial step. Feasibility, responsibilities,
              and construction commitments are established only through
              project-specific review and written scope.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-faq-section">
        <div className="site-container simulator-faq-grid">
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h2>Clear answers support better project decisions.</h2>
          </div>
          <div className="simulator-faq-list">
            {simulatorFaqs.map((item) => (
              <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="simulator-page-cta">
        <div className="site-container simulator-page-cta-inner">
          <div>
            <p className="eyebrow">Begin with the space—not a package</p>
            <h2>Tell us what you want the simulator environment to support.</h2>
            <p>
              Share the intended use, players, general location, existing room,
              known equipment information, and current project stage. The first
              conversation is used to understand potential fit and the right
              review path.
            </p>
          </div>
          <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "simulator_page_final" }} href={contactHref}>
            Request a Simulator Consultation <ArrowRightIcon />
          </TrackedLink>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} type="application/ld+json" />
    </main>
  );
}
