import { describe, expect, it } from "vitest";

import {
  businessConfig,
  consultationOptions,
  isServiceOptionValue,
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

  it("keeps the public service model focused on current simulator-environment work", () => {
    expect(services).toHaveLength(7);
    expect(services.map((service) => service.slug)).toEqual(
      expect.arrayContaining([
        "custom-simulator-environments",
        "simulator-room-preparation",
        "impact-screen-environments",
        "wall-ceiling-protection",
        "turf-hitting-surfaces",
        "finish-carpentry-detailing",
        "planning-trade-coordination",
      ]),
    );
  });

  it("recognizes only configured contact service values", () => {
    expect(isServiceOptionValue("simulator-construction")).toBe(true);
    expect(isServiceOptionValue("not-a-service")).toBe(false);
  });

  it("offers only the two approved room-review approaches", () => {
    expect(consultationOptions.map((option) => option.value)).toEqual([
      "on-site-consultation",
      "guided-remote-review",
    ]);
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
