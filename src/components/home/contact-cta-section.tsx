import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";

export function ContactCtaSection() {
  return (
    <section className="contact-cta-section" id="contact-cta">
      <div className="site-container contact-cta-inner">
        <div><p className="eyebrow">Start with a conversation about the space.</p><h2>Tell us what you want the simulator environment to make possible.</h2></div>
        <div className="contact-cta-action">
          <p>
            Share how the space will be used, who will play, its general
            location, known equipment information, and any current constraints.
            Zarka will use the first conversation to understand potential fit—not
            to push an equipment package.
          </p>
          <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "final_cta" }} href="/contact?service=simulator-construction">
            Request a Simulator Consultation <ArrowRightIcon />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
