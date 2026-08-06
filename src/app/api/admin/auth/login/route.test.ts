import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ configured: true, signInError: false, userError: false, allowed: true, signOut: 0, rateAllowed: true }));
vi.mock("@/lib/admin/auth-rate-limit", () => ({ checkAdminAuthRateLimit: () => ({ allowed: state.rateAllowed, resetAt: Date.now() + 60_000 }) }));
vi.mock("@/lib/admin/auth-diagnostics", () => ({ logAdminAuthStage: vi.fn() }));
vi.mock("@/lib/admin/auth", () => ({ getAdminAllowlist: () => new Set(["founder@example.com"]), isAllowedAdminEmail: () => state.allowed }));
vi.mock("@/lib/supabase/route", () => ({
  createSupabaseRouteClient: () => state.configured ? {
    client: { auth: {
      signInWithPassword: async () => ({ error: state.signInError ? new Error("invalid") : null }),
      getUser: async () => state.userError ? { data: { user: null }, error: new Error("missing") } : { data: { user: { email: "founder@example.com" } }, error: null },
      signOut: async () => { state.signOut += 1; return { error: null }; },
    } },
    applyCookies: (response: NextResponse) => { response.cookies.set("sb-test-auth-token", state.allowed ? "session" : "", { httpOnly: true, path: "/", sameSite: "lax", secure: true }); return response; },
  } : null,
}));

import { POST } from "@/app/api/admin/auth/login/route";

function request(body: unknown) {
  return new NextRequest("https://www.zarkaconstruction.com/api/admin/auth/login", { method: "POST", headers: { "content-type": "application/json", origin: "https://www.zarkaconstruction.com", host: "www.zarkaconstruction.com" }, body: JSON.stringify(body) });
}

describe("password login route", () => {
  beforeEach(() => { state.configured = true; state.signInError = false; state.userError = false; state.allowed = true; state.signOut = 0; state.rateAllowed = true; });
  it("signs in, verifies the founder, and attaches the session cookie", async () => {
    const response = await POST(request({ email: "founder@example.com", password: "private-password" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, redirectTo: "/admin" });
    expect(response.cookies.get("sb-test-auth-token")?.value).toBe("session");
    expect(response.headers.get("set-cookie")).not.toMatch(/domain=/i);
  });
  it("uses the same generic error for an invalid password or unknown email", async () => {
    state.signInError = true;
    const invalid = await POST(request({ email: "founder@example.com", password: "wrong" }));
    const unknown = await POST(request({ email: "unknown@example.com", password: "wrong" }));
    expect(await invalid.json()).toEqual({ ok: false, message: "Email or password is incorrect." });
    expect(await unknown.json()).toEqual({ ok: false, message: "Email or password is incorrect." });
  });
  it("signs out an authenticated non-allowlisted user", async () => {
    state.allowed = false;
    const response = await POST(request({ email: "other@example.com", password: "private-password" }));
    expect(response.status).toBe(401);
    expect(state.signOut).toBe(1);
    expect(response.cookies.get("sb-test-auth-token")?.value).toBe("");
  });
  it("rate limits repeated attempts", async () => {
    state.rateAllowed = false;
    expect((await POST(request({ email: "x@example.com", password: "x" }))).status).toBe(429);
  });
});