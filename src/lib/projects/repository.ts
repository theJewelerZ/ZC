import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProjectPhotoRow, ProjectRow, ProjectUpdateRow, PublicBuildStatus } from "@/lib/supabase/database.types";
import { PROJECT_PUBLIC_BUCKET } from "@/lib/projects/schema";

const publicProjectColumns = [
  "id", "slug", "public_title", "public_summary", "public_location",
  "public_build_status", "published_at", "updated_at",
  "planned_start_on", "planned_completion_on", "actual_started_on", "actual_completed_on",
  "public_starting_point", "public_zarka_role", "public_outcome", "public_planning_takeaways",
  "cover_photo_id", "social_photo_id",
].join(",");

const publicPhotoColumns = [
  "id", "project_id", "update_id", "public_storage_path", "caption", "alt_text",
  "sort_order", "published_at", "public_width", "public_height", "public_generated_at",
].join(",");

const publicUpdateColumns = [
  "id", "project_id", "title", "body", "occurred_on", "published_at", "updated_at",
].join(",");

type PublicProjectRecord = Pick<ProjectRow,
  | "id" | "slug" | "public_title" | "public_summary" | "public_location"
  | "public_build_status" | "published_at" | "updated_at"
  | "planned_start_on" | "planned_completion_on" | "actual_started_on" | "actual_completed_on"
  | "public_starting_point" | "public_zarka_role" | "public_outcome" | "public_planning_takeaways"
  | "cover_photo_id" | "social_photo_id"
>;

type PublicPhotoRecord = Pick<ProjectPhotoRow,
  | "id" | "project_id" | "update_id" | "public_storage_path" | "caption" | "alt_text"
  | "sort_order" | "published_at" | "public_width" | "public_height" | "public_generated_at"
>;

type PublicUpdateRecord = Pick<ProjectUpdateRow,
  "id" | "project_id" | "title" | "body" | "occurred_on" | "published_at" | "updated_at"
>;

export type PublicBuildPhoto = {
  id: string;
  projectId: string;
  updateId: string | null;
  caption: string;
  altText: string;
  url: string;
  width: number;
  height: number;
  sortOrder: number;
  publishedAt: string | null;
};

export type PublicBuild = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  location: string | null;
  status: PublicBuildStatus;
  publishedAt: string | null;
  updatedAt: string;
  plannedStartOn: string | null;
  plannedCompletionOn: string | null;
  actualStartedOn: string | null;
  actualCompletedOn: string | null;
  startingPoint: string | null;
  zarkaRole: string | null;
  outcome: string | null;
  planningTakeaways: string | null;
  coverPhoto: PublicBuildPhoto | null;
  socialPhoto: PublicBuildPhoto | null;
  latestMilestone: { title: string; occurredOn: string } | null;
};

export type PublicBuildDetail = {
  project: PublicBuild;
  milestones: Array<{
    id: string;
    title: string;
    story: string;
    occurredOn: string;
    publishedAt: string | null;
    photos: PublicBuildPhoto[];
  }>;
  unassignedPhotos: PublicBuildPhoto[];
  lastModified: string;
};

function publicUrl(path: string) {
  return createSupabaseAdminClient().storage.from(PROJECT_PUBLIC_BUCKET).getPublicUrl(path).data.publicUrl;
}

function mapPhoto(photo: PublicPhotoRecord): PublicBuildPhoto | null {
  if (!photo.public_storage_path || !photo.caption || !photo.alt_text || !photo.public_generated_at) return null;
  return {
    id: photo.id,
    projectId: photo.project_id,
    updateId: photo.update_id,
    caption: photo.caption,
    altText: photo.alt_text,
    url: publicUrl(photo.public_storage_path),
    width: photo.public_width || 1600,
    height: photo.public_height || 1200,
    sortOrder: photo.sort_order,
    publishedAt: photo.published_at,
  };
}

