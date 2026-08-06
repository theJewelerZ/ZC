import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ allowed: true }));
vi.mock("@/lib/admin/auth-rate-limit", () => ({ checkAdminAuthRateLimit: () => ({ allowed: state.allowed, resetAt: Date.now() + 60_000 }) }));
vi.mock("@/lib/admin/auth", () => ({ getAdminAllowlist: () => new Set(["founder@example.com"]) }));
vi.mock("@/lib/supabase/config", () => ({ getSupabasePublicConfig: () => ({ url: "https://project.supabase.co", publishableKey: "test-key" }) }));
import { POST } from "@/app/api/admin/auth/recovery-request/route";
function request(email: string) { return new NextRequest("https://www.zarkaconstruction.com/api/admin/auth/recovery-request", { method: "POST", headers: { "content-type": "application/json", origin: "https://www.zarkaconstruction.com", host: "www.zarkaconstruction.com" }, body: JSON.stringify({ email }) }); }
describe("password recovery request", () => {
  beforeEach(() => { state.allowed = true; });
  it("returns the same generic success for founder and unknown emails", async () => {
    const known = await POST(request("founder@example.com"));
    const unknown = await POST(request("unknown@example.com"));
    expect(await known.json()).toEqual(await unknown.json());
  });
  it("rate limits repeated requests", async () => { state.allowed = false; expect((await POST(request("founder@example.com"))).status).toBe(429); });
});