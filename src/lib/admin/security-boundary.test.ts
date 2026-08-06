import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("private dashboard security boundary", () => {
  it("authorizes before list and detail data access and signed URL creation", () => {
    const list = readFileSync("src/app/admin/page.tsx", "utf8");
    const detail = readFileSync("src/app/admin/consultations/[id]/page.tsx", "utf8");
    expect(list.indexOf("await requireAdmin()")).toBeLessThan(list.indexOf("createSupabaseAdminClient()"));
    expect(detail.indexOf("await requireAdmin()")).toBeLessThan(detail.indexOf("createSupabaseAdminClient()"));
    expect(detail.indexOf("await requireAdmin()")).toBeLessThan(detail.indexOf("createSignedUrl"));
  });
  it("authorizes status and notes mutations and exposes no delete action", () => {
    const actions = readFileSync("src/app/admin/actions.ts", "utf8");
    expect(actions).toContain("await requireAdmin()");
    expect(actions).toContain("internal_notes");
    expect(actions).not.toContain(".delete()");
  });
  it("uses password login without public signup and retains allowlisted server authorization", () => {
    const form = readFileSync("src/components/admin/login-form.tsx", "utf8");
    const route = readFileSync("src/app/api/admin/auth/login/route.ts", "utf8");
    expect(form).toContain("/api/admin/auth/login");
    expect(form).not.toContain("signInWithOtp");
    expect(route).toContain("signInWithPassword");
    expect(route).toContain("isAllowedAdminEmail");
    expect(route).not.toContain("signUp");
  });
  it("guards password setup and does not log credentials or tokens", () => {
    const setup = readFileSync("src/app/admin/set-password/page.tsx", "utf8");
    const sources = [
      readFileSync("src/app/api/admin/auth/login/route.ts", "utf8"),
      readFileSync("src/app/api/admin/auth/password/route.ts", "utf8"),
      readFileSync("src/app/auth/recovery/route.ts", "utf8"),
    ];
    expect(setup).toContain("await requireAdmin()");
    for (const source of sources) {
      expect(source).not.toMatch(/console\.(?:log|info|warn|error)\([\s\S]*?(?:password|token|cookie|email)/i);
    }
  });
});