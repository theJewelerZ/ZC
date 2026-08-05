import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { consultationError, logConsultationEvent, readJsonRequest } from "@/lib/consultations/http";
import { sendConsultationNotifications } from "@/lib/consultations/notifications";
import { hasSupportedImageSignature, MAX_PHOTO_BYTES, PHOTO_BUCKET, supportedPhotoTypes, type SupportedPhotoType } from "@/lib/consultations/schema";
import { hashSubmissionToken } from "@/lib/consultations/security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

type ManifestItem = {
  clientId: string;
  originalFilename: string;
  mimeType: SupportedPhotoType;
  byteSize: number;
  caption: string;
  sortOrder: number;
  path: string;
};

async function inspectSignature(signedUrl: string, mimeType: SupportedPhotoType) {
  const response = await fetch(signedUrl, {
    headers: { Range: "bytes=0-31" },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return false;
  const bytes = new Uint8Array(await response.arrayBuffer());
  return hasSupportedImageSignature(bytes, mimeType);
}

export async function POST(request: NextRequest) {
  const correlationId = randomUUID();
  const parsed = await readJsonRequest(request, correlationId, 32_768);
  if ("response" in parsed) return parsed.response;
  if (!parsed.body || typeof parsed.body !== "object" || Array.isArray(parsed.body)) {
    return consultationError("The consultation could not be finalized.", 400, correlationId);
  }

  const raw = parsed.body as Record<string, unknown>;
  const consultationId = typeof raw.consultationId === "string" ? raw.consultationId : "";
  const submissionToken = typeof raw.submissionToken === "string" ? raw.submissionToken : "";
  const captions = raw.captions && typeof raw.captions === "object" && !Array.isArray(raw.captions)
    ? raw.captions as Record<string, unknown> : {};
  if (!/^[0-9a-f-]{36}$/i.test(consultationId) || submissionToken.length < 32) {
    return consultationError("The consultation upload session is invalid or expired.", 400, correlationId);
  }

  const client = createSupabaseAdminClient();
  const { data: consultation, error } = await client
    .from("consultations")
    .select("*")
    .eq("id", consultationId)
    .eq("submission_state", "pending")
    .maybeSingle();

  if (error || !consultation || consultation.expires_at === null || new Date(consultation.expires_at) <= new Date()
    || consultation.submission_token_hash !== hashSubmissionToken(submissionToken)) {
    logConsultationEvent("consultation_finalize_unauthorized", correlationId);
    return consultationError("The consultation upload session is invalid or expired.", 409, correlationId);
  }

  const manifest = Array.isArray(consultation.upload_manifest)
    ? consultation.upload_manifest as unknown as ManifestItem[] : [];
  const folder = `consultations/${consultationId}`;
  const { data: stored, error: listError } = await client.storage.from(PHOTO_BUCKET).list(folder, { limit: 100 });
  if (listError) return consultationError("The uploaded photos could not be verified. Please retry.", 503, correlationId);

  const storedByName = new Map((stored || []).map((item) => [item.name, item]));
  const photoRows: Record<string, string | number | null>[] = [];

  for (const item of manifest) {
    const name = item.path.split("/").pop() || "";
    const object = storedByName.get(name);
    const metadata = object?.metadata as { size?: number; mimetype?: string } | undefined;
    const actualSize = Number(metadata?.size ?? 0);
    const actualType = String(metadata?.mimetype ?? "");
    const captionValue = typeof captions[item.clientId] === "string" ? String(captions[item.clientId]).trim() : item.caption;
    if (!object || actualSize <= 0 || actualSize > MAX_PHOTO_BYTES || actualSize !== item.byteSize
      || actualType !== item.mimeType || !supportedPhotoTypes.includes(actualType as SupportedPhotoType)
      || captionValue.length > 240) {
      logConsultationEvent("consultation_photo_verification_failed", correlationId);
      return consultationError("One or more photos could not be verified. Remove the affected photo or retry the upload.", 422, correlationId);
    }
    const { data: signed, error: signError } = await client.storage.from(PHOTO_BUCKET).createSignedUrl(item.path, 60);
    if (signError || !signed?.signedUrl || !(await inspectSignature(signed.signedUrl, item.mimeType))) {
      logConsultationEvent("consultation_photo_signature_failed", correlationId);
      return consultationError("One or more files are not valid supported images.", 422, correlationId);
    }
    photoRows.push({
      storage_path: item.path,
      original_filename: item.originalFilename,
      mime_type: item.mimeType,
      byte_size: actualSize,
      caption: captionValue || null,
      sort_order: item.sortOrder,
    });
  }

  const { data: finalized, error: finalizeError } = await client.rpc("finalize_consultation", {
    target_consultation_id: consultationId,
    expected_token_hash: hashSubmissionToken(submissionToken),
    photo_rows: photoRows as unknown as Json,
  });
  if (finalizeError || !finalized) {
    logConsultationEvent("consultation_finalize_failed", correlationId, { errorClass: finalizeError ? "DatabaseError" : "StateConflict" });
    return consultationError("Your consultation could not be finalized. Please retry.", 503, correlationId);
  }

  const completed = {
    ...consultation,
    submission_state: "complete" as const,
    submission_token_hash: null,
    upload_manifest: [] as Json[],
    expires_at: null,
    completed_at: new Date().toISOString(),
    notification_status: "pending" as const,
  };
  const notification = await sendConsultationNotifications(completed, photoRows.length);
  await client.from("consultations").update({
    notification_status: notification.status,
    notification_error: notification.error,
  }).eq("id", consultationId);

  logConsultationEvent("consultation_completed", correlationId, {
    photoCount: photoRows.length,
    notificationStatus: notification.status,
  });

  return NextResponse.json({
    ok: true,
    stored: true,
    notificationStatus: notification.status,
    message: notification.status === "sent"
      ? "Your consultation was received. Zarka Construction will review the details and follow up."
      : "Your consultation was saved. Email confirmation may be delayed, but Zarka Construction can review your request.",
    correlationId: consultationId,
  });
}
