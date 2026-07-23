import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { businessConfig, relatedProjects } from "@/config/business";
import { legalNavigation, primaryNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/brand-mark";
import { TrackedLink } from "@/components/tracked-link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Link aria-label="Zarka Construction home" href="/">
            <BrandMark surface="dark" />
          </Link>
          <p>{businessConfig.tagline}</p>
        </div>

        <div>
          <p className="footer-heading">Navigate</p>
          <ul className="footer-links">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Field-built tools</p>
          <ul className="footer-links">
            {relatedProjects.map((project) => (
              <li key={project.slug}>
                {project.href ? (
                  <TrackedLink
                    eventName="ecosystem_link_click"
                    eventProperties={{
                      project: project.slug,
                      placement: "footer",
                    }}
                    href={project.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {project.name}
                    <ArrowUpRightIcon />
                    <span className="sr-only"> (opens another website)</span>
                  </TrackedLink>
                ) : (
                  <span>
                    {project.name}
                    {project.status ? ` — ${project.status}` : ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer-heading">Legal</p>
          <ul className="footer-links">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>
          © {new Date().getFullYear()} {businessConfig.legalName}. All rights
          reserved.
        </p>
        <p>Construction experience. Modern project execution.</p>
      </div>
    </footer>
  );
}
