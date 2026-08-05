import { describe, expect, it } from "vitest";

import { getAdminAuthOrigin } from "@/lib/admin/auth-origin";

describe("admin authentication origin", () => {
  it("uses the stable Git branch URL throughout Preview deployments", () => {
    expect(getAdminAuthOrigin("https://commit-preview.vercel.app", {
      VERCEL_ENV: "preview",
      VERCEL_BRANCH_URL: "stable-branch.vercel.app",
    })).toBe("https://stable-branch.vercel.app");
  });

  it("keeps the current origin in production", () => {
    expect(getAdminAuthOrigin("https://www.zarkaconstruction.com", {
      VERCEL_ENV: "production",
      VERCEL_BRANCH_URL: "unused-preview.vercel.app",
    })).toBe("https://www.zarkaconstruction.com");
  });

  it("supports an explicit safe origin override", () => {
    expect(getAdminAuthOrigin("https://commit-preview.vercel.app", {
      ADMIN_AUTH_ORIGIN: "https://review.example.com",
      VERCEL_ENV: "preview",
      VERCEL_BRANCH_URL: "stable-branch.vercel.app",
    })).toBe("https://review.example.com");
  });

  it("rejects malformed overrides and falls back safely", () => {
    expect(getAdminAuthOrigin("https://commit-preview.vercel.app", {
      ADMIN_AUTH_ORIGIN: "https://review.example.com/unexpected-path",
      VERCEL_ENV: "preview",
      VERCEL_BRANCH_URL: "stable-branch.vercel.app",
    })).toBe("https://stable-branch.vercel.app");
  });
});
