import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/config", () => ({
  getSupabasePublicConfig: () => ({
    url: "https://project.supabase.co",
    publishableKey: "publishable-test-key",
  }),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: {
    cookies: {
      setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void;
    };
  }) => ({
    auth: {
      getClaims: async () => {
        options.cookies.setAll([{
          name: "sb-project-auth-token",
          value: "refreshed-session",
          options: { httpOnly: true, path: "/", sameSite: "lax", secure: true },
        }]);
        return { data: { claims: {} }, error: null };
      },
    },
  }),
}));

import { proxy } from "@/proxy";

describe("Supabase session proxy", () => {
  it("preserves refreshed cookies on the response", async () => {
    const response = await proxy(new NextRequest("https://preview.example.vercel.app/admin", {
      headers: { cookie: "sb-project-auth-token=old-session" },
    }));

    expect(response.cookies.get("sb-project-auth-token")?.value).toBe("refreshed-session");
    expect(response.headers.get("set-cookie")).not.toMatch(/domain=/i);
  });
});
