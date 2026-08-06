import { describe, expect, it } from "vitest";
import { minimumPasswordLength, validateAdminPassword } from "@/lib/admin/password-policy";

describe("founder password policy", () => {
  it("requires at least fourteen characters", () => {
    expect(minimumPasswordLength).toBe(14);
    expect(validateAdminPassword("Short1!a")).toEqual({ success: false, message: "Use at least 14 characters." });
  });
  it.each([
    ["lowercase1!lowercase", "uppercase"],
    ["UPPERCASE1!UPPERCASE", "lowercase"],
    ["NoNumbers!NoNumbers", "number"],
    ["NoSymbols1NoSymbols", "symbol"],
  ])("rejects a password missing %s", (password, requirement) => {
    const result = validateAdminPassword(password);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message.toLowerCase()).toContain(requirement);
  });
  it("accepts a long mixed password", () => {
    expect(validateAdminPassword("Strong-Generated9-Phrase")).toEqual({ success: true });
  });
});