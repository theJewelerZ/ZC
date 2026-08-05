import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ email: "founder@example.com", error: false }));

vi.mock("@/lib/admin/auth-diagnostics", () => ({ logAdminAuthStage: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseReadOnlyServerClient: async () => ({
    auth: {
      getUser: async () => state.error
        ? { data: { user: null }, error: new Error("invalid session") }
        : { data: { user: { id: "founder-id", email: state.email } }, error: null },
    },
  }),
}));

import { getAdminUser } from "@/lib/admin/auth";

describe("admin session guard", () => {
  const originalAllowlist = process.env.ADMIN_ALLOWED_EMAILS;

  beforeEach(() => {
    process.env.ADMIN_ALLOWED_EMAILS = "founder@example.com";
    state.email = "founder@example.com";
    state.error = false;
  });

  afterEach(() => {
    if (originalAllowlist === undefined) delete process.env.ADMIN_ALLOWED_EMAILS;
    else process.env.ADMIN_ALLOWED_EMAILS = originalAllowlist;
  });

  it("accepts the allowlisted founder from the server-readable Supabase session", async () => {
    await expect(getAdminUser()).resolves.toMatchObject({ email: "founder@example.com" });
  });

  it("rejects an unauthorized authenticated session", async () => {
    state.email = "other@example.com";
    await expect(getAdminUser()).resolves.toBeNull();
  });

  it("rejects a session Supabase cannot verify", async () => {
    state.error = true;
    await expect(getAdminUser()).resolves.toBeNull();
  });
});
