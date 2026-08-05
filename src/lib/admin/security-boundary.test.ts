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
  it("keeps Preview magic links on the server-selected stable auth origin", () => {
    const form = readFileSync("src/components/admin/login-form.tsx", "utf8");
    const login = readFileSync("src/app/admin/login/page.tsx", "utf8");
    expect(form).toContain("emailRedirectTo: callbackUrl");
    expect(form).toContain("window.location.replace");
    expect(form).toContain("window.location.origin !== authOrigin");
    expect(login).toContain("getAdminAuthOrigin");
    expect(login).toContain("/auth/callback");
  });
});
