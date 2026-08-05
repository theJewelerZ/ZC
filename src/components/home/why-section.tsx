import { SectionHeading } from "@/components/section-heading";

const principles = [
  { number: "01", title: "Start with the actual space", copy: "Existing conditions, intended players, and known equipment requirements are considered before a specialty-construction scope is proposed." },
  { number: "02", title: "Craft with a clear purpose", copy: "Framing, impact systems, protection, turf, curtains, trim, and finish details are approached as parts of one simulator environment." },
  { number: "03", title: "Define responsibilities early", copy: "Scopes identify Zarka's work, customer or equipment-provider responsibilities, and any qualified-trade coordination the project may require." },
  { number: "04", title: "Communicate as the work develops", copy: "Organized assumptions and field documentation help customers and project participants understand decisions, progress, and remaining responsibilities." },
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id="capabilities">
      <div className="site-container">
        <SectionHeading
          align="center"
          description={<p>Decades of hands-on construction, finish carpentry, renovation, painting, and field work inform the way Zarka approaches simulator environments. That experience supports careful specialty work without implying responsibility for an entire building project.</p>}
          eyebrow="Construction experience behind the specialty"
          title="Specific work. Clear responsibilities. Careful execution."
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
