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
                Zarka&apos;s work is centered on the simulator environment: the
                preparation, impact area, protection, playing surface, carpentry,
                and finish details that allow the room to work as intended.
              </p>
            }
            eyebrow="What we build"
            title="Specialty construction, shaped around the way the space will be used."
          />
          <p className="section-side-note">
            Work may be considered in homes, teaching studios, commercial golf
            spaces, entertainment venues, simulator businesses, country clubs,
            and training environments. Zarka&apos;s responsibility is limited to
            the scope agreed for the simulator environment.
          </p>
        </div>
        <div className="services-grid simulator-services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.slug}>
              <div className="service-card-top"><span>{String(index + 1).padStart(2, "0")}</span><ArrowRightIcon /></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
