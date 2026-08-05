import { SectionHeading } from "@/components/section-heading";
import { simulatorProcess } from "@/config/simulator";

export function PlanningProcessSection() {
  return (
    <section className="section ecosystem-section planning-process-section" id="planning-process">
      <div className="site-container">
        <div className="builder-difference">
          <p className="eyebrow">The specialist difference</p>
          <h2>We Don&apos;t Simply Install Equipment.<br />We Prepare the Environment for Great Simulator Experiences.</h2>
          <div>
            <p>
              Equipment alone does not resolve the room. Zarka evaluates how
              player position, impact systems, protection, surfaces, access, and
              finish details need to work within the actual space.
            </p>
            <p>
              The simulator environment is planned before specialty construction
              begins. Equipment purchasing, permits, professional design services,
              and work by licensed trades remain separate unless a written scope
              explicitly assigns a responsibility.
            </p>
          </div>
        </div>

        <SectionHeading
          description={
            <p>
              A project can begin with an on-site consultation or a guided
              remote room review. The purpose is to understand the space,
              identify constraints, and define what Zarka may reasonably include
              before any construction commitment is made.
            </p>
          }
          eyebrow="How we approach the work"
          title="A careful process, from the first conversation to a defined scope."
        />

        <ol className="planning-process-grid">
          {simulatorProcess.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="review-paths" id="review-options">
          <article>
            <p className="eyebrow">On-site consultation</p>
            <h3>Understand the room in person.</h3>
            <p>
              When the location and potential scope make it appropriate, an
              on-site review helps document existing conditions, intended use,
              constraints, and the simulator-environment work under consideration.
            </p>
          </article>
          <article>
            <p className="eyebrow">Guided remote room review</p>
            <h3>Begin with the space you have.</h3>
            <p>
              A guided review uses measurements, room photographs, intended
              players, and known equipment information shared during follow-up.
              A remote review is an initial evaluation, not a final construction determination.
            </p>
          </article>
        </div>

        <p className="documentation-note">
          Zarka uses CapProof within its field-documentation process to support
          organized evidence and clearer project communication.
        </p>
      </div>
    </section>
  );
}
