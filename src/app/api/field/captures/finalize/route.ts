import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { verifyPrivateProjectPhoto, removePrivateProjectPhoto } from "@/lib/projects/photo-storage";
import { isUuid } from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const fail = (message: string, status = 422) => NextResponse.json({ ok: false, message }, { status });
export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return fail("The capture request could not be accepted.", 403);
  const user = await getAdminUser(); if (!user) return fail("Your session expired. Sign in again.", 401);
  const body = await request.json().catch(() => null) as { sessionId?: unknown } | null;
  if (!body || typeof body.sessionId !== "string" || !isUuid(body.sessionId)) return fail("The capture session is invalid.");
  const client = createSupabaseAdminClient();
  const { data: session } = await client.from("field_capture_sessions").select("*").eq("id", body.sessionId).maybeSingle();
  if (!session) return fail("The capture session was not found.", 404);
  if (session.session_state !== "pending") return NextResponse.json({ ok: session.session_state !== "failed", duplicate: true, state: session.session_state });
  const { data: project } = await client.from("projects").select("id,operational_status").eq("id", session.project_id).maybeSingle();
  if (!project || ["cancelled", "archived"].includes(project.operational_status)) return fail("This build is no longer open for field capture.", 409);
  const { data: photos } = await client.from("project_photos").select("*").eq("capture_session_id", session.id).order("sort_order");
  const completed: string[] = []; const failed: string[] = [];
  for (const photo of photos || []) {
    if (photo.upload_state === "complete") { completed.push(photo.id); continue; }
    const valid = await verifyPrivateProjectPhoto(client, photo);
    if (valid) {
      await client.from("project_photos").update({ upload_state: "complete", upload_expires_at: null, updated_by: user.id }).eq("id", photo.id).eq("capture_session_id", session.id);
      completed.push(photo.id);
    } else {
      await removePrivateProjectPhoto(client, photo.private_storage_path);
      await client.from("project_photos").update({ upload_state: "failed", upload_expires_at: null, updated_by: user.id }).eq("id", photo.id).eq("capture_session_id", session.id);
      failed.push(photo.id);
    }
  }
  const hasDurableContent = completed.length > 0 || Boolean(session.field_note);
  const state = !hasDurableContent ? "failed" : failed.length ? "partial" : "complete";
  const now = new Date().toISOString();
  await client.from("field_capture_sessions").update({ session_state: state, completed_at: hasDurableContent ? now : null, expires_at: null, completed_photo_count: completed.length, failed_photo_count: failed.length }).eq("id", session.id);
  if (hasDurableContent) await client.from("projects").update({ project_stage: session.project_stage, updated_by: user.id }).eq("id", session.project_id);
  if (!hasDurableContent) return fail("No photos were stored. Your selections remain on this page so you can retry.", 503);
  return NextResponse.json({ ok: true, state, completedPhotoIds: completed, failedPhotoIds: failed, message: failed.length ? `${completed.length} photo${completed.length === 1 ? "" : "s"} saved; ${failed.length} need retry.` : "Field progress saved privately." });
}