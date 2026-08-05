import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";

describe("legacy contact endpoint", () => {
  it("cannot bypass durable consultation persistence", async () => {
    const response = await POST();
    expect(response.status).toBe(410);
    expect(await response.json()).toMatchObject({
      ok: false,
      message: expect.stringContaining("retired"),
    });
  });
});
