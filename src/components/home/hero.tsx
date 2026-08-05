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
        <div className="diagram-label diagram-label-a">SPACE TO PRACTICE</div>
        <div className="diagram-label diagram-label-b">ROOM TO PLAY</div>
        <div className="diagram-coordinate">BUILT AROUND THE GAME</div>
      </div>
      <p>A custom room designed for the way you want to experience golf.</p>
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
            <span>Around the Game.</span>
          </h1>
          <p className="hero-description">
            Every great simulator begins with a room designed to play beautifully.
          </p>
          <p className="hero-credibility">
            Zarka Construction plans and builds custom indoor golf simulator
            environments where craftsmanship, construction, and technology come
            together as one seamless experience.
          </p>
          <div className="hero-actions">
            <TrackedLink
              className="button button-primary"
              eventName="consultation_cta_click"
              eventProperties={{ placement: "hero" }}
              href="/contact?service=simulator-construction"
            >
              Request a Simulator Consultation
              <ArrowRightIcon />
            </TrackedLink>
            <TrackedLink
              className="button button-secondary"
              eventName="what_we_build_click"
              eventProperties={{ placement: "hero" }}
              href="/#what-we-build"
            >
              See What We Build
            </TrackedLink>
          </div>
          <p className="hero-tagline">{businessConfig.tagline}</p>
        </div>
        <BrandArtwork />
      </div>
    </section>
  );
}
