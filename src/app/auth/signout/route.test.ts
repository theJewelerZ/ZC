import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ configured: true, signOutCalls: 0 }));

vi.mock("@/lib/supabase/config", () => ({
  getSupabasePublicConfig: () => state.configured
    ? { url: "https://project.supabase.co", publishableKey: "publishable-test-key" }
    : null,
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: {
    cookies: {
      setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void;
    };
  }) => ({
    auth: {
      signOut: async () => {
        state.signOutCalls += 1;
        options.cookies.setAll([{
          name: "sb-project-auth-token",
          value: "",
          options: { maxAge: 0, path: "/", sameSite: "lax", secure: true },
        }]);
        return { error: null };
      },
    },
  }),
}));

import { POST } from "@/app/auth/signout/route";

describe("admin sign out", () => {
  beforeEach(() => {
    state.configured = true;
    state.signOutCalls = 0;
  });

  it("clears session cookies on the redirect response", async () => {
    const response = await POST(new NextRequest("https://preview.example.vercel.app/auth/signout", { method: "POST" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login");
    expect(response.cookies.get("sb-project-auth-token")?.value).toBe("");
    expect(state.signOutCalls).toBe(1);
  });

  it("reports missing configuration without attempting sign out", async () => {
    state.configured = false;
    const response = await POST(new NextRequest("https://preview.example.vercel.app/auth/signout", { method: "POST" }));

    expect(response.headers.get("location")).toBe("https://preview.example.vercel.app/admin/login?error=configuration");
    expect(state.signOutCalls).toBe(0);
  });
});
