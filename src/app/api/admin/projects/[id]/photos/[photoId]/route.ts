import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getAdminUser } from "@/lib/admin/auth";
import {
  PROJECT_PRIVATE_BUCKET,
  PROJECT_PUBLIC_BUCKET,
  isUuid,
} from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PhotoIntent = "save" | "publish" | "unpublish";

function response(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
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
  } | null;
  const intent = body?.intent;
  const caption = String(body?.caption || "").trim().slice(0, 300);
  const altText = String(body?.altText || "").trim().slice(0, 300);
  if (!intent || !["save", "publish", "unpublish"].includes(intent)) {
    return response("The photo request is invalid.", 400);
  }

  const client = createSupabaseAdminClient();
  const { data: photo, error: photoError } = await client
    .from("project_photos")
    .select("*")
    .eq("id", photoId)
    .eq("project_id", projectId)
    .single();
  if (photoError || !photo) return response("The photo could not be found.", 404);

  if ((intent === "publish" || photo.visibility === "public") && (!caption || !altText)) {
    return response("Add both a caption and alt text before publishing this photo.", 422);
  }

  const { error: detailsError } = await client
    .from("project_photos")
    .update({ caption: caption || null, alt_text: altText || null, updated_by: user.id })
    .eq("id", photoId)
    .eq("project_id", projectId);
  if (detailsError) return response("Photo details could not be saved.", 503);

  if (intent === "save") {
    return NextResponse.json({ ok: true, message: "Photo details saved.", caption, altText, visibility: photo.visibility });
  }

  if (intent === "unpublish") {
    if (photo.public_storage_path) {
      await client.storage.from(PROJECT_PUBLIC_BUCKET).remove([photo.public_storage_path]);
    }
    const { error } = await client.from("project_photos").update({
      visibility: "private",
      public_storage_path: null,
      published_at: null,
      updated_by: user.id,
    }).eq("id", photoId).eq("project_id", projectId);
    if (error) return response("Photo visibility could not be updated.", 503);
    revalidatePath("/projects");
    revalidatePath("/");
    return NextResponse.json({ ok: true, message: "Photo returned to private.", caption, altText, visibility: "private" });
  }

  if (photo.upload_state !== "complete") {
    return response("The private upload is not ready for publication.", 409);
  }
  const { data: file, error: downloadError } = await client.storage
    .from(PROJECT_PRIVATE_BUCKET)
    .download(photo.private_storage_path);
  if (downloadError || !file) {
    return response("Details were saved, but the private original could not be read.", 503);
  }

  const publicPath = "projects/" + projectId + "/" + photo.id + "." + photo.mime_type.split("/")[1];
  const { error: uploadError } = await client.storage
    .from(PROJECT_PUBLIC_BUCKET)
    .upload(publicPath, file, { contentType: photo.mime_type, upsert: true });
  if (uploadError) {
    return response("Details were saved, but the approved public copy could not be created.", 503);
  }

  const { error: publishError } = await client.from("project_photos").update({
    caption,
    alt_text: altText,
    approval_status: "approved",
    visibility: "public",
    public_storage_path: publicPath,
    published_at: new Date().toISOString(),
    updated_by: user.id,
  }).eq("id", photoId).eq("project_id", projectId);
  if (publishError) {
    await client.storage.from(PROJECT_PUBLIC_BUCKET).remove([publicPath]);
    return response("Details were saved, but publication could not be completed.", 503);
  }

  revalidatePath("/projects");
  revalidatePath("/");
  return NextResponse.json({ ok: true, message: "Photo approved and published.", caption, altText, visibility: "public" });
}
