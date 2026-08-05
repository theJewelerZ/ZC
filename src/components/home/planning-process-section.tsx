import { SectionHeading } from "@/components/section-heading";
import { simulatorProcess } from "@/config/simulator";

export function PlanningProcessSection() {
  return (
    <section className="section ecosystem-section planning-process-section" id="planning-process">
      <div className="site-container">
        <SectionHeading
          description={
            <p>
              Every serious simulator lead begins with an on-site consultation
              or a guided remote room review. The goal is to establish whether
              the space and intended system can work together before a build
              promise is made.
            </p>
          }
          eyebrow="Planning process"
          title="Evaluate first. Coordinate second. Build with a clear plan."
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
            <h3>Review the room in person.</h3>
            <p>
              An on-site review can document dimensions, structure, access,
              obstructions, finishes, and coordination needs directly in the
              space when the project location and scope make that appropriate.
            </p>
          </article>
          <article>
            <p className="eyebrow">Guided remote room review</p>
            <h3>Start with measurements and photographs.</h3>
            <p>
              A remote review begins with guided measurements, room photographs,
              intended users, and known equipment information. Files are shared
              through the agreed follow-up process; this website does not accept uploads.
            </p>
          </article>
        </div>

        <p className="documentation-note">
          Zarka uses CapProof as part of its professional field-documentation
          process, supporting organized evidence and clearer project communication.
        </p>
      </div>
    </section>
  );
}