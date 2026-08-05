"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";
import { primaryNavigation, utilityNavigation } from "@/config/navigation";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="header-brand" href="/" onClick={() => setIsOpen(false)}>
          <BrandMark surface="light" />
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
          <Link href="/contact">Contact</Link>
          <TrackedLink
            className="button button-primary button-compact"
            eventName="consultation_cta_click"
            eventProperties={{ placement: "header" }}
            href="/contact?service=simulator-construction"
          >
            Request a Consultation
          </TrackedLink>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="mobile-menu-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
          <span>{isOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      <nav
        aria-label="Mobile navigation"
        className={`mobile-nav ${isOpen ? "mobile-nav-open" : ""}`}
        id="mobile-navigation"
      >
        <div className="site-container mobile-nav-inner">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <TrackedLink
            className="button button-primary"
            eventName="consultation_cta_click"
            eventProperties={{ placement: "mobile_navigation" }}
            href="/contact?service=simulator-construction"
            onClick={() => setIsOpen(false)}
          >
            Request a Consultation
          </TrackedLink>
          <div className="mobile-nav-utility" aria-label="Utility navigation">
            {utilityNavigation.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
