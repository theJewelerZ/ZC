import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("hostname redirect ownership", () => {
  it("delegates custom-domain redirects to Vercel", () => {
    expect(nextConfig.redirects).toBeUndefined();
  });
});
