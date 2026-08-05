import { SectionHeading } from "@/components/section-heading";

const experiences = [
  {
    title: "Practice on your schedule",
    copy: "Make time for a few focused swings before work or settle into a longer session when the day allows.",
  },
  {
    title: "Bring golf home",
    copy: "Play after dinner, share the room with family, or give friends a reason to stay for another nine.",
  },
  {
    title: "Create a place to gather",
    copy: "A thoughtfully built room can feel equally natural for practice, a casual round, or time with clients.",
  },
  {
    title: "Enjoy the game all year",
    copy: "Create a lasting space where improvement, competition, and the simple pleasure of playing can continue indoors.",
  },
] as const;

export function ExperienceSection() {
  return (
    <section className="section experience-section">
      <div className="site-container">
        <div className="experience-heading">
          <SectionHeading
            description={
              <p>
                The best rooms are not defined by the equipment inside them.
                They are defined by how naturally they invite you to play.
              </p>
            }
            eyebrow="It’s more than a simulator"
            title="A simulator room should feel like somewhere you want to be."
          />
          <p className="experience-philosophy">
            We don&apos;t build golf simulators. We build the spaces where great
            golf happens.
          </p>
        </div>
        <div className="experience-grid">
          {experiences.map((experience, index) => (
            <article key={experience.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{experience.title}</h3>
              <p>{experience.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
