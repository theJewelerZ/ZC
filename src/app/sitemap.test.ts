import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("contains the canonical public routes", () => {
    expect(sitemap().map((item) => item.url)).toEqual([
      "https://www.zarkaconstruction.com/",
      "https://www.zarkaconstruction.com/simulator-construction",
      "https://www.zarkaconstruction.com/contact",
      "https://www.zarkaconstruction.com/privacy",
      "https://www.zarkaconstruction.com/terms",
    ]);
  });
});
