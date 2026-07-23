import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";
import { businessConfig } from "@/config/business";

function StructuralDiagram() {
  return (
    <div aria-hidden="true" className="structural-diagram">
      <div className="diagram-frame">
        <div className="diagram-axis diagram-axis-x" />
        <div className="diagram-axis diagram-axis-y" />
        <div className="diagram-member diagram-member-a" />
        <div className="diagram-member diagram-member-b" />
        <div className="diagram-member diagram-member-c" />
        <div className="diagram-node diagram-node-a" />
        <div className="diagram-node diagram-node-b" />
        <div className="diagram-label diagram-label-a">01 / PLAN</div>
        <div className="diagram-label diagram-label-b">02 / BUILD</div>
        <div className="diagram-label diagram-label-c">03 / PROVE</div>
        <div className="diagram-coordinate">42°18&apos; / FIELD SYSTEM</div>
      </div>
      <p>
        Integrated thinking for the room, the finish, and the work behind it.
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-overlay" />
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Construction · Specialty installation</p>
          <h1>
            Construction experience.
            <span>Modern project execution.</span>
          </h1>
          <p className="hero-description">
            Zarka Construction combines hands-on craftsmanship, specialty
            installation, and modern construction tools to plan, document, and
            deliver better projects.
          </p>
          <div className="hero-actions">
            <TrackedLink
              className="button button-primary"
              eventName="consultation_cta_click"
              eventProperties={{ placement: "hero" }}
              href="/contact"
            >
              Request a Consultation
              <ArrowRightIcon />
            </TrackedLink>
            <TrackedLink
              className="button button-secondary"
              eventName="explore_work_click"
              eventProperties={{ placement: "hero" }}
              href="/#work"
            >
              Explore Our Work
            </TrackedLink>
          </div>
          <p className="hero-tagline">{businessConfig.tagline}</p>
        </div>
        <StructuralDiagram />
      </div>
    </section>
  );
}

