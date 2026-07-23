import { ArrowUpRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { TrackedLink } from "@/components/tracked-link";
import { relatedProjects } from "@/config/business";

export function EcosystemSection() {
  return (
    <section className="section ecosystem-section" id="field-built-tools">
      <div className="site-container">
        <SectionHeading
          description={
            <p>
              Repeated field problems—unclear estimates, missing documentation,
              difficult handoffs, and specialized installations—led to focused
              tools and businesses designed around the work itself.
            </p>
          }
          eyebrow="A connected construction ecosystem"
          title="Tools and businesses built from field experience."
        />

        <div className="ecosystem-grid">
          {relatedProjects.map((project, index) => (
            <article className="ecosystem-card" key={project.slug}>
              <div className="ecosystem-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              {project.href ? (
                <TrackedLink
                  eventName="ecosystem_link_click"
                  eventProperties={{
                    project: project.slug,
                    placement: "ecosystem_card",
                  }}
                  href={project.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit {project.name}
                  <ArrowUpRightIcon />
                  <span className="sr-only"> (opens another website)</span>
                </TrackedLink>
              ) : (
                <span className="project-status">{project.status}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

