import { SectionHeading } from "@/components/section-heading";

const principles = [
  {
    number: "01",
    title: "Field-tested judgment",
    copy: "Decisions informed by decades of real construction, carpentry, installation, renovation, and field conditions.",
  },
  {
    number: "02",
    title: "Precision in the details",
    copy: "Spatial, material, finish, and handoff details considered before they become project problems.",
  },
  {
    number: "03",
    title: "Clearer project proof",
    copy: "Modern documentation and communication practices that support better decisions and cleaner client handoffs.",
  },
  {
    number: "04",
    title: "Craft and technology together",
    copy: "Construction tools serve the work. They strengthen practical judgment rather than replacing it.",
  },
];

export function WhySection() {
  return (
    <section className="section why-section" id="why-zarka">
      <div className="site-container">
        <SectionHeading
          align="center"
          description={
            <p>
              Carpenter-led thinking, disciplined execution, and modern project
              systems—applied where they create real value.
            </p>
          }
          eyebrow="Why Zarka Construction"
          title="Built around how projects actually happen."
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

