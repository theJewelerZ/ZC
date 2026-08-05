import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sql = readFileSync("supabase/migrations/20260805000100_create_consultation_system.sql", "utf8");

describe("consultation migration security", () => {
  it("creates constrained tables, cascade, indexes, and private bucket", () => {
    expect(sql).toContain("create table public.consultations");
    expect(sql).toContain("create table public.consultation_photos");
    expect(sql).toContain("on delete cascade");
    expect(sql).toContain("consultations_status_created_at_idx");
    expect(sql).toContain("'consultation-photos', 'consultation-photos', false");
  });
  it("enables and forces RLS with no anonymous storage policy", () => {
    expect(sql).toContain("enable row level security");
    expect(sql).toContain("force row level security");
    expect(sql).toContain("revoke all on table public.consultations from anon, authenticated");
    expect(sql).not.toMatch(/create\s+policy/i);
  });
  it("limits finalization to service role", () => {
    expect(sql).toContain("grant execute on function public.finalize_consultation");
    expect(sql).toContain("to service_role");
  });
  it("is additive and contains no destructive table or schema operations", () => {
    expect(sql).not.toMatch(/drop\s+(table|schema)|truncate/i);
    expect(sql).not.toContain("delete from public.");
  });
});
