import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="site-container about-grid">
        <div className="about-marker" aria-hidden="true">
          <span>ZC</span>
          <p>FIELD / CRAFT / SYSTEM</p>
        </div>
        <div>
          <SectionHeading
            eyebrow="Construction knowledge, carried forward"
            title="A company grounded in the field."
          />
          <div className="about-copy">
            <p>
              Zarka Construction is grounded in decades of hands-on
              construction, carpentry, specialty installation, renovation,
              painting, and project support.
            </p>
            <p>
              That same field perspective shapes how the company approaches
              estimating, documentation, client communication, and specialized
              simulator environments. The technology is connected to the work
              because it was built from the work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

