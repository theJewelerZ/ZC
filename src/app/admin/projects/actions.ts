"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import {
  isUuid,
  operationalStatuses,
  optionalDate,
  permissionMethods,
  permissionStatuses,
  projectSlug,
  projectStages,
  publicBuildStatuses,
} from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  ProjectOperationalStatus,
  ProjectStage,
  PublicationPermissionMethod,
  PublicationPermissionStatus,
  PublicBuildStatus,
} from "@/lib/supabase/database.types";

const text = (form: FormData, key: string, max = 5000) =>
  String(form.get(key) || "").trim().slice(0, max);

function refreshProject(projectId: string, slug?: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/preview`);
  revalidatePath("/admin");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

function datesAreValid(start: string | null, completion: string | null) {
  return !start || !completion || completion >= start;
}

export async function createProjectAction(form: FormData) {
  const user = await requireAdmin();
  const internalName = text(form, "internalName", 160);
  const slug = projectSlug(text(form, "slug", 120) || internalName);
  if (internalName.length < 2 || !slug) {
    throw new Error("Project name and slug are required.");
  }
  const { data, error } = await createSupabaseAdminClient()
    .from("projects")
    .insert({
      internal_name: internalName,
      public_title: text(form, "publicTitle", 160) || internalName,
      slug,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error("The project could not be created. Check that the slug is unique.");
  }
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectAction(form: FormData) {
  const user = await requireAdmin();
  const id = text(form, "id", 36);
  const operationalStatus = text(form, "operationalStatus") as ProjectOperationalStatus;
  const projectStage = text(form, "projectStage") as ProjectStage;
  const publicBuildStatus = text(form, "publicBuildStatus") as PublicBuildStatus;
  const permissionStatus = text(form, "permissionStatus") as PublicationPermissionStatus;
  const permissionMethod = text(form, "permissionMethod") as PublicationPermissionMethod;
  const plannedStartOn = optionalDate(text(form, "plannedStartOn", 10));
  const plannedCompletionOn = optionalDate(text(form, "plannedCompletionOn", 10));
  const actualStartedOn = optionalDate(text(form, "actualStartedOn", 10));
  const actualCompletedOn = optionalDate(text(form, "actualCompletedOn", 10));
  if (
    !isUuid(id)
    || !operationalStatuses.includes(operationalStatus)
    || !projectStages.includes(projectStage)
    || !publicBuildStatuses.includes(publicBuildStatus)
    || !permissionStatuses.includes(permissionStatus)
    || (permissionStatus !== "not_recorded" && !permissionMethods.includes(permissionMethod))
    || !datesAreValid(plannedStartOn, plannedCompletionOn)
    || !datesAreValid(actualStartedOn, actualCompletedOn)
    || (publicBuildStatus === "completed" && !actualCompletedOn)
  ) {
    throw new Error("Review the project status, permission, and date fields.");
  }

  const client = createSupabaseAdminClient();
  const { data: current } = await client
    .from("projects")
    .select("slug,publication_permission_recorded_at")
    .eq("id", id)
    .maybeSingle();
  if (!current) throw new Error("The project could not be found.");

  const now = new Date().toISOString();
  if (permissionStatus === "withdrawn") {
    const { data: publishedPhotos } = await client
      .from("project_photos")
      .select("public_storage_path")
      .eq("project_id", id)
      .not("public_storage_path", "is", null);
    const paths = (publishedPhotos || [])
      .map((photo) => photo.public_storage_path)
      .filter((path): path is string => Boolean(path));
    if (paths.length) {
      const { error: removeError } = await client.storage.from("project-media-public").remove(paths);
      if (removeError) throw new Error("Public media could not be removed. Permission was not changed.");
    }
    await client.from("project_photos").update({
      visibility: "private",
      public_storage_path: null,
      public_mime_type: null,
      public_byte_size: null,
      public_width: null,
      public_height: null,
      public_generated_at: null,
      published_at: null,
      updated_by: user.id,
    }).eq("project_id", id);
    await client.from("project_updates").update({
      publication_status: "unpublished",
      published_at: null,
      updated_by: user.id,
    }).eq("project_id", id);
  }

  const recordedAt = permissionStatus === "not_recorded"
    ? null
    : current.publication_permission_recorded_at || now;
  const { error } = await client
    .from("projects")
    .update({
      internal_name: text(form, "internalName", 160),
      slug: projectSlug(text(form, "slug", 120)),
      public_title: text(form, "publicTitle", 160),
      public_summary: text(form, "publicSummary", 600) || null,
      public_location: text(form, "publicLocation", 120) || null,
      public_starting_point: text(form, "publicStartingPoint", 3000) || null,
      public_zarka_role: text(form, "publicZarkaRole", 3000) || null,
      public_outcome: text(form, "publicOutcome", 3000) || null,
      public_planning_takeaways: text(form, "publicPlanningTakeaways", 3000) || null,
      private_address: text(form, "privateAddress", 300) || null,
      internal_scope: text(form, "internalScope") || null,
      internal_notes: text(form, "internalNotes") || null,
      operational_status: operationalStatus,
      project_stage: projectStage,
      public_build_status: publicBuildStatus,
      planned_start_on: plannedStartOn,
      planned_completion_on: plannedCompletionOn,
      actual_started_on: actualStartedOn,
      actual_completed_on: actualCompletedOn,
      started_on: plannedStartOn,
      completed_on: plannedCompletionOn,
      publication_permission_status: permissionStatus,
      publication_permission_method: permissionStatus === "not_recorded" ? null : permissionMethod,
      publication_permission_recorded_at: recordedAt,
      publication_permission_withdrawn_at: permissionStatus === "withdrawn" ? now : null,
      publication_permission_reference: permissionStatus === "not_recorded" ? null : text(form, "permissionReference", 500) || null,
      publication_permission_notes: permissionStatus === "not_recorded" ? null : text(form, "permissionNotes", 2000) || null,
      featured_on_homepage: permissionStatus === "withdrawn" ? false : form.get("featured") === "on",
      ...(permissionStatus === "withdrawn"
        ? {
            publication_status: "unpublished" as const,
            cover_photo_id: null,
            social_photo_id: null,
          }
        : {}),
      updated_by: user.id,
    })
    .eq("id", id);
  if (error) throw new Error("The project could not be saved.");
  refreshProject(id, current.slug);
  redirect(`/admin/projects/${id}?saved=1`);
}

export async function setProjectPublicationAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id", 36);
  const intent = text(form, "intent");
  if (!isUuid(id) || !["publish", "unpublish"].includes(intent)) {
    throw new Error("Publication request is invalid.");
  }
  const client = createSupabaseAdminClient();
  const { data } = await client
    .from("projects")
    .select("slug,public_summary,public_build_status,actual_completed_on,publication_permission_status")
    .eq("id", id)
    .single();
  if (intent === "publish") {
    if (data?.publication_permission_status !== "granted") {
      throw new Error("Record publication permission before publishing this Build.");
    }
    if (!data.public_summary || data.public_summary.trim().length < 20) {
      throw new Error("Add a public summary before publishing.");
    }
    if (data.public_build_status === "completed" && !data.actual_completed_on) {
      throw new Error("Add the actual completion date before publishing a completed Build.");
    }
  }
  const { error } = await client
    .from("projects")
    .update({
      publication_status: intent === "publish" ? "published" : "unpublished",
      published_at: intent === "publish" ? new Date().toISOString() : null,
      ...(intent === "unpublish" ? { featured_on_homepage: false } : {}),
    })
    .eq("id", id);
  if (error) throw new Error("Publication could not be updated.");
  refreshProject(id, data?.slug);
  redirect(`/admin/projects/${id}?publication=1`);
}

export async function createProjectUpdateAction(form: FormData) {
  const user = await requireAdmin();
  const projectId = text(form, "projectId", 36);
  const title = text(form, "title", 160);
  const body = text(form, "body");
  const stage = text(form, "projectStage") as ProjectStage;
  if (!isUuid(projectId) || title.length < 2 || body.length < 10 || !projectStages.includes(stage)) {
    throw new Error("Milestone title, story, and stage are required.");
  }
  const { error } = await createSupabaseAdminClient().from("project_updates").insert({
    project_id: projectId,
    title,
    body,
    project_stage: stage,
    occurred_on: optionalDate(text(form, "occurredOn", 10)) || new Date().toISOString().slice(0, 10),
    created_by: user.id,
    updated_by: user.id,
  });
  if (error) throw new Error("The milestone could not be saved.");
  refreshProject(projectId);
}

export async function updateProjectUpdateAction(form: FormData) {
  const user = await requireAdmin();
  const id = text(form, "id", 36);
  const projectId = text(form, "projectId", 36);
  const title = text(form, "title", 160);
  const body = text(form, "body");
  const stage = text(form, "projectStage") as ProjectStage;
  const occurredOn = optionalDate(text(form, "occurredOn", 10));
  if (!isUuid(id) || !isUuid(projectId) || title.length < 2 || body.length < 10 || !projectStages.includes(stage) || !occurredOn) {
    throw new Error("Review the milestone title, story, stage, and date.");
  }
  const { error } = await createSupabaseAdminClient()
    .from("project_updates")
    .update({ title, body, project_stage: stage, occurred_on: occurredOn, updated_by: user.id })
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) throw new Error("The milestone could not be updated.");
  refreshProject(projectId);
}

export async function setUpdatePublicationAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id", 36);
  const projectId = text(form, "projectId", 36);
  const intent = text(form, "intent");
  if (!isUuid(id) || !isUuid(projectId) || !["publish", "unpublish"].includes(intent)) {
    throw new Error("Milestone publication request is invalid.");
  }
  const client = createSupabaseAdminClient();
  const { data: project } = await client
    .from("projects")
    .select("slug,publication_status,publication_permission_status")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) throw new Error("The Build could not be found.");
  if (intent === "publish" && (project.publication_status !== "published" || project.publication_permission_status !== "granted")) {
    throw new Error("Publish the permission-cleared Build before publishing a milestone.");
  }
  const { error } = await client
    .from("project_updates")
    .update({
      publication_status: intent === "publish" ? "published" : "unpublished",
      published_at: intent === "publish" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) throw new Error("Milestone publication could not be changed.");
  refreshProject(projectId, project.slug);
}
