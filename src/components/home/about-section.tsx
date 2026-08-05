import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="site-container about-grid">
        <div className="about-marker" aria-hidden="true"><span>ZC</span><p>GOLF / ROOM / CRAFT</p></div>
        <div>
          <SectionHeading eyebrow="Why Zarka builds simulator rooms" title="The room deserves as much thought as the technology." />
          <div className="about-copy">
            <p>After decades of building and renovating spaces, the founder came to see simulator projects differently: the equipment is only part of what makes the room worth returning to.</p>
            <p>Zarka focuses on building the environment that lets the golf experience feel natural—one shaped around how you want to practice, play, gather, and enjoy the room for years.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
