import { describe, expect, it } from "vitest";
import { isAllowedAdminEmail } from "@/lib/admin/auth";

describe("founder allowlist", () => {
  const allowed = new Set(["founder@example.com"]);
  it("allows the normalized founder email", () => expect(isAllowedAdminEmail(" Founder@Example.com ", allowed)).toBe(true));
  it("rejects anonymous and unauthorized authenticated users", () => {
    expect(isAllowedAdminEmail(null, allowed)).toBe(false);
    expect(isAllowedAdminEmail("other@example.com", allowed)).toBe(false);
  });
});
