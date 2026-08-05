import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SimulatorMedia } from "@/components/simulator/simulator-media";
import { TrackedLink } from "@/components/tracked-link";
import { businessConfig } from "@/config/business";
import {
  simulatorFaqs,
  simulatorImageSlots,
  simulatorProcess,
} from "@/config/simulator";
import { createPageMetadata } from "@/lib/metadata";

const contactHref = "/contact?service=simulator-construction";

export const metadata: Metadata = createPageMetadata({
  title: "Custom Golf Simulator Room Builder",
  description:
    "Plan a custom residential or commercial golf simulator room around clearances, screen geometry, construction, protection, turf, lighting, projection, and finish details.",
  path: "/simulator-construction",
});

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom indoor golf simulator room construction",
  description:
    "Planning and construction for coordinated residential and commercial indoor golf simulator rooms.",
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
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const planningChecks = [
  "Usable room width, depth, and ceiling height",
  "Right- and left-handed swing envelopes",
  "Screen location, enclosure depth, and safe setback",
  "Projector sightlines and potential obstructions",
  "Access for installation, service, and equipment changes",
];

const constructionScope = [
  "Framing and approved room modifications",
  "Finish carpentry, trim, and built-in details",
  "Enclosure support and finished-room integration",
  "Blackout, netting, and protection-system installation support",
  "Coordination with required licensed trades",
];

