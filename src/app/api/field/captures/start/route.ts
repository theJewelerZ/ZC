import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { FIELD_CAPTURE_EXPIRY_MS, FIELD_NOTE_MAX_LENGTH, FIELD_PHOTO_BATCH_MAX, canCaptureProject, isProjectStage, safeFieldNote } from "@/lib/field/schema";
import { generatedProjectPhotoPath } from "@/lib/projects/photo-storage";
import { PROJECT_PHOTO_MAX_BYTES, PROJECT_PHOTO_MIME_TYPES, PROJECT_PRIVATE_BUCKET, isUuid } from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FileDescriptor = { name?: unknown; type?: unknown; size?: unknown; caption?: unknown; candidate?: unknown };
const fail = (message: string, status = 422) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return fail("The capture request could not be accepted.", 403);
  const user = await getAdminUser(); if (!user) return fail("Your session expired. Sign in again.", 401);
  const body = await request.json().catch(() => null) as { projectId?: unknown; stage?: unknown; note?: unknown; clientSubmissionId?: unknown; files?: unknown } | null;
  if (!body || typeof body.projectId !== "string" || !isUuid(body.projectId) || typeof body.clientSubmissionId !== "string" || !isUuid(body.clientSubmissionId) || !isProjectStage(body.stage)) return fail("The capture details are invalid.");
  if (typeof body.note === "string" && body.note.trim().length > FIELD_NOTE_MAX_LENGTH) return fail(`Notes must be ${FIELD_NOTE_MAX_LENGTH} characters or fewer.`);
  const files = Array.isArray(body.files) ? body.files as FileDescriptor[] : [];
  if (files.length > FIELD_PHOTO_BATCH_MAX) return fail(`Choose no more than ${FIELD_PHOTO_BATCH_MAX} photos.`);
  const descriptors = files.map((file) => ({ name: typeof file.name === "string" ? file.name.slice(0, 255) : "photo", type: file.type, size: file.size, caption: typeof file.caption === "string" ? file.caption.trim().slice(0, 300) || null : null, candidate: file.candidate === true }));
  if (descriptors.some((file) => typeof file.size !== "number" || file.size <= 0 || file.size > PROJECT_PHOTO_MAX_BYTES || typeof file.type !== "string" || !PROJECT_PHOTO_MIME_TYPES.includes(file.type as never))) return fail("Each file must be a non-empty JPEG, PNG, or WebP no larger than 15 MB.");
  if (!descriptors.length && !safeFieldNote(body.note)) return fail("Add a note or at least one photo.");
  const client = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data: expiredSessions } = await client.from("field_capture_sessions").select("id").eq("session_state", "pending").lt("expires_at", now).limit(10);
  for (const expired of expiredSessions || []) {
    const { data: abandonedPhotos } = await client.from("project_photos").select("id,private_storage_path").eq("capture_session_id", expired.id).eq("upload_state", "pending");
    const abandonedPaths = (abandonedPhotos || []).map((photo) => photo.private_storage_path);
    if (abandonedPaths.length) await client.storage.from(PROJECT_PRIVATE_BUCKET).remove(abandonedPaths);
    await client.from("project_photos").update({ upload_state: "failed", upload_expires_at: null }).eq("capture_session_id", expired.id).eq("upload_state", "pending");
    await client.from("field_capture_sessions").update({ session_state: "failed", expires_at: null, failed_photo_count: abandonedPaths.length }).eq("id", expired.id).eq("session_state", "pending");
  }
  const { data: project } = await client.from("projects").select("id,operational_status").eq("id", body.projectId).maybeSingle();
  if (!project) return fail("That build no longer exists.", 404);
  if (!canCaptureProject(project.operational_status)) return fail("This build is not open for field capture.", 409);
  const { data: duplicate } = await client.from("field_capture_sessions").select("id,session_state").eq("client_submission_id", body.clientSubmissionId).maybeSingle();
  if (duplicate) return NextResponse.json({ ok: duplicate.session_state !== "failed", duplicate: true, sessionId: duplicate.id, state: duplicate.session_state }, { status: duplicate.session_state === "failed" ? 409 : 200 });
  const sessionId = randomUUID(); const expiresAt = new Date(Date.now() + FIELD_CAPTURE_EXPIRY_MS).toISOString();
  const { error: sessionError } = await client.from("field_capture_sessions").insert({ id: sessionId, project_id: body.projectId, client_submission_id: body.clientSubmissionId, project_stage: body.stage, field_note: safeFieldNote(body.note), expected_photo_count: descriptors.length, expires_at: expiresAt, captured_by: user.id });
  if (sessionError) return fail("The capture session could not be created. Try again.", 503);
  const uploads: Array<{ photoId: string; path: string; token: string }> = [];
  for (let index = 0; index < descriptors.length; index += 1) {
    const file = descriptors[index]; const photoId = randomUUID(); const path = generatedProjectPhotoPath(body.projectId, photoId, file.type as "image/jpeg" | "image/png" | "image/webp");
    const { error: photoError } = await client.from("project_photos").insert({ id: photoId, project_id: body.projectId, capture_session_id: sessionId, private_storage_path: path, original_filename: file.name, mime_type: file.type as "image/jpeg" | "image/png" | "image/webp", byte_size: file.size as number, caption: file.caption, publication_candidate: file.candidate, upload_expires_at: expiresAt, sort_order: index, created_by: user.id, updated_by: user.id });
    if (photoError) { await client.from("field_capture_sessions").update({ session_state: "failed" }).eq("id", sessionId); return fail("Photo authorization failed. Nothing was published.", 503); }
    const { data, error } = await client.storage.from(PROJECT_PRIVATE_BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error || !data) { await client.from("project_photos").update({ upload_state: "failed", upload_expires_at: null }).eq("id", photoId); return fail("Photo authorization failed. Try again.", 503); }
    uploads.push({ photoId, path, token: data.token });
  }
  return NextResponse.json({ ok: true, sessionId, uploads });
}