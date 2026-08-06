"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import {
  isUuid,
  operationalStatuses,
  projectSlug,
  projectStages,
  publicBuildStatuses,
} from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  ProjectOperationalStatus,
  ProjectStage,
  PublicBuildStatus,
} from "@/lib/supabase/database.types";

const text = (form: FormData, key: string, max = 5000) =>
  String(form.get(key) || "").trim().slice(0, max);

function refreshProject(projectId: string) {
  revalidatePath("/admin/projects/" + projectId);
  revalidatePath("/projects");
  revalidatePath("/");
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
  redirect("/admin/projects/" + data.id);
}

export async function updateProjectAction(form: FormData) {
  const user = await requireAdmin();
  const id = text(form, "id", 36);
  const operationalStatus = text(form, "operationalStatus") as ProjectOperationalStatus;
  const projectStage = text(form, "projectStage") as ProjectStage;
  const publicBuildStatus = text(form, "publicBuildStatus") as PublicBuildStatus;
  if (
    !isUuid(id) ||
    !operationalStatuses.includes(operationalStatus) ||
    !projectStages.includes(projectStage) ||
    !publicBuildStatuses.includes(publicBuildStatus)
  ) {
    throw new Error("Project fields could not be validated.");
  }
  const { error } = await createSupabaseAdminClient()
    .from("projects")
    .update({
      internal_name: text(form, "internalName", 160),
      slug: projectSlug(text(form, "slug", 120)),
      public_title: text(form, "publicTitle", 160),
      public_summary: text(form, "publicSummary", 600) || null,
      public_location: text(form, "publicLocation", 120) || null,
      private_address: text(form, "privateAddress", 300) || null,
      internal_scope: text(form, "internalScope") || null,
      internal_notes: text(form, "internalNotes") || null,
      operational_status: operationalStatus,
      project_stage: projectStage,
      public_build_status: publicBuildStatus,
      featured_on_homepage: form.get("featured") === "on",
      started_on: text(form, "startedOn", 10) || null,
      completed_on: text(form, "completedOn", 10) || null,
      updated_by: user.id,
    })
    .eq("id", id);
  if (error) throw new Error("The project could not be saved.");
  refreshProject(id);
  redirect("/admin/projects/" + id + "?saved=1");
}

export async function setProjectPublicationAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id", 36);
  const intent = text(form, "intent");
  if (!isUuid(id) || !["publish", "unpublish"].includes(intent)) {
    throw new Error("Publication request is invalid.");
  }
  const client = createSupabaseAdminClient();
  const { data } = await client.from("projects").select("public_summary").eq("id", id).single();
  if (intent === "publish" && (!data?.public_summary || data.public_summary.trim().length < 20)) {
    throw new Error("Add a public summary before publishing.");
  }
  const { error } = await client
    .from("projects")
    .update({
      publication_status: intent === "publish" ? "published" : "unpublished",
      published_at: intent === "publish" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error("Publication could not be updated.");
  refreshProject(id);
  redirect("/admin/projects/" + id + "?publication=1");
}

export async function createProjectUpdateAction(form: FormData) {
  const user = await requireAdmin();
  const projectId = text(form, "projectId", 36);
  const title = text(form, "title", 160);
  const body = text(form, "body");
  const stage = text(form, "projectStage") as ProjectStage;
  if (!isUuid(projectId) || title.length < 2 || body.length < 10 || !projectStages.includes(stage)) {
    throw new Error("Update title, story, and stage are required.");
  }
  const { error } = await createSupabaseAdminClient().from("project_updates").insert({
    project_id: projectId,
    title,
    body,
    project_stage: stage,
    occurred_on: text(form, "occurredOn", 10) || new Date().toISOString().slice(0, 10),
    created_by: user.id,
    updated_by: user.id,
  });
  if (error) throw new Error("The update could not be saved.");
  revalidatePath("/admin/projects/" + projectId);
}

export async function setUpdatePublicationAction(form: FormData) {
  await requireAdmin();
  const id = text(form, "id", 36);
  const projectId = text(form, "projectId", 36);
  const intent = text(form, "intent");
  if (!isUuid(id) || !isUuid(projectId) || !["publish", "unpublish"].includes(intent)) {
    throw new Error("Update publication request is invalid.");
  }
  const { error } = await createSupabaseAdminClient()
    .from("project_updates")
    .update({
      publication_status: intent === "publish" ? "published" : "unpublished",
      published_at: intent === "publish" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) throw new Error("Update publication could not be changed.");
  refreshProject(projectId);
}
