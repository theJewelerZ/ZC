import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ configured: true, allowed: true, exchangeError: false, userError: false, signOut: 0 }));
vi.mock("@/lib/supabase/config", () => ({ getSupabasePublicConfig: () => state.configured ? { url: "https://project.supabase.co", publishableKey: "test-key" } : null }));
vi.mock("@/lib/admin/auth", () => ({ getAdminAllowlist: () => new Set(["founder@example.com"]), isAllowedAdminEmail: () => state.allowed }));
vi.mock("@/lib/admin/auth-origin", () => ({ getAdminAuthOrigin: (origin: string) => origin }));
vi.mock("@/lib/admin/auth-diagnostics", () => ({ logAdminAuthStage: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: (_url: string, _key: string, options: { cookies: { setAll: (values: { name: string; value: string; options: Record<string, unknown> }[]) => void } }) => ({ auth: {
  exchangeCodeForSession: async () => { if (!state.exchangeError) options.cookies.setAll([{ name: "sb-test-auth-token", value: "session", options: { httpOnly: true, path: "/", sameSite: "lax", secure: true } }]); return { error: state.exchangeError ? new Error("expired") : null }; },
  getUser: async () => state.userError ? { data: { user: null }, error: new Error("missing") } : { data: { user: { email: "founder@example.com" } }, error: null },
  signOut: async () => { state.signOut += 1; options.cookies.setAll([{ name: "sb-test-auth-token", value: "", options: { maxAge: 0, path: "/" } }]); return { error: null }; },
} }) }));
import { GET } from "@/app/auth/recovery/route";

function request(query = "?code=recovery-code", verifier = true) {
  return new NextRequest(`https://www.zarkaconstruction.com/auth/recovery${query}`, { headers: verifier ? { cookie: "sb-test-code-verifier=verifier" } : undefined });
}

describe("password recovery callback", () => {
  beforeEach(() => { state.configured = true; state.allowed = true; state.exchangeError = false; state.userError = false; state.signOut = 0; });
  it("exchanges the code, binds session cookies, and creates a short recovery session", async () => {
    const response = await GET(request());
    expect(response.headers.get("location")).toBe("https://www.zarkaconstruction.com/admin/reset-password");
    expect(response.cookies.get("sb-test-auth-token")?.value).toBe("session");
    expect(response.cookies.get("zarka-admin-recovery")?.value).toBe("active");
    expect(response.headers.get("set-cookie")).not.toMatch(/domain=/i);
  });
  it("rejects missing, expired, and verifier-less links", async () => {
    expect((await GET(request(""))).headers.get("location")).toContain("error=expired");
    expect((await GET(request("?code=x", false))).headers.get("location")).toContain("error=browser");
    state.exchangeError = true;
    expect((await GET(request())).headers.get("location")).toContain("error=expired");
  });
  it("signs out a non-allowlisted recovered user", async () => {
    state.allowed = false;
    const response = await GET(request());
    expect(state.signOut).toBe(1);
    expect(response.headers.get("location")).toContain("error=unauthorized");
  });
  it("ignores untrusted next parameters", async () => {
    const response = await GET(request("?code=x&next=https://attacker.example"));
    expect(response.headers.get("location")).toBe("https://www.zarkaconstruction.com/admin/reset-password");
  });
});