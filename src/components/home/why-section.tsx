import { SectionHeading } from "@/components/section-heading";

const principles = [
  {
    number: "01",
    title: "Room-first judgment",
    copy: "Feasibility and geometry are reviewed before finishes or equipment positions become expensive constraints.",
  },
  {
    number: "02",
    title: "Carpenter-led execution",
    copy: "Framing, finish carpentry, protection, trim, and room integration are considered as connected construction details.",
  },
  {
    number: "03",
    title: "Organized scopes",
    copy: "Project assumptions, responsibilities, and coordinated trade needs are made visible before the work advances.",
  },
  {
    number: "04",
    title: "Documented decisions",
    copy: "Professional field documentation supports clearer communication, progress visibility, and project handoffs.",
  },
];

export function WhySection() {
  return (
    <section className="section why-section" id="capabilities">
      <div className="site-container">
        <SectionHeading
          align="center"
          description={
            <p>
              Simulator-room expertise is reinforced by practical construction,
              finish carpentry, renovation, painting, and commercial maintenance
              experience—not diluted by a list of unrelated services.
            </p>
          }
          eyebrow="Construction credibility"
          title="The room builder matters as much as the equipment plan."
        />
        <div className="principles-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}