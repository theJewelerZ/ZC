import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";

export function ContactCtaSection() {
  return (
    <section className="contact-cta-section" id="contact-cta">
      <div className="site-container contact-cta-inner">
        <div><p className="eyebrow">Imagine the room. Then understand the space.</p><h2>Start with the golf experience you want to create.</h2></div>
        <div className="contact-cta-action">
          <p>Tell us how you want to use the room, who will play, and what space you have in mind. An on-site consultation or guided remote room review can turn that vision into a practical first plan.</p>
          <TrackedLink className="button button-primary" eventName="consultation_cta_click" eventProperties={{ placement: "final_cta" }} href="/contact?service=simulator-construction">
            Request a Simulator Consultation <ArrowRightIcon />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
