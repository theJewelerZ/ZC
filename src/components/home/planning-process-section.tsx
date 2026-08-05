import { SectionHeading } from "@/components/section-heading";
import { simulatorProcess } from "@/config/simulator";

export function PlanningProcessSection() {
  return (
    <section className="section ecosystem-section planning-process-section" id="planning-process">
      <div className="site-container">
        <div className="builder-difference">
          <p className="eyebrow">The room-builder difference</p>
          <h2>We Don&apos;t Install Golf Simulators.<br />We Build Golf Simulator Rooms.</h2>
          <div>
            <p>
              Equipment can be assembled. A room has to be understood. A
              simulator room builder plans the environment around how you will
              swing, see the shot, move through the space, and enjoy it with
              other people.
            </p>
            <p>
              The room is designed before construction begins. Construction
              supports the golf experience. Technology fits into the room—not
              the other way around.
            </p>
          </div>
        </div>

        <SectionHeading
          description={
            <p>
              Every serious project begins with an on-site consultation or a
              guided remote room review. That early work establishes what the
              space can support and creates a clear path from idea to finished room.
            </p>
          }
          eyebrow="How we build it"
          title="A thoughtful process, from the first conversation to the first round."
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
            <h3>Experience the room together.</h3>
            <p>
              When the location and scope make it appropriate, an on-site review
              lets Zarka understand the room, its constraints, and the way you
              hope to use it firsthand.
            </p>
          </article>
          <article>
            <p className="eyebrow">Guided remote room review</p>
            <h3>Begin with the space you have.</h3>
            <p>
              A guided review uses measurements, room photographs, intended
              players, and known equipment information shared during follow-up.
              This website does not accept uploads.
            </p>
          </article>
        </div>

        <p className="documentation-note">
          Zarka uses CapProof within its professional field-documentation
          process to support organized evidence and clearer project communication.
        </p>
      </div>
    </section>
  );
}
