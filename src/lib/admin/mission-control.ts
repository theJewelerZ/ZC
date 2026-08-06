import "server-only";

import { createMissionControlModel, type MissionSnapshot } from "@/lib/admin/mission-control-model";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const QUERY_LIMITS = {
  projects: 100,
  consultations: 200,
  photos: 500,
  updates: 300,
  captures: 200,
} as const;

export async function getMissionControlData() {
  const client = createSupabaseAdminClient();
  const [projectsResult, consultationsResult, photosResult, updatesResult, capturesResult] = await Promise.all([
    client.from("projects").select("id,created_at,updated_at,internal_name,slug,public_location,operational_status,project_stage,publication_status,public_build_status,started_on,completed_on").order("updated_at", { ascending: false }).limit(QUERY_LIMITS.projects),
    client.from("consultations").select("id,created_at,completed_at,name,project_location,status,submission_state,notification_status").order("created_at", { ascending: false }).limit(QUERY_LIMITS.consultations),
    client.from("project_photos").select("id,project_id,created_at,publication_candidate,visibility,upload_state").order("created_at", { ascending: false }).limit(QUERY_LIMITS.photos),
    client.from("project_updates").select("id,project_id,created_at,occurred_on,title,publication_status,published_at").order("created_at", { ascending: false }).limit(QUERY_LIMITS.updates),
    client.from("field_capture_sessions").select("id,project_id,created_at,completed_at,session_state").order("created_at", { ascending: false }).limit(QUERY_LIMITS.captures),
  ]);

  const error = [projectsResult.error, consultationsResult.error, photosResult.error, updatesResult.error, capturesResult.error].find(Boolean);
  if (error) throw new Error("Mission Control could not be loaded.");

  const snapshot: MissionSnapshot = {
    projects: (projectsResult.data ?? []).map((row) => ({ id: row.id, createdAt: row.created_at, updatedAt: row.updated_at, internalName: row.internal_name, slug: row.slug, publicLocation: row.public_location, operationalStatus: row.operational_status, projectStage: row.project_stage, publicationStatus: row.publication_status, publicBuildStatus: row.public_build_status, startedOn: row.started_on, completedOn: row.completed_on })),
    consultations: (consultationsResult.data ?? []).map((row) => ({ id: row.id, createdAt: row.created_at, completedAt: row.completed_at, name: row.name, projectLocation: row.project_location, status: row.status, submissionState: row.submission_state, notificationStatus: row.notification_status })),
    photos: (photosResult.data ?? []).map((row) => ({ id: row.id, projectId: row.project_id, createdAt: row.created_at, publicationCandidate: row.publication_candidate, visibility: row.visibility, uploadState: row.upload_state })),
    updates: (updatesResult.data ?? []).map((row) => ({ id: row.id, projectId: row.project_id, createdAt: row.created_at, occurredOn: row.occurred_on, title: row.title, publicationStatus: row.publication_status, publishedAt: row.published_at })),
    captures: (capturesResult.data ?? []).map((row) => ({ id: row.id, projectId: row.project_id, createdAt: row.created_at, completedAt: row.completed_at, sessionState: row.session_state })),
  };
  return createMissionControlModel(snapshot);
}

export const missionControlQueryLimits = QUERY_LIMITS;
