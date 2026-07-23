import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/config/business";

export function ServicesSection() {
  return (
    <section className="section services-section" id="services">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading
            description={
              <p>
                Practical construction support shaped around the space, the
                finish, and the work required to deliver it well.
              </p>
            }
            eyebrow="Construction + installation"
            title="Capability grounded in the work."
          />
          <p className="section-side-note">
            Scope is established project by project. Specialized or licensed
            trade work may be coordinated with qualified partners as the work
            requires.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.slug}>
              <div className="service-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowRightIcon />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

