import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="site-container about-grid">
        <div className="about-marker" aria-hidden="true"><span>ZC</span><p>GOLF / ROOM / CRAFT</p></div>
        <div>
          <SectionHeading eyebrow="About Zarka" title="Construction experience, focused on better golf spaces." />
          <div className="about-copy">
            <p>
              Zarka Construction brings decades of hands-on construction
              experience, attention to detail, craftsmanship, and a genuine love
              of golf to the work of creating simulator environments.
            </p>
            <p>
              The approach is straightforward: listen to how the customer wants
              to use the space, study the room carefully, communicate what is
              practical, and complete the agreed work with care. When a project
              needs equipment expertise or a qualified trade outside Zarka&apos;s
              scope, that responsibility is identified rather than overstated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
