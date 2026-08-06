import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  join(process.cwd(), "supabase/migrations/20260806000200_create_editorial_build_journal.sql"),
  "utf8",
);

describe("editorial Build journal migration", () => {
  it("adds explicit permission, planned/actual dates, and editorial source fields", () => {
    expect(sql).toContain("publication_permission_status");
    expect(sql).toContain("planned_start_on");
    expect(sql).toContain("actual_completed_on");
    expect(sql).toContain("public_starting_point");
    expect(sql).toContain("public_planning_takeaways");
  });

  it("records sanitized public derivative metadata and selected imagery", () => {
    expect(sql).toContain("public_generated_at");
    expect(sql).toContain("cover_photo_id");
    expect(sql).toContain("social_photo_id");
    expect(sql).toContain("validate_project_editorial_photo");
  });

  it("links consultation provenance without duplicating project truth", () => {
    expect(sql).toContain("source_project_id uuid references public.projects(id) on delete set null");
  });
});
