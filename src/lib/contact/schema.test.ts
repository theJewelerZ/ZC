import { describe, expect, it } from "vitest";

import { validateContactPayload } from "@/lib/contact/schema";

const now = 1_800_000_000_000;

const validPayload = {
  name: "  Alex   Builder ",
  email: "ALEX@EXAMPLE.COM",
  phone: "(555) 000-0000",
  location: "  Southeast Michigan ",
  service: "simulator-construction",
  consultationPreference: "guided-remote-review",
  timeline: "three-six-months",
  description:
    "I am planning a simulator room and want to review the room dimensions and finish work.",
  referralSource: "",
  website: "",
  startedAt: String(now - 8_000),
  turnstileToken: "",
};

describe("validateContactPayload", () => {
  it("normalizes and accepts a complete valid request", () => {
    const result = validateContactPayload(validPayload, now);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alex Builder");
      expect(result.data.email).toBe("alex@example.com");
      expect(result.data.location).toBe("Southeast Michigan");
    }
  });

  it("accepts only a normalized Build slug as optional context", () => {
    const valid = validateContactPayload({ ...validPayload, sourceBuildSlug: "albatross-golf-mason" }, now);
    const invalid = validateContactPayload({ ...validPayload, sourceBuildSlug: "../../private" }, now);
    expect(valid.success && valid.data.sourceBuildSlug).toBe("albatross-golf-mason");
    expect(invalid.success && invalid.data.sourceBuildSlug).toBe("");
  });

  it("rejects a honeypot value as abuse", () => {
    const result = validateContactPayload(
      { ...validPayload, website: "https://spam.example" },
      now,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.abuseDetected).toBe(true);
    }
  });

  it("rejects implausibly fast submissions", () => {
    const result = validateContactPayload(
      { ...validPayload, startedAt: String(now - 500) },
      now,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.abuseDetected).toBe(true);
    }
  });

  it("returns field errors for invalid visitor input", () => {
    const result = validateContactPayload(
      {
        ...validPayload,
        name: "",
        email: "not-an-email",
        phone: "call me",
        location: "",
        service: "invented-service",
        consultationPreference: "email-me",
        timeline: "tomorrow",
        description: "Too short",
      },
      now,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        location: expect.any(String),
        service: expect.any(String),
        consultationPreference: expect.any(String),
        timeline: expect.any(String),
        description: expect.any(String),
      });
    }
  });

  it("rejects unexpected fields", () => {
    const result = validateContactPayload(
      { ...validPayload, admin: true },
      now,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.form).toContain("unexpected");
    }
  });
});

