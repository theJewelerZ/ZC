import { describe, expect, it } from "vitest";

import {
  simulatorFaqs,
  simulatorImageSlots,
  simulatorProcess,
} from "@/config/simulator";

describe("simulator page configuration", () => {
  it("keeps project photography disabled until approved assets are supplied", () => {
    for (const slot of simulatorImageSlots) {
      expect(slot.src).toBeNull();
      expect(slot.alt.length).toBeGreaterThan(20);
    }
  });

  it("provides complete process and FAQ content", () => {
    expect(simulatorProcess).toHaveLength(4);
    expect(simulatorFaqs.length).toBeGreaterThanOrEqual(5);
  });
});
