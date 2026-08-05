import { SectionHeading } from "@/components/section-heading";
import { SimulatorMedia } from "@/components/simulator/simulator-media";
import { simulatorImageSlots } from "@/config/simulator";

const projectStages = [
  {
    label: "Feasibility",
    title: "The room before construction",
    copy: "Dimensions, player position, screen geometry, projection, access, and constraints documented before scope decisions are finalized.",
  },
  {
    label: "Construction",
    title: "The build environment in progress",
    copy: "Framing, protection, enclosure support, finish details, and coordinated systems recorded as real work advances.",
  },
  {
    label: "Integration",
    title: "The completed room as one system",
    copy: "Approved finished-room photography will show how the playing surface, impact environment, lighting, trim, and technology plan come together.",
  },
] as const;

export function CapabilitiesSection() {
  return (
    <section className="section capabilities-section project-proof-section" id="projects">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading
            description={
              <p>
                Project work will be presented with founder-owned photography
                only after construction is underway and publication is approved.
                No stock scenes, AI rooms, or fictional case studies.
              </p>
            }
            eyebrow="Projects"
            title="Real rooms. Real constraints. Real construction."
          />
          <p className="section-side-note">
            The project framework is ready for field photography without
            inventing proof before the work exists.
          </p>
        </div>

        <div className="project-proof-grid">
          {projectStages.map((stage, index) => (
            <article className="project-proof-card" key={stage.label}>
              <SimulatorMedia
                label={`${stage.label.toUpperCase()} / ${String(index + 1).padStart(2, "0")}`}
                slot={simulatorImageSlots[index]}
              />
              <div>
                <p className="capability-label">{stage.label}</p>
                <h3>{stage.title}</h3>
                <p>{stage.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}