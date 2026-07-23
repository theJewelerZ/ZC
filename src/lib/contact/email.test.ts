import { describe, expect, it } from "vitest";

import { buildContactEmail } from "@/lib/contact/email";
import type { ContactPayload } from "@/lib/contact/schema";

const payload: ContactPayload = {
  name: "<strong>Alex</strong>",
  email: "alex@example.com",
  phone: "",
  location: "Michigan",
  service: "simulator-construction",
  timeline: "planning",
  description: "<script>alert('unsafe')</script>",
  referralSource: "",
  website: "",
  startedAt: String(Date.now() - 5_000),
  turnstileToken: "",
};

describe("buildContactEmail", () => {
  it("escapes visitor input in HTML output", () => {
    const result = buildContactEmail(payload, "test-correlation");

    expect(result.html).not.toContain("<script>");
    expect(result.html).not.toContain("<strong>Alex</strong>");
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.text).toContain("<script>");
  });

  it("does not place visitor input in the subject", () => {
    const result = buildContactEmail(payload, "test-correlation");

    expect(result.subject).not.toContain(payload.name);
    expect(result.subject).toContain("test-cor");
  });
});

