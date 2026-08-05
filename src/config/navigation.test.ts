import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { legalNavigation, primaryNavigation, utilityNavigation } from "@/config/navigation";

const headerSource = readFileSync("src/components/site-header.tsx", "utf8");
const footerSource = readFileSync("src/components/site-footer.tsx", "utf8");
const layoutSource = readFileSync("src/app/layout.tsx", "utf8");

describe("public navigation", () => {
  it("provides the simulator-first primary and legal destinations", () => {
    expect(primaryNavigation.map((item) => item.href)).toContain("/simulator-construction");
    expect(legalNavigation.map((item) => item.href)).toEqual(["/privacy", "/terms"]);
  });

  it("provides one discreet founder login utility link", () => {
    expect(utilityNavigation).toEqual([{ label: "Founder Login", href: "/admin/login" }]);
    expect(headerSource).toContain("mobile-nav-utility");
    expect(footerSource).toContain("utilityNavigation.map");
    expect(headerSource).not.toContain("Customer Login");
  });

  it("mounts the shared header and footer around every public route", () => {
    expect(layoutSource).toContain("<SiteHeader />");
    expect(layoutSource).toContain("<SiteFooter />");
    expect(headerSource).toContain('<span>{isOpen ? "Close" : "Menu"}</span>');
  });
});
