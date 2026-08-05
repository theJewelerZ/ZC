import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/config/business";

export function ServicesSection() {
  return (
    <section className="section services-section" id="simulator-rooms">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading
            description={
              <p>
                The room, impact environment, playing surface, projection path,
                lighting, and finish details must work together. Zarka plans the
                construction as one complete environment.
              </p>
            }
            eyebrow="Custom simulator solutions"
            title="Built as a room. Coordinated as a system."
          />
          <p className="section-side-note">
            Residential and commercial projects begin with feasibility. Exact
            scope, equipment responsibilities, and required trade coordination
            are established for each room.
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