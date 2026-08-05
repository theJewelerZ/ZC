import { SectionHeading } from "@/components/section-heading";
import { SimulatorMedia } from "@/components/simulator/simulator-media";
import { simulatorImageSlots } from "@/config/simulator";

const projectStages = [
  { label: "Planning", title: "The idea takes shape", copy: "The room, the people who will play, and the experience they want guide the earliest decisions." },
  { label: "Craft", title: "The room comes together", copy: "Real construction progress reveals the care behind the surfaces, transitions, protection, and finish details." },
  { label: "Play", title: "The finished experience", copy: "Approved project photography will show completed spaces ready for practice, a round with friends, and time well spent." },
] as const;

export function CapabilitiesSection() {
  return (
    <section className="section capabilities-section project-proof-section" id="projects">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading description={<p>Good work deserves honest proof. As Zarka&apos;s simulator rooms move from planning through construction, founder-owned photography will tell each project&apos;s real story.</p>} eyebrow="Real work" title="The craft behind the experience." />
          <p className="section-side-note">Only approved photographs from actual Zarka projects will appear here as the body of finished work grows.</p>
        </div>
        <div className="project-proof-grid">
          {projectStages.map((stage, index) => (
            <article className="project-proof-card" key={stage.label}>
              <SimulatorMedia label={`${stage.label.toUpperCase()} / ${String(index + 1).padStart(2, "0")}`} slot={simulatorImageSlots[index]} />
              <div><p className="capability-label">{stage.label}</p><h3>{stage.title}</h3><p>{stage.copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
