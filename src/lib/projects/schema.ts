import type { ProjectOperationalStatus, ProjectStage, PublicationStatus, PublicBuildStatus } from "@/lib/supabase/database.types";

export const PROJECT_PRIVATE_BUCKET = "project-media-private";
export const PROJECT_PUBLIC_BUCKET = "project-media-public";
export const PROJECT_PHOTO_MAX_BYTES = 15 * 1024 * 1024;
export const PROJECT_PHOTO_BATCH_MAX = 10;
export const PROJECT_PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const operationalStatuses: ProjectOperationalStatus[] = ["planning", "active", "on_hold", "completed", "cancelled", "archived"];
export const publicationStatuses: PublicationStatus[] = ["private", "draft", "published", "unpublished"];
export const projectStages: ProjectStage[] = ["consultation", "planning", "preparation", "framing", "protection", "finish_work", "technology_coordination", "final_details", "complete"];
export const publicBuildStatuses: PublicBuildStatus[] = ["upcoming", "current", "completed"];

export function projectSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
