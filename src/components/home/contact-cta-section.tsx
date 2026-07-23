import { ArrowRightIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";

export function ContactCtaSection() {
  return (
    <section className="contact-cta-section" id="contact-cta">
      <div className="site-container contact-cta-inner">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <h2>Let&apos;s talk about the space, the work, and what comes next.</h2>
        </div>
        <div className="contact-cta-action">
          <p>
            Share the project type, general location, and timeline to help start
            a focused conversation about fit and next steps.
          </p>
          <TrackedLink
            className="button button-primary"
            eventName="consultation_cta_click"
            eventProperties={{ placement: "final_cta" }}
            href="/contact"
          >
            Request a Consultation
            <ArrowRightIcon />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
