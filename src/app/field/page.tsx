import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FieldCapture } from "@/components/field/field-capture";
import { getAdminUser } from "@/lib/admin/auth";
import { sortFieldProjects } from "@/lib/field/schema";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Field Mode", description: "Private field documentation for Zarka Construction.", robots: { index: false, follow: false, nocache: true } };

export default async function FieldPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const user = await getAdminUser(); if (!user) redirect("/admin/login?next=/field");
  const requestedProjectId = (await searchParams).project;
  const config = getSupabasePublicConfig(); if (!config) return <main className="field-shell"><div className="field-empty"><h1>Field Mode is unavailable</h1><p>Supabase public configuration is missing in this environment.</p></div></main>;
  const client = createSupabaseAdminClient();
  const { data: rows } = await client.from("projects").select("*").not("operational_status", "in", '("cancelled","archived")');
  const projects = sortFieldProjects(rows || []);
  const ids = projects.map((project) => project.id);
  const [{ data: photos }, { data: sessions }] = ids.length ? await Promise.all([
    client.from("project_photos").select("project_id,publication_candidate,upload_state").in("project_id", ids).eq("upload_state", "complete"),
    client.from("field_capture_sessions").select("project_id,created_at").in("project_id", ids).in("session_state", ["complete", "partial"]).order("created_at", { ascending: false }),
  ]) : [{ data: [] }, { data: [] }];
  const fieldProjects = projects.map((project) => ({
    id: project.id, internalName: project.internal_name, location: project.public_location,
    startedOn: project.started_on, completedOn: project.completed_on,
    operationalStatus: project.operational_status, projectStage: project.project_stage,
    updatedAt: project.updated_at,
    latestCaptureAt: sessions?.find((item) => item.project_id === project.id)?.created_at || null,
    privatePhotoCount: photos?.filter((item) => item.project_id === project.id && !item.publication_candidate).length || 0,
    candidatePhotoCount: photos?.filter((item) => item.project_id === project.id && item.publication_candidate).length || 0,
  }));
  return <FieldCapture initialProjectId={requestedProjectId} projects={fieldProjects} publishableKey={config.publishableKey} supabaseUrl={config.url} />;
}