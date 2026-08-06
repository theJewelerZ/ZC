import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { PROJECT_PRIVATE_BUCKET, isUuid } from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ ok: false, message: "The retry request could not be accepted." }, { status: 403 });
  if (!await getAdminUser()) return NextResponse.json({ ok: false, message: "Your session expired. Sign in again." }, { status: 401 });
  const body = await request.json().catch(() => null) as { sessionId?: unknown; photoId?: unknown } | null;
  if (!body || typeof body.sessionId !== "string" || typeof body.photoId !== "string" || !isUuid(body.sessionId) || !isUuid(body.photoId)) return NextResponse.json({ ok: false, message: "The retry request is invalid." }, { status: 422 });
  const client = createSupabaseAdminClient();
  const { data: photo } = await client.from("project_photos").select("id,private_storage_path,upload_state,capture_session_id").eq("id", body.photoId).eq("capture_session_id", body.sessionId).maybeSingle();
  if (!photo || photo.upload_state === "complete") return NextResponse.json({ ok: false, message: "That photo is not available for retry." }, { status: 409 });
  const { data: session } = await client.from("field_capture_sessions").select("session_state").eq("id", body.sessionId).maybeSingle();
  if (!session || !["pending", "partial", "failed"].includes(session.session_state)) return NextResponse.json({ ok: false, message: "That capture session is closed." }, { status: 409 });
  const { data, error } = await client.storage.from(PROJECT_PRIVATE_BUCKET).createSignedUploadUrl(photo.private_storage_path, { upsert: true });
  if (error || !data) return NextResponse.json({ ok: false, message: "A new upload authorization could not be issued." }, { status: 503 });
  await client.from("project_photos").update({ upload_state: "pending", upload_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() }).eq("id", photo.id);
  await client.from("field_capture_sessions").update({ session_state: "pending", completed_at: null, expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() }).eq("id", body.sessionId);
  return NextResponse.json({ ok: true, path: photo.private_storage_path, token: data.token });
}