export default function SimulatorConstructionPage() {
  return (
    <main id="main-content">
      <section className="simulator-page-hero">
        <div className="simulator-page-grid" />
        <div className="site-container simulator-page-hero-inner">
          <div>
            <p className="eyebrow">Golf Simulator Room Builder</p>
            <h1>We build the room around the technology.</h1>
            <p className="simulator-page-hero-copy">
              Zarka Construction plans and builds custom indoor golf simulator
              rooms around the space, intended players, equipment requirements,
              and the way the finished room needs to work.
            </p>
            <div className="hero-actions">
              <TrackedLink
                className="button button-primary"
                eventName="consultation_cta_click"
                eventProperties={{ placement: "simulator_page_hero" }}
                href={contactHref}
              >
                Start Your Room Review
                <ArrowRightIcon />
              </TrackedLink>
              <Link className="button button-secondary" href="#planning">
                Review the Planning Scope
              </Link>
            </div>
          </div>
          <SimulatorMedia label="FEASIBILITY / CLEARANCE" slot={simulatorImageSlots[0]} />
        </div>
      </section>

      <section className="section simulator-difference-section">
        <div className="site-container simulator-page-intro">
          <div>
            <p className="eyebrow">What makes the work different</p>
            <h2>A finished simulator is a coordinated built environment.</h2>
          </div>
          <div className="simulator-page-prose">
            <p>
              A simulator can combine structure, moving players, repeated ball
              impact, projection, controlled light, floor transitions, and
              serviceable technology in one room. Decisions made for one part
              of the system affect the others.
            </p>
            <p>
              The construction plan should account for those relationships
              before finishes conceal access or lock the equipment into a
              layout that is difficult to maintain.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-detail-section" id="planning">
        <div className="site-container simulator-detail-grid">
          <SimulatorMedia label="ROOM / PLAYER / SCREEN" slot={simulatorImageSlots[1]} />
          <div>
            <p className="simulator-section-number">01 / FEASIBILITY</p>
            <h2>Room feasibility and planning</h2>
            <p>
              Planning starts with the actual room and intended users—not a
              generic equipment diagram. The available envelope needs to
              support the swing, hitting position, screen, enclosure,
              projection path, and safe movement through the space.
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
              <p className="simulator-section-number">02 / CONSTRUCTION</p>
              <h2>Construction and finish scope</h2>
            </div>
            <p>
              The approved scope can bring framing, finish carpentry,
              protection, and enclosure details into one coherent room while
              keeping licensed-trade responsibilities explicit.
            </p>
          </div>
          <div className="simulator-scope-grid">
            {constructionScope.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section simulator-system-section">
        <div className="site-container simulator-system-grid">
          <article>
            <p className="simulator-section-number">03 / IMPACT ENVIRONMENT</p>
            <h2>Impact-screen and enclosure systems</h2>
            <p>
              Screen size, mounting approach, tension, enclosure depth,
              surrounding fabric, and access all influence the construction
              envelope. The room should support the selected system without
              implying that Zarka manufactures every component.
            </p>
          </article>
          <article>
            <p className="simulator-section-number">04 / PROTECTION</p>
            <h2>Protective wall and ceiling systems</h2>
            <p>
              Wall and ceiling treatments help manage missed shots and create a
              resolved visual environment. Attachment, durability, access, and
              transitions to adjacent finishes are considered as construction
              details rather than decorative afterthoughts.
            </p>
          </article>
        </div>
      </section>

      <section className="section simulator-detail-section simulator-detail-section-alt">
        <div className="site-container simulator-detail-grid simulator-detail-grid-reverse">
          <div>
            <p className="simulator-section-number">05 / PLAYING SURFACE</p>
            <h2>Turf, hitting area, and flooring coordination</h2>
            <p>
              Turf height, hitting-surface thickness, stance position, seams,
              transitions, and the surrounding floor affect both use and the
              finished appearance. These layers need to align with doors,
              trim, equipment, and the planned hitting geometry.
            </p>
          </div>
          <SimulatorMedia label="TURF / HITTING AREA" slot={simulatorImageSlots[2]} />
        </div>
      </section>

      <section className="section simulator-technology-section">
        <div className="site-container simulator-technology-grid">
          <div>
            <p className="simulator-section-number">06 / COORDINATION</p>
            <h2>Projector, lighting, and technology coordination</h2>
          </div>
          <div className="simulator-page-prose">
            <p>
              Projector location, image path, ceiling protection, ambient
              light, equipment power, data, and ventilation needs should be
              coordinated before final surfaces are closed.
            </p>
            <p>
              Zarka Construction coordinates the room requirements with the
              approved equipment plan. Technology purchasing and licensed
              electrical or other trade work remain separate unless explicitly
              included in the confirmed project scope.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-process-section">
        <div className="site-container">
          <div className="simulator-process-heading">
            <p className="eyebrow">Typical project process</p>
            <h2>Decisions in the right order.</h2>
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
          <SimulatorMedia label="REVIEW / MEASURE / PLAN" slot={simulatorImageSlots[3]} />
          <div>
            <p className="eyebrow">Two ways to begin</p>
            <h2>Every room is evaluated before the build is defined.</h2>
            <p>
              An on-site consultation documents the room directly when the
              location and scope make that appropriate. A guided remote review
              begins with measurements, photographs, intended players, and
              known equipment information shared during the follow-up process.
            </p>
            <p>
              The website does not accept uploads. Zarka will explain what to
              measure and photograph after the initial inquiry.
            </p>
          </div>
        </div>
      </section>

      <section className="section simulator-faq-section">
        <div className="site-container simulator-faq-grid">
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h2>Useful questions before construction starts.</h2>
          </div>
          <div className="simulator-faq-list">
            {simulatorFaqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="simulator-page-cta">
        <div className="site-container simulator-page-cta-inner">
          <div>
            <p className="eyebrow">Start with a room review</p>
            <h2>Find out what the room can support before construction begins.</h2>
            <p>
              Share the room, intended players, general location, known
              equipment, and current project stage. Choose an on-site
              consultation or guided remote room review as the preferred first step.
            </p>
          </div>
          <TrackedLink
            className="button button-primary"
            eventName="consultation_cta_click"
            eventProperties={{ placement: "simulator_page_final" }}
            href={contactHref}
          >
            Start Your Room Review <ArrowRightIcon />
          </TrackedLink>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} type="application/ld+json" />
    </main>
  );
}
