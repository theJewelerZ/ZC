import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/contact/route";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest(
    "https://www.zarkaconstruction.com/api/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "www.zarkaconstruction.com",
        Origin: "https://www.zarkaconstruction.com",
      },
      body: JSON.stringify(body),
    },
  );
}

const validPayload = {
  name: "Production Test",
  email: "test@example.com",
  phone: "",
  location: "Michigan",
  service: "business-inquiry",
  timeline: "planning",
  description:
    "This is a controlled test of the consultation request delivery workflow.",
  referralSource: "",
  website: "",
  startedAt: String(Date.now() - 5_000),
  turnstileToken: "",
};

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns an honest unavailable response when delivery is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    const response = await POST(createRequest(validPayload));
    const result = (await response.json()) as {
      ok: boolean;
      message: string;
      correlationId: string;
    };

    expect(response.status).toBe(503);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("message was not sent");
    expect(result.correlationId).toEqual(expect.any(String));
  });

  it("rejects oversized bodies even without a content-length header", async () => {
    const request = new NextRequest(
      "https://www.zarkaconstruction.com/api/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Host: "www.zarkaconstruction.com",
          Origin: "https://www.zarkaconstruction.com",
        },
        body: JSON.stringify({
          ...validPayload,
          description: "x".repeat(40_000),
        }),
      },
    );
    request.headers.delete("content-length");

    const response = await POST(request);
    const result = (await response.json()) as { message: string };

    expect(response.status).toBe(413);
    expect(result.message).toContain("too large");
  });
});
