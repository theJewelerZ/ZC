import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createAdmin, verify, rate } = vi.hoisted(() => ({
  createAdmin: vi.fn(),
  verify: vi.fn(),
  rate: vi.fn(() => ({ allowed: true, resetAt: Date.now() + 1000 })),
}));
vi.mock("@/lib/supabase/admin", () => ({ createSupabaseAdminClient: createAdmin }));
vi.mock("@/lib/contact/turnstile", () => ({ verifyTurnstile: verify }));
vi.mock("@/lib/contact/rate-limit", () => ({
  createRequestFingerprint: () => "fingerprint",
  checkRateLimit: rate,
}));
vi.mock("@/lib/consultations/repository", () => ({
  cleanupExpiredConsultations: vi.fn(() => Promise.resolve()),
  createPendingConsultation: vi.fn(() => Promise.reject(new Error("database unavailable"))),
}));

import { POST } from "@/app/api/consultations/start/route";

const valid = {
  name: "Test Customer", email: "customer@example.com", phone: "", location: "Michigan",
  service: "simulator-construction", consultationPreference: "guided-remote-review",
  timeline: "planning", description: "A serious simulator room consultation with enough detail.",
  referralSource: "", website: "", startedAt: String(Date.now() - 5000),
  turnstileToken: "token", spaceType: "", roomWidth: "", roomDepth: "",
  ceilingHeight: "", handedness: "", simulatorSystem: "", privacyConsent: true, photos: [],
};

function request(body: unknown) {
  return new NextRequest("https://www.zarkaconstruction.com/api/consultations/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", Host: "www.zarkaconstruction.com", Origin: "https://www.zarkaconstruction.com" },
    body: JSON.stringify(body),
  });
}

describe("consultation start route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    rate.mockReturnValue({ allowed: true, resetAt: Date.now() + 1000 });
  });
  it("fails honestly when durable storage is not configured", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request(valid));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, message: expect.stringContaining("No information was saved") });
  });
  it("returns field validation without creating a record", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only");
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request({ ...valid, email: "invalid" }));
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ errors: { email: expect.any(String) } });
    expect(createAdmin).not.toHaveBeenCalled();
  });
  it("rejects Turnstile failure before database access", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    verify.mockResolvedValue(false);
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request(valid));
    expect(response.status).toBe(422);
    expect(createAdmin).not.toHaveBeenCalled();
  });
  it("rejects rate-limited requests before database access", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only");
    rate.mockReturnValue({ allowed: false, resetAt: Date.now() + 1000 });
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request(valid));
    expect(response.status).toBe(429);
    expect(createAdmin).not.toHaveBeenCalled();
  });
  it("does not report success when database creation fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only");
    createAdmin.mockReturnValue({});
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request(valid));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, message: expect.stringContaining("could not be saved") });
  });
});
