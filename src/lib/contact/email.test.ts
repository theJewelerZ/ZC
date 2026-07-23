import { afterEach, describe, expect, it, vi } from "vitest";

import { buildContactEmail, sendContactEmail } from "@/lib/contact/email";
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

  it("formats readable HTML and plain-text alternatives", () => {
    const result = buildContactEmail(payload, "test-correlation");

    expect(result.text).toContain(
      "Contact and project details\nName: <strong>Alex</strong>",
    );
    expect(result.text).toContain("\n\nProject description\n");
    expect(result.html).toContain("<table");
    expect(result.html).toContain("Submitted");
  });
});

describe("sendContactEmail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the configured sender and visitor reply-to with both body formats", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "email-test-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await sendContactEmail({
      payload,
      correlationId: "test-correlation",
      recipient: "inquiries@example.com",
      sender: "Zarka Construction <website@example.com>",
      apiKey: "test-api-key",
    });

    expect(result.id).toBe("email-test-id");
    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(request?.body)) as Record<string, unknown>;

    expect(request?.headers).toMatchObject({
      Authorization: "Bearer test-api-key",
      "Content-Type": "application/json",
    });
    expect(body).toMatchObject({
      from: "Zarka Construction <website@example.com>",
      to: ["inquiries@example.com"],
      reply_to: payload.email,
    });
    expect(body.html).toEqual(expect.any(String));
    expect(body.text).toEqual(expect.any(String));
  });

  it("fails when Resend rejects delivery", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("rejected", { status: 403 }),
    );

    await expect(
      sendContactEmail({
        payload,
        correlationId: "test-correlation",
        recipient: "inquiries@example.com",
        sender: "Zarka Construction <website@example.com>",
        apiKey: "test-api-key",
      }),
    ).rejects.toThrow("status 403");
  });
});
