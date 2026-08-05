import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";

export function ContactCtaSection() {
  return (
    <section className="contact-cta-section" id="contact-cta">
      <div className="site-container contact-cta-inner">
        <div>
          <p className="eyebrow">Start with a room review</p>
          <h2>Every simulator room needs to be evaluated before it is built.</h2>
        </div>
        <div className="contact-cta-action">
          <p>
            Choose an on-site consultation or guided remote room review. Share
            the space, intended players, known equipment, general location, and
            timing so the first conversation can focus on feasibility.
          </p>
          <TrackedLink
            className="button button-primary"
            eventName="consultation_cta_click"
            eventProperties={{ placement: "final_cta" }}
            href="/contact?service=simulator-construction"
          >
            Start Your Room Review
            <ArrowRightIcon />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}