import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const sql = readFileSync(join(process.cwd(), "supabase/migrations/20260806000100_create_field_capture_sessions.sql"), "utf8");
const startRoute = readFileSync(join(process.cwd(), "src/app/api/field/captures/start/route.ts"), "utf8");
const finalizeRoute = readFileSync(join(process.cwd(), "src/app/api/field/captures/finalize/route.ts"), "utf8");
const publicRepository = readFileSync(join(process.cwd(), "src/lib/projects/repository.ts"), "utf8");
describe("Field Mode data and privacy boundaries", () => {
  it("creates session-owned notes and candidate media without changing public status", () => { expect(sql).toContain("field_capture_sessions"); expect(sql).toContain("field_note"); expect(sql).toContain("publication_candidate"); expect(sql).toContain("not publication_candidate"); expect(sql).not.toContain("alter column publication_status"); });
  it("forces RLS and denies direct anonymous or authenticated table access", () => { expect(sql).toContain("force row level security"); expect(sql).toContain("revoke all on table public.field_capture_sessions from anon, authenticated"); expect(sql).toContain("using (false) with check (false)"); });
  it("binds photos to generated project paths and validates stored signatures", () => { expect(startRoute).toContain("generatedProjectPhotoPath"); expect(startRoute).toContain("createSignedUploadUrl"); expect(finalizeRoute).toContain("verifyPrivateProjectPhoto"); expect(finalizeRoute).toContain("capture_session_id"); });
  it("updates only internal stage after durable content", () => { expect(finalizeRoute).toContain("project_stage: session.project_stage"); expect(finalizeRoute).not.toContain("publication_status:"); expect(finalizeRoute).not.toContain("public_build_status:"); });
  it("keeps private notes and candidates out of public serialization", () => { expect(publicRepository).not.toContain("field_capture_sessions"); expect(publicRepository).toContain('.eq("visibility", "public")'); expect(publicRepository).toContain('.eq("approval_status", "approved")'); });
});