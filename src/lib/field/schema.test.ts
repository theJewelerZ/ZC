import { describe, expect, it } from "vitest";
import { canCaptureProject, FIELD_NOTE_MAX_LENGTH, FIELD_PHOTO_BATCH_MAX, fieldStageOptions, isProjectStage, safeFieldNote, sortFieldProjects } from "@/lib/field/schema";

describe("Field Mode rules", () => {
  it("uses the existing stage taxonomy and field-friendly labels", () => { expect(fieldStageOptions).toHaveLength(9); expect(isProjectStage("framing")).toBe(true); expect(isProjectStage("equipment_sales")).toBe(false); });
  it("supports up to twenty photos and bounded private notes", () => { expect(FIELD_PHOTO_BATCH_MAX).toBe(20); expect(FIELD_NOTE_MAX_LENGTH).toBe(1000); expect(safeFieldNote(" x ")).toBe("x"); expect(safeFieldNote("x".repeat(1001))).toHaveLength(1000); });
  it("rejects cancelled and archived builds", () => { expect(canCaptureProject("active")).toBe(true); expect(canCaptureProject("planning")).toBe(true); expect(canCaptureProject("cancelled")).toBe(false); expect(canCaptureProject("archived")).toBe(false); });
  it("prioritizes active, then upcoming, then recently completed builds", () => {
    const projects = [
      { operational_status: "completed" as const, started_on: "2026-01-01", updated_at: "2026-08-03" },
      { operational_status: "planning" as const, started_on: "2026-09-01", updated_at: "2026-08-02" },
      { operational_status: "active" as const, started_on: "2026-08-01", updated_at: "2026-08-01" },
    ];
    expect(sortFieldProjects(projects).map((p) => p.operational_status)).toEqual(["active", "planning", "completed"]);
  });
});