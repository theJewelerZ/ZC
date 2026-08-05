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
  title: "Custom Golf Simulator Room Builder",
  description: "Plan and build a custom indoor golf simulator room designed around the way you want to practice, play, and enjoy the game.",
  path: "/simulator-construction",
});

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom indoor golf simulator room building",
  description: "Planning and construction of custom residential and commercial spaces created for indoor golf.",
  url: new URL("/simulator-construction", businessConfig.canonicalUrl).toString(),
  provider: { "@type": "Organization", name: businessConfig.legalName, url: businessConfig.canonicalUrl },
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
  "A comfortable swing for the people who will play",
  "A screen and image that feel natural from the hitting position",
  "Clear movement through the room, on and off the hitting surface",
  "Protection that belongs visually within the finished environment",
  "Access that keeps the room practical as technology changes",
];

const constructionScope = [
  "A structure shaped around the playing experience",
  "Finish carpentry and trim that belong in the room",
  "A screen environment integrated with the architecture",
  "Protective surfaces that feel intentional",
  "Clear coordination across the approved project scope",
];

export default function SimulatorConstructionPage() {
  return (
    <main id="main-content">
      <section className="simulator-page-hero">
        <div className="simulator-page-grid" />
        <div className="site-container simulator-page-hero-inner">
          <div>
            <p className="eyebrow">Golf Simulator Room Builder</p>
            <h1>A better golf experience starts with the room.</h1>
            <p className="simulator-page-hero-copy">
              Zarka Construction plans and builds custom indoor golf simulator
              environments around the people who will play, the space they have,
              and the experience they want to create.
            </p>
            <div className="hero-actions">
              <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "simulator_page_hero" }} href={contactHref}>
                Request a Simulator Consultation <ArrowRightIcon />
              </TrackedLink>
              <Link className="button button-secondary" href="#planning">See How the Room Is Planned</Link>
            </div>
          </div>
          <SimulatorMedia label="THE ROOM / THE GAME" slot={simulatorImageSlots[0]} />
        </div>
      </section>

      <section className="section simulator-difference-section">
        <div className="site-container simulator-page-intro">
          <div><p className="eyebrow">The room-builder philosophy</p><h2>We don&apos;t build golf simulators. We build the spaces where great golf happens.</h2></div>
          <div className="simulator-page-prose">
            <p>A launch monitor and screen can make the technology work. The room determines whether the experience feels natural, comfortable, and worth returning to.</p>
            <p>Every relationship behind the finished space—from where you stand to what you see and how the room sounds, moves, and feels—should support the game.</p>
          </div>
        </div>
      </section>

      <section className="section simulator-detail-section" id="planning">
        <div className="site-container simulator-detail-grid">
          <SimulatorMedia label="PLAYER / ROOM / GAME" slot={simulatorImageSlots[1]} />
          <div>
            <p className="simulator-section-number">01 / ROOM PLANNING</p>
            <h2>Plan for a confident, comfortable swing.</h2>
            <p>Planning starts with the actual room and the people who will use it. Technical relationships matter because they determine whether you can swing freely, see the shot naturally, and move through the space without compromise.</p>
            <ul className="simulator-check-list">{planningChecks.map((item) => <li key={item}><CheckIcon /><span>{item}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section simulator-scope-section">
        <div className="site-container">
          <div className="simulator-scope-heading">
            <div><p className="simulator-section-number">02 / CRAFT</p><h2>Build a room that feels intentional.</h2></div>
            <p>Construction should fade into the finished experience. The structure, protection, surfaces, and details work together so the room feels complete rather than assembled around equipment.</p>
          </div>
          <div className="simulator-scope-grid">{constructionScope.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>)}</div>
        </div>
      </section>

      <section className="section simulator-system-section">
        <div className="site-container simulator-system-grid">
          <article>
            <p className="simulator-section-number">03 / THE SHOT</p>
            <h2>Every shot should feel natural.</h2>
            <p>The screen, enclosure, surrounding fabric, and available depth shape what you see and how confidently you can play. Zarka builds the room around the approved system without claiming to manufacture its technology components.</p>
          </article>
          <article>
            <p className="simulator-section-number">04 / THE ENVIRONMENT</p>
            <h2>Protection should feel like part of the room.</h2>
            <p>Wall and ceiling treatments help manage missed shots while creating a calm, resolved setting. Attachment, durability, access, and adjacent finishes are considered together—not left as decorative afterthoughts.</p>
          </article>
        </div>
      </section>

      <section className="section simulator-detail-section simulator-detail-section-alt">
        <div className="site-container simulator-detail-grid simulator-detail-grid-reverse">
          <div>
            <p className="simulator-section-number">05 / UNDERFOOT</p>
            <h2>A playing surface that feels connected.</h2>
            <p>The transition from stance to strike should feel natural. Turf, hitting surface, seams, surrounding flooring, doors, and trim are coordinated so the room looks finished and moves comfortably.</p>
          </div>
          <SimulatorMedia label="STANCE / STRIKE / PLAY" slot={simulatorImageSlots[2]} />
        </div>
      </section>

      <section className="section simulator-technology-section">
        <div className="site-container simulator-technology-grid">
          <div><p className="simulator-section-number">06 / THE DETAILS</p><h2>Technology belongs in the plan—not at the center of the room.</h2></div>
          <div className="simulator-page-prose">
            <p>Projection, lighting, power, data, ventilation, and service access matter because the best room lets you focus on golf rather than its infrastructure.</p>
            <p>Zarka coordinates room requirements with the approved equipment plan. Technology purchasing and licensed trade work remain separate unless explicitly included in the confirmed scope.</p>
          </div>
        </div>
      </section>

      <section className="section simulator-process-section">
        <div className="site-container">
          <div className="simulator-process-heading"><p className="eyebrow">How the room comes together</p><h2>From the first idea to a room ready for golf.</h2></div>
          <ol className="simulator-process-list">{simulatorProcess.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="section simulator-precision-section" id="room-review">
        <div className="site-container simulator-detail-grid">
          <SimulatorMedia label="LISTEN / REVIEW / PLAN" slot={simulatorImageSlots[3]} />
          <div>
            <p className="eyebrow">Two ways to begin</p>
            <h2>Start with the experience you want and the room you have.</h2>
            <p>An on-site consultation brings the conversation into the space when the location and scope make that appropriate. A guided remote review begins with measurements, photographs, intended players, and known equipment information shared during follow-up.</p>
            <p>The website does not accept uploads. Zarka will explain what to measure and photograph after the initial inquiry.</p>
          </div>
        </div>
      </section>

      <section className="section simulator-faq-section">
        <div className="site-container simulator-faq-grid">
          <div><p className="eyebrow">Frequently asked questions</p><h2>Good questions create better rooms.</h2></div>
          <div className="simulator-faq-list">{simulatorFaqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="simulator-page-cta">
        <div className="site-container simulator-page-cta-inner">
          <div><p className="eyebrow">Create the place you want to play</p><h2>Tell us what great golf at home—or at work—looks like to you.</h2><p>Share how you want to use the room, who will play, the space you have in mind, and any equipment already being considered. The first conversation will help establish the right review path.</p></div>
          <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "simulator_page_final" }} href={contactHref}>Request a Simulator Consultation <ArrowRightIcon /></TrackedLink>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} type="application/ld+json" />
    </main>
  );
}
