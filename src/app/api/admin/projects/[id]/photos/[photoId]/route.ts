import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getAdminUser } from "@/lib/admin/auth";
import { sanitizeProjectPhoto, generatedPublicPhotoPath } from "@/lib/projects/public-image";
import {
  PROJECT_PRIVATE_BUCKET,
  PROJECT_PUBLIC_BUCKET,
  isUuid,
} from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type PhotoIntent = "save" | "publish" | "unpublish" | "set-cover" | "set-social";

function response(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

function revalidateProject(projectId: string, slug: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/preview`);
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/projects");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> },
) {
  const user = await getAdminUser();
  if (!user) return response("Your founder session has expired. Sign in again.", 401);
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return response("The photo request could not be verified.", 403);
  }

  const { id: projectId, photoId } = await params;
  if (!isUuid(projectId) || !isUuid(photoId)) {
    return response("The photo request is invalid.", 400);
  }

  const body = await request.json().catch(() => null) as {
    intent?: PhotoIntent;
    caption?: string;
    altText?: string;
    updateId?: string | null;
    sortOrder?: number;
  } | null;
  const intent = body?.intent;
  const caption = String(body?.caption || "").trim().slice(0, 300);
  const altText = String(body?.altText || "").trim().slice(0, 300);
  const updateId = body?.updateId && isUuid(body.updateId) ? body.updateId : null;
  const sortOrder = Number.isInteger(body?.sortOrder) && Number(body?.sortOrder) >= 0
    ? Math.min(Number(body?.sortOrder), 10_000)
    : 0;
  if (!intent || !["save", "publish", "unpublish", "set-cover", "set-social"].includes(intent)) {
    return response("The photo request is invalid.", 400);
  }

  const client = createSupabaseAdminClient();
  const [{ data: photo, error: photoError }, { data: project }] = await Promise.all([
    client.from("project_photos").select("*").eq("id", photoId).eq("project_id", projectId).single(),
    client.from("projects").select("slug,publication_status,publication_permission_status").eq("id", projectId).maybeSingle(),
  ]);
  if (photoError || !photo || !project) return response("The photo could not be found.", 404);

  if (updateId) {
    const { data: milestone } = await client
      .from("project_updates")
      .select("id")
      .eq("id", updateId)
      .eq("project_id", projectId)
      .maybeSingle();
    if (!milestone) return response("The selected milestone is not part of this Build.", 422);
  }

  if (intent === "set-cover" || intent === "set-social") {
    if (
      photo.visibility !== "public"
      || photo.approval_status !== "approved"
      || !photo.public_storage_path
      || !photo.public_generated_at
    ) {
      return response("Publish a sanitized copy before selecting this editorial image.", 422);
    }
    const selection = intent === "set-cover"
      ? { cover_photo_id: photo.id }
      : { social_photo_id: photo.id };
    const { error } = await client.from("projects").update(selection).eq("id", projectId);
    if (error) return response("The editorial image selection could not be saved.", 503);
    revalidateProject(projectId, project.slug);
    return NextResponse.json({ ok: true, message: intent === "set-cover" ? "Cover image selected." : "Social preview image selected." });
  }

  if ((intent === "publish" || photo.visibility === "public") && (!caption || !altText)) {
    return response("Add both a customer-facing caption and descriptive alt text before publishing.", 422);
  }

  const { error: detailsError } = await client
    .from("project_photos")
    .update({
      caption: caption || null,
      alt_text: altText || null,
      update_id: updateId,
      sort_order: sortOrder,
      updated_by: user.id,
    })
    .eq("id", photoId)
    .eq("project_id", projectId);
  if (detailsError) return response("Photo details could not be saved.", 503);

  if (intent === "save") {
    revalidatePath(`/admin/projects/${projectId}/preview`);
    return NextResponse.json({
      ok: true,
      message: "Photo details saved.",
      caption,
      altText,
      updateId,
      sortOrder,
      visibility: photo.visibility,
    });
  }

  if (intent === "unpublish") {
    if (photo.public_storage_path) {
      const { error: removeError } = await client.storage.from(PROJECT_PUBLIC_BUCKET).remove([photo.public_storage_path]);
      if (removeError) return response("The public copy could not be removed. Nothing was changed.", 503);
    }
    const { error } = await client.from("project_photos").update({
      visibility: "private",
      public_storage_path: null,
      public_mime_type: null,
      public_byte_size: null,
      public_width: null,
      public_height: null,
      public_generated_at: null,
      published_at: null,
      updated_by: user.id,
    }).eq("id", photoId).eq("project_id", projectId);
    if (error) return response("Photo visibility could not be updated.", 503);
    revalidateProject(projectId, project.slug);
    return NextResponse.json({ ok: true, message: "Photo returned to private.", caption, altText, updateId, sortOrder, visibility: "private" });
  }

  if (project.publication_permission_status !== "granted" || project.publication_status !== "published") {
    return response("Publish the permission-cleared Build before publishing photography.", 409);
  }
  if (photo.upload_state !== "complete") {
    return response("The private upload is not ready for publication.", 409);
  }
  const { data: file, error: downloadError } = await client.storage
    .from(PROJECT_PRIVATE_BUCKET)
    .download(photo.private_storage_path);
  if (downloadError || !file || file.size !== photo.byte_size) {
    return response("Details were saved, but the private original could not be verified.", 503);
  }

  let derivative;
  try {
    derivative = await sanitizeProjectPhoto(Buffer.from(await file.arrayBuffer()));
  } catch {
    return response("Details were saved, but this image could not be prepared safely for publication.", 422);
  }

  const publicPath = generatedPublicPhotoPath(projectId, photo.id);
  const { error: uploadError } = await client.storage
    .from(PROJECT_PUBLIC_BUCKET)
    .upload(publicPath, derivative.buffer, {
      contentType: derivative.mimeType,
      cacheControl: "31536000",
      upsert: false,
    });
  if (uploadError) {
    return response("Details were saved, but the sanitized public copy could not be created.", 503);
  }

  const publishedAt = new Date().toISOString();
  const { error: publishError } = await client.from("project_photos").update({
    caption,
    alt_text: altText,
    update_id: updateId,
    sort_order: sortOrder,
    approval_status: "approved",
    publication_candidate: false,
    visibility: "public",
    public_storage_path: publicPath,
    public_mime_type: derivative.mimeType,
    public_byte_size: derivative.byteSize,
    public_width: derivative.width,
    public_height: derivative.height,
    public_generated_at: publishedAt,
    published_at: publishedAt,
    updated_by: user.id,
  }).eq("id", photoId).eq("project_id", projectId);
  if (publishError) {
    await client.storage.from(PROJECT_PUBLIC_BUCKET).remove([publicPath]);
    return response("Details were saved, but publication could not be completed.", 503);
  }

  if (photo.public_storage_path && photo.public_storage_path !== publicPath) {
    await client.storage.from(PROJECT_PUBLIC_BUCKET).remove([photo.public_storage_path]);
  }
  revalidateProject(projectId, project.slug);
  return NextResponse.json({
    ok: true,
    message: "Sanitized public copy published.",
    caption,
    altText,
    updateId,
    sortOrder,
    visibility: "public",
  });
}
