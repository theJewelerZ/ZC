import { SectionHeading } from "@/components/section-heading";

const capabilities = [
  {
    label: "Specialty environments",
    title: "Simulator rooms built as complete spaces",
    copy: "Spatial planning, protection, enclosure, finish, and installation decisions coordinated around the room.",
  },
  {
    label: "Finish + installation",
    title: "Details that make the work feel resolved",
    copy: "Carpentry, custom-built elements, interior improvements, and specialty installations handled with care.",
  },
  {
    label: "Project support",
    title: "Better decisions before and during the work",
    copy: "Estimating support, opportunity review, field documentation, and communication practices grounded in construction.",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="section capabilities-section" id="work">
      <div className="site-container">
        <div className="section-intro-grid">
          <SectionHeading
            description={
              <p>
                Until approved project photography and case-study facts are
                available, the work is represented by the capabilities Zarka
                Construction brings to a project.
              </p>
            }
            eyebrow="Selected capabilities"
            title="Practical skill. Connected thinking."
          />
          <div className="capability-statement">
            <span>PLAN</span>
            <span>BUILD</span>
            <span>DOCUMENT</span>
          </div>
        </div>

        <div className="capabilities-list">
          {capabilities.map((capability, index) => (
            <article className="capability-row" key={capability.label}>
              <p className="capability-number">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="capability-label">{capability.label}</p>
                <h3>{capability.title}</h3>
              </div>
              <p className="capability-copy">{capability.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

