import { describe, expect, it } from "vitest";
import { createSubmissionToken, hashSubmissionToken } from "@/lib/consultations/security";

describe("submission tokens", () => {
  it("creates non-reusable random values and stores only stable hashes", () => {
    const first = createSubmissionToken();
    const second = createSubmissionToken();
    expect(first).not.toBe(second);
    expect(hashSubmissionToken(first)).toHaveLength(64);
    expect(hashSubmissionToken(first)).toBe(hashSubmissionToken(first));
    expect(hashSubmissionToken(first)).not.toBe(hashSubmissionToken(second));
  });
});
