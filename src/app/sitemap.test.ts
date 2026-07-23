import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("contains exactly the four canonical MVP routes", () => {
    expect(sitemap().map((item) => item.url)).toEqual([
      "https://zarkaconstruction.com/",
      "https://zarkaconstruction.com/contact",
      "https://zarkaconstruction.com/privacy",
      "https://zarkaconstruction.com/terms",
    ]);
  });
});

