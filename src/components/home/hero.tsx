import { BrandMark } from "@/components/brand-mark";
import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";
import { businessConfig } from "@/config/business";

function BrandArtwork() {
  return (
    <div aria-hidden="true" className="structural-diagram">
      <div className="diagram-frame">
        <div className="brand-artwork-halo" />
        <div className="diagram-axis diagram-axis-x" />
        <div className="diagram-axis diagram-axis-y" />
        <BrandMark className="hero-brand-mark" format="icon" surface="dark" />
        <div className="diagram-label diagram-label-a">ROOM GEOMETRY</div>
        <div className="diagram-label diagram-label-b">PLAYER / SCREEN / SYSTEM</div>
        <div className="diagram-coordinate">CUSTOM SIMULATOR ENVIRONMENTS</div>
      </div>
      <p>Room planning and construction organized around the technology.</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-overlay" />
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Golf Simulator Room Builder</p>
          <h1>
            We Build the Room
            <span>Around the Technology.</span>
          </h1>
          <p className="hero-description">
            Custom indoor golf simulator rooms designed around your space, your
            equipment, and the way you play.
          </p>
          <p className="hero-credibility">
            From room feasibility and framing to impact protection, finish work,
            turf, lighting, and installation coordination, Zarka Construction
            delivers the complete build environment.
          </p>
          <div className="hero-actions">
            <TrackedLink
              className="button button-primary"
              eventName="consultation_cta_click"
              eventProperties={{ placement: "hero" }}
              href="/contact?service=simulator-construction"
            >
              Plan Your Simulator Room
              <ArrowRightIcon />
            </TrackedLink>
            <TrackedLink
              className="button button-secondary"
              eventName="planning_process_click"
              eventProperties={{ placement: "hero" }}
              href="/#planning-process"
            >
              How Room Planning Works
            </TrackedLink>
          </div>
          <p className="hero-tagline">{businessConfig.tagline}</p>
        </div>
        <BrandArtwork />
      </div>
    </section>
  );
}