import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="site-container about-grid">
        <div className="about-marker" aria-hidden="true">
          <span>ZC</span>
          <p>ROOM / CRAFT / SYSTEM</p>
        </div>
        <div>
          <SectionHeading
            eyebrow="Built on construction experience"
            title="Specialized simulator rooms, grounded in the field."
          />
          <div className="about-copy">
            <p>
              Zarka Construction plans and builds custom indoor golf simulator
              rooms for residential and commercial spaces.
            </p>
            <p>
              Hands-on construction, carpentry, specialty installation,
              renovation, painting, and project-support experience informs the
              way each room is planned, scoped, documented, and finished.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}