import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ allowed: true, user: true, updateError: false, updateCalls: 0, signOutCalls: 0 }));
vi.mock("@/lib/admin/auth-diagnostics", () => ({ logAdminAuthStage: vi.fn() }));
vi.mock("@/lib/admin/auth-rate-limit", () => ({ checkAdminAuthRateLimit: () => ({ allowed: true, resetAt: Date.now() + 60_000 }) }));
vi.mock("@/lib/admin/auth", () => ({ getAdminAllowlist: () => new Set(["founder@example.com"]), isAllowedAdminEmail: () => state.allowed }));
vi.mock("@/lib/supabase/route", () => ({ createSupabaseRouteClient: () => ({
  client: { auth: {
    getUser: async () => state.user ? { data: { user: { email: "founder@example.com" } }, error: null } : { data: { user: null }, error: new Error("missing") },
    updateUser: async () => { state.updateCalls += 1; return { error: state.updateError ? new Error("rejected") : null }; },
    signOut: async () => { state.signOutCalls += 1; return { error: null }; },
  } },
  applyCookies: (response: NextResponse) => response,
}) }));
import { POST } from "@/app/api/admin/auth/password/route";

function request(body: unknown, recovery = false) {
  return new NextRequest("https://www.zarkaconstruction.com/api/admin/auth/password", { method: "POST", headers: { "content-type": "application/json", origin: "https://www.zarkaconstruction.com", host: "www.zarkaconstruction.com", ...(recovery ? { cookie: "zarka-admin-recovery=active" } : {}) }, body: JSON.stringify(body) });
}
const strong = "Strong-Generated9-Phrase";

describe("founder password update", () => {
  beforeEach(() => { state.allowed = true; state.user = true; state.updateError = false; state.updateCalls = 0; state.signOutCalls = 0; });
  it("requires an authenticated allowlisted founder", async () => {
    state.user = false;
    expect((await POST(request({ mode: "set", password: strong, confirmation: strong }))).status).toBe(401);
    state.user = true; state.allowed = false;
    expect((await POST(request({ mode: "set", password: strong, confirmation: strong }))).status).toBe(401);
  });
  it("rejects mismatch and weak passwords", async () => {
    expect((await POST(request({ mode: "set", password: strong, confirmation: "different" }))).status).toBe(422);
    expect((await POST(request({ mode: "set", password: "weak", confirmation: "weak" }))).status).toBe(422);
    expect(state.updateCalls).toBe(0);
  });
  it("updates a strong password for an authenticated founder", async () => {
    const response = await POST(request({ mode: "set", password: strong, confirmation: strong }));
    expect(response.status).toBe(200);
    expect(state.updateCalls).toBe(1);
    expect(await response.json()).toEqual({ ok: true, redirectTo: "/admin" });
  });
  it("requires a recovery marker for reset and signs out after success", async () => {
    expect((await POST(request({ mode: "reset", password: strong, confirmation: strong }))).status).toBe(401);
    const response = await POST(request({ mode: "reset", password: strong, confirmation: strong }, true));
    expect(response.status).toBe(200);
    expect(state.signOutCalls).toBe(1);
    expect(response.cookies.get("zarka-admin-recovery")?.value).toBe("");
  });
});