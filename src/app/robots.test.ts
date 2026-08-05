import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows crawling and advertises the canonical www sitemap in production", () => {
    vi.stubEnv("NEXT_PUBLIC_SEARCH_INDEXING_ENABLED", "true");

    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/auth", "/api"] },
      sitemap: "https://www.zarkaconstruction.com/sitemap.xml",
      host: "https://www.zarkaconstruction.com",
    });
  });

  it("defaults to disallowing crawling when indexing is not enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_SEARCH_INDEXING_ENABLED", "");

    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
});
