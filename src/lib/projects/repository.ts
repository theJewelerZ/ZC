import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProjectPhotoRow, ProjectRow, ProjectUpdateRow, PublicBuildStatus } from "@/lib/supabase/database.types";
import { PROJECT_PUBLIC_BUCKET } from "@/lib/projects/schema";

export type PublicBuild = Pick<ProjectRow, "id" | "slug" | "public_title" | "public_summary" | "public_location" | "public_build_status" | "project_stage" | "started_on" | "completed_on" | "published_at"> & {
  coverPhoto: Pick<ProjectPhotoRow, "caption" | "alt_text"> & { url: string } | null;
};

function publicUrl(path: string) {
  return createSupabaseAdminClient().storage.from(PROJECT_PUBLIC_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function getPublishedBuilds(options: { featuredOnly?: boolean } = {}): Promise<PublicBuild[]> {
  try {
    const client = createSupabaseAdminClient();
    let query = client.from("projects").select("*").eq("publication_status", "published").order("published_at", { ascending: false });
    if (options.featuredOnly) query = query.eq("featured_on_homepage", true);
    const { data: projects, error } = await query;
    if (error || !projects?.length) return [];
    const { data: photos } = await client.from("project_photos").select("*")
      .in("project_id", projects.map((project) => project.id))
      .eq("visibility", "public").eq("approval_status", "approved").eq("upload_state", "complete")
      .order("sort_order").order("created_at");
    return projects.map((project) => {
      const photo = photos?.find((item) => item.project_id === project.id && item.public_storage_path);
      return { ...project, coverPhoto: photo?.public_storage_path ? { caption: photo.caption, alt_text: photo.alt_text, url: publicUrl(photo.public_storage_path) } : null };
    });
  } catch {
    return [];
  }
}

export async function getPublishedBuild(slug: string): Promise<{ project: ProjectRow; updates: ProjectUpdateRow[]; photos: Array<ProjectPhotoRow & { url: string }> } | null> {
  try {
    const client = createSupabaseAdminClient();
    const { data: project } = await client.from("projects").select("*").eq("slug", slug).eq("publication_status", "published").maybeSingle();
    if (!project) return null;
    const [{ data: updates }, { data: photos }] = await Promise.all([
      client.from("project_updates").select("*").eq("project_id", project.id).eq("publication_status", "published").order("occurred_on", { ascending: false }),
      client.from("project_photos").select("*").eq("project_id", project.id).eq("visibility", "public").eq("approval_status", "approved").eq("upload_state", "complete").order("sort_order").order("created_at"),
    ]);
    return { project, updates: updates || [], photos: (photos || []).filter((photo) => photo.public_storage_path).map((photo) => ({ ...photo, url: publicUrl(photo.public_storage_path!) })) };
  } catch {
    return null;
  }
}

export function groupBuilds(builds: PublicBuild[]) {
  return (["current", "upcoming", "completed"] as PublicBuildStatus[]).map((status) => ({ status, builds: builds.filter((build) => build.public_build_status === status) }));
}
