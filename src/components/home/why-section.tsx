import { SectionHeading } from "@/components/section-heading";

const principles = [
  { number: "01", title: "A room planned for golf", copy: "The player and the way the room will be enjoyed guide decisions before finishes or equipment positions are fixed." },
  { number: "02", title: "Craft you can feel", copy: "Carpenter-led thinking brings structure, protection, trim, and finish details together without distracting from the game." },
  { number: "03", title: "A clear path forward", copy: "Organized scopes make assumptions, responsibilities, and required coordination visible before work advances." },
  { number: "04", title: "Care beyond the surface", copy: "Professional field documentation supports clearer communication and preserves the thinking behind important decisions." },
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id="capabilities">
      <div className="site-container">
        <SectionHeading
          align="center"
          description={<p>Decades of hands-on construction, finish carpentry, renovation, painting, and field work inform every simulator room. That experience matters because the best golf environments are built, not assembled.</p>}
          eyebrow="Construction experience behind every simulator room"
          title="The details disappear. The quality remains."
        />
        <div className="principles-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