function mapProject(
  project: PublicProjectRecord,
  photos: PublicBuildPhoto[],
  updates: PublicUpdateRecord[] = [],
): PublicBuild {
  const coverPhoto = photos.find((photo) => photo.id === project.cover_photo_id) || null;
  const socialPhoto = photos.find((photo) => photo.id === project.social_photo_id) || coverPhoto;
  const latestMilestone = [...updates]
    .sort((a, b) => b.occurred_on.localeCompare(a.occurred_on))[0];
  const updatedAt = [
    project.updated_at,
    project.published_at,
    ...updates.map((update) => update.updated_at),
    ...photos.map((photo) => photo.publishedAt),
  ].filter((value): value is string => Boolean(value)).sort().at(-1) || project.updated_at;

  return {
    id: project.id,
    slug: project.slug,
    title: project.public_title,
    summary: project.public_summary || "",
    location: project.public_location,
    status: project.public_build_status,
    publishedAt: project.published_at,
    updatedAt,
    plannedStartOn: project.planned_start_on,
    plannedCompletionOn: project.planned_completion_on,
    actualStartedOn: project.actual_started_on,
    actualCompletedOn: project.actual_completed_on,
    startingPoint: project.public_starting_point,
    zarkaRole: project.public_zarka_role,
    outcome: project.public_outcome,
    planningTakeaways: project.public_planning_takeaways,
    coverPhoto,
    socialPhoto,
    latestMilestone: latestMilestone ? { title: latestMilestone.title, occurredOn: latestMilestone.occurred_on } : null,
  };
}

async function getPublicPhotos(projectIds: string[]) {
  if (!projectIds.length) return [];
  const { data } = await createSupabaseAdminClient()
    .from("project_photos")
    .select(publicPhotoColumns)
    .in("project_id", projectIds)
    .eq("visibility", "public")
    .eq("approval_status", "approved")
    .eq("upload_state", "complete")
    .not("public_generated_at", "is", null)
    .order("sort_order")
    .order("created_at");
  return ((data || []) as unknown as PublicPhotoRecord[])
    .map(mapPhoto)
    .filter((photo): photo is PublicBuildPhoto => Boolean(photo));
}

async function getPublicUpdates(projectIds: string[]) {
  if (!projectIds.length) return [];
  const { data } = await createSupabaseAdminClient()
    .from("project_updates")
    .select(publicUpdateColumns)
    .in("project_id", projectIds)
    .eq("publication_status", "published")
    .order("occurred_on", { ascending: true })
    .order("created_at", { ascending: true });
  return (data || []) as unknown as PublicUpdateRecord[];
}

export async function getPublishedBuilds(options: { featuredOnly?: boolean } = {}): Promise<PublicBuild[]> {
  try {
    const client = createSupabaseAdminClient();
    let query = client
      .from("projects")
      .select(publicProjectColumns)
      .eq("publication_status", "published")
      .eq("publication_permission_status", "granted")
      .order("published_at", { ascending: false });
    if (options.featuredOnly) query = query.eq("featured_on_homepage", true);
    const { data, error } = await query;
    if (error || !data?.length) return [];
    const projects = data as unknown as PublicProjectRecord[];
    const ids = projects.map((project) => project.id);
    const [photos, updates] = await Promise.all([getPublicPhotos(ids), getPublicUpdates(ids)]);
    return projects.map((project) => mapProject(
      project,
      photos.filter((photo) => photo.projectId === project.id),
      updates.filter((update) => update.project_id === project.id),
    ));
  } catch {
    return [];
  }
}

export async function getPublishedBuild(slug: string): Promise<PublicBuildDetail | null> {
  try {
    const client = createSupabaseAdminClient();
    const { data } = await client
      .from("projects")
      .select(publicProjectColumns)
      .eq("slug", slug)
      .eq("publication_status", "published")
      .eq("publication_permission_status", "granted")
      .maybeSingle();
    if (!data) return null;
    const projectRecord = data as unknown as PublicProjectRecord;
    const [photos, updates] = await Promise.all([
      getPublicPhotos([projectRecord.id]),
      getPublicUpdates([projectRecord.id]),
    ]);
    const milestones = updates.map((update) => ({
      id: update.id,
      title: update.title,
      story: update.body,
      occurredOn: update.occurred_on,
      publishedAt: update.published_at,
      photos: photos.filter((photo) => photo.updateId === update.id),
    }));
    const project = mapProject(projectRecord, photos, updates);
    const modifiedCandidates = [
      project.updatedAt,
      project.publishedAt,
      ...updates.map((update) => update.updated_at),
      ...photos.map((photo) => photo.publishedAt),
    ].filter((value): value is string => Boolean(value));
    return {
      project,
      milestones,
      unassignedPhotos: photos.filter((photo) => !photo.updateId),
      lastModified: modifiedCandidates.sort().at(-1) || project.updatedAt,
    };
  } catch {
    return null;
  }
}

export async function getPublishedBuildContext(slug: string) {
  const result = await getPublishedBuild(slug);
  return result ? { id: result.project.id, slug: result.project.slug, title: result.project.title } : null;
}

export function groupBuilds(builds: PublicBuild[]) {
  return (["current", "upcoming", "completed"] as PublicBuildStatus[])
    .map((status) => ({ status, builds: builds.filter((build) => build.status === status) }));
}
