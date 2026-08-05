import { describe, expect, it } from "vitest";

import {
  businessConfig,
  isServiceOptionValue,
  relatedProjects,
  services,
} from "@/config/business";

describe("public business configuration", () => {
  it("uses the approved canonical domain and brand statement", () => {
    expect(businessConfig.canonicalUrl).toBe(
      "https://www.zarkaconstruction.com",
    );
    expect(businessConfig.tagline).toBe(
      "Built with precision. Delivered with integrity.",
    );
  });

  it("omits unapproved public details", () => {
    expect(businessConfig.publicPhone).toBeNull();
    expect(businessConfig.publicEmail).toBeNull();
    expect(businessConfig.serviceArea).toBeNull();
    expect(businessConfig.licensingLanguage).toBeNull();
    expect(businessConfig.insuranceLanguage).toBeNull();
  });

  it("keeps Bid Desk unlinked while preserving confirmed project URLs", () => {
    const projects = Object.fromEntries(
      relatedProjects.map((project) => [project.slug, project]),
    );

    expect(projects["bid-desk"].href).toBeNull();
    expect(projects.capproof.href).toBe("https://capproof.com");
    expect(projects["precision-impact-screens"].href).toBe(
      "https://precisionimpactscreens.com",
    );
  });

  it("recognizes only configured contact service values", () => {
    expect(isServiceOptionValue("simulator-construction")).toBe(true);
    expect(isServiceOptionValue("not-a-service")).toBe(false);
  });
  it("contains only documented service delivery modes", () => {
    const allowedModes = new Set([
      "direct",
      "coordinated",
      "software",
      "future",
    ]);

    for (const service of services) {
      expect(allowedModes.has(service.deliveryMode)).toBe(true);
    }
  });
});
