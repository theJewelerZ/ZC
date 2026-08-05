import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { businessConfig } from "@/config/business";
import { legalNavigation, primaryNavigation } from "@/config/navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Link href="/">
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
          <p className="footer-heading">Plan an environment</p>
          <ul className="footer-links">
            <li>
              <Link href="/simulator-construction">Simulator environment construction</Link>
            </li>
            <li>
              <Link href="/#planning-process">Planning process</Link>
            </li>
            <li>
              <Link href="/contact?service=simulator-construction">
                Request a consultation
              </Link>
            </li>
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
        <p>Golf simulator construction specialists. Every project begins with a defined scope.</p>
      </div>
    </footer>
  );
}