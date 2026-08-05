import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  configured: true,
  allowlistConfigured: true,
  allowed: true,
  exchangeError: false,
  userError: false,
  writeSessionCookie: true,
  signOutCalls: 0,
  expectedOrigin: null as string | null,
  requestCookieNames: [] as string[],
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabasePublicConfig: () => state.configured
    ? { url: "https://project.supabase.co", publishableKey: "publishable-test-key" }
    : null,
}));

vi.mock("@/lib/admin/auth", () => ({
  getAdminAllowlist: () => new Set(state.allowlistConfigured ? ["founder@example.com"] : []),
  isAllowedAdminEmail: () => state.allowed,
}));

vi.mock("@/lib/admin/auth-origin", () => ({
  getAdminAuthOrigin: (requestOrigin: string) => state.expectedOrigin || requestOrigin,
}));

vi.mock("@/lib/admin/auth-diagnostics", () => ({ logAdminAuthStage: vi.fn() }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: {
    cookies: {
      getAll: () => { name: string; value: string }[];
      setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void;
    };
  }) => {
    state.requestCookieNames = options.cookies.getAll().map((cookie) => cookie.name);
    return {
      auth: {
        exchangeCodeForSession: async () => {
          if (state.exchangeError) return { error: new Error("invalid code") };
          if (state.writeSessionCookie) {
            options.cookies.setAll([{
              name: "sb-project-auth-token",
              value: "stored-session",
              options: { httpOnly: true, path: "/", sameSite: "lax", secure: true },
            }]);
          }
          return { error: null };
        },
        getUser: async () => state.userError
          ? { data: { user: null }, error: new Error("user unavailable") }
          : { data: { user: { email: "founder@example.com" } }, error: null },
        signOut: async () => {
          state.signOutCalls += 1;
          options.cookies.setAll([{
            name: "sb-project-auth-token",
            value: "",
            options: { httpOnly: true, maxAge: 0, path: "/", sameSite: "lax", secure: true },
          }]);
          return { error: null };
        },
      },
    };
  },
}));

import { GET } from "@/app/auth/callback/route";

function callbackRequest(origin: string, query = "?code=one-time-code", withVerifier = true) {
  return new NextRequest(`${origin}/auth/callback${query}`, {
    headers: withVerifier ? { cookie: "sb-project-code-verifier=verifier" } : undefined,
  });
}

describe("Supabase auth callback", () => {
  beforeEach(() => {
    state.configured = true;
    state.allowlistConfigured = true;
    state.allowed = true;
    state.exchangeError = false;
    state.userError = false;
    state.writeSessionCookie = true;
    state.signOutCalls = 0;
    state.expectedOrigin = null;
    state.requestCookieNames = [];
  });

  it("attaches the exchanged session cookie to the redirect response", async () => {
    const response = await GET(callbackRequest("https://preview.example.vercel.app"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin");
    expect(response.cookies.get("sb-project-auth-token")?.value).toBe("stored-session");
    expect(state.requestCookieNames).toContain("sb-project-code-verifier");
  });

  it.each([
    "https://preview.example.vercel.app",
    "https://www.zarkaconstruction.com",
  ])("keeps cookies host-scoped for %s", async (origin) => {
    const response = await GET(callbackRequest(origin));
    const setCookie = response.headers.get("set-cookie") || "";

    expect(response.headers.get("location")).toBe(`${origin}/admin`);
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("SameSite=lax");
    expect(setCookie).toContain("Secure");
    expect(setCookie).not.toMatch(/domain=/i);
  });

  it("rejects a callback without an authorization code", async () => {
    const response = await GET(callbackRequest("https://preview.example.vercel.app", ""));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=missing-code");
  });

  it("distinguishes a mismatched Preview callback hostname", async () => {
    state.expectedOrigin = "https://stable-branch.example.vercel.app";
    const response = await GET(callbackRequest("https://old-deployment.example.vercel.app"));
    expect(response.headers.get("location")).toBe("https://old-deployment.example.vercel.app/admin/login?error=callback-mismatch");
  });

  it("distinguishes a missing PKCE verifier cookie", async () => {
    const response = await GET(callbackRequest("https://preview.example.vercel.app", "?code=one-time-code", false));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=pkce");
  });

  it("reports invalid or expired codes without exposing them", async () => {
    state.exchangeError = true;
    const response = await GET(callbackRequest("https://preview.example.vercel.app", "?code=secret-code"));
    const location = response.headers.get("location") || "";

    expect(location).toBe("https://preview.example.vercel.app/admin/login?error=expired");
    expect(location).not.toContain("secret-code");
  });

  it("reports a successful exchange that did not write a session cookie", async () => {
    state.writeSessionCookie = false;
    const response = await GET(callbackRequest("https://preview.example.vercel.app"));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=session-cookie");
    expect(state.signOutCalls).toBe(1);
  });

  it("reports missing Supabase or allowlist configuration", async () => {
    state.configured = false;
    let response = await GET(callbackRequest("https://preview.example.vercel.app"));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=configuration");

    state.configured = true;
    state.allowlistConfigured = false;
    response = await GET(callbackRequest("https://preview.example.vercel.app"));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=configuration");
  });

  it("signs out an authenticated but unauthorized user and clears the cookie", async () => {
    state.allowed = false;
    const response = await GET(callbackRequest("https://preview.example.vercel.app"));

    expect(state.signOutCalls).toBe(1);
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=unauthorized");
    expect(response.cookies.get("sb-project-auth-token")?.value).toBe("");
  });

  it("clears the session if authoritative user verification fails", async () => {
    state.userError = true;
    const response = await GET(callbackRequest("https://preview.example.vercel.app"));

    expect(state.signOutCalls).toBe(1);
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=signin");
  });

  it("does not honor an untrusted redirect target", async () => {
    const response = await GET(callbackRequest(
      "https://preview.example.vercel.app",
      "?code=one-time-code&next=https://attacker.example",
    ));
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin");
  });
});
