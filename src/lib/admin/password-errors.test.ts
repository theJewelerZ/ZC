import { describe, expect, it } from "vitest";

import { classifyPasswordUpdateError } from "@/lib/admin/password-errors";

describe("password update error classification", () => {
  it.each([
    ["weak_password", "weak_password", "active security rules"],
    ["same_password", "same_password", "different"],
    ["reauthentication_needed", "reauthentication", "recovery session expired"],
    ["session_expired", "reauthentication", "recovery session expired"],
    ["over_request_rate_limit", "rate_limit", "Too many"],
  ])("maps %s to a safe founder-facing category", (code, reason, copy) => {
    const result = classifyPasswordUpdateError({ code });
    expect(result.reason).toBe(reason);
    expect(result.message).toContain(copy);
  });

  it("does not expose an unknown provider message", () => {
    const result = classifyPasswordUpdateError({ code: "unexpected_failure" });
    expect(result.reason).toBe("provider");
    expect(result.message).not.toContain("unexpected_failure");
  });
});
