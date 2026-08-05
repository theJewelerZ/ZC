import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/config/business";

export function ServicesSection() {
  return (
    <section className="section services-section" id="what-we-build">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading
            description={
              <p>
                From a private place to practice to a commercial space built
                around repeat play, every project begins with the experience the
                room needs to create.
              </p>
            }
            eyebrow="What we build"
            title="Complete rooms, shaped around how you play."
          />
          <p className="section-side-note">
            Residential and commercial projects begin with feasibility. Scope,
            equipment responsibilities, and trade coordination are confirmed
            for the individual room.
          </p>
        </div>

        <div className="services-grid simulator-services-grid">
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
