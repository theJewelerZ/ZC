import { randomUUID } from "node:crypto";
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/lib/supabase/database.types";
import { PHOTO_BUCKET, PENDING_EXPIRATION_MS, type ConsultationStartPayload, type PhotoDescriptor } from "@/lib/consultations/schema";
import { createSafeStorageName, createSubmissionToken, hashSubmissionToken } from "@/lib/consultations/security";

export type UploadAuthorization = PhotoDescriptor & {
  path: string;
  token: string;
};

type AdminClient = SupabaseClient<Database>;

export async function cleanupExpiredConsultations(client: AdminClient, now = new Date()) {
  const { data, error } = await client
    .from("consultations")
    .select("id")
    .eq("submission_state", "pending")
    .lt("expires_at", now.toISOString())
    .limit(25);
  if (error) throw error;

  for (const item of data || []) {
    const folder = `consultations/${item.id}`;
    const { data: objects } = await client.storage.from(PHOTO_BUCKET).list(folder, { limit: 100 });
    if (objects?.length) {
      await client.storage.from(PHOTO_BUCKET).remove(objects.map((object) => `${folder}/${object.name}`));
    }
    await client.from("consultations").delete().eq("id", item.id).eq("submission_state", "pending");
  }
}

export async function createPendingConsultation(client: AdminClient, payload: ConsultationStartPayload) {
  const id = randomUUID();
  const submissionToken = createSubmissionToken();
  const uploadManifest = payload.photos.map((photo, sortOrder) => ({
    ...photo,
    sortOrder,
    path: `consultations/${id}/${createSafeStorageName(photo.mimeType)}`,
  }));
  const expiresAt = new Date(Date.now() + PENDING_EXPIRATION_MS).toISOString();

  const { error } = await client.from("consultations").insert({
    id,
    expires_at: expiresAt,
    submission_state: "pending",
    submission_token_hash: hashSubmissionToken(submissionToken),
    upload_manifest: uploadManifest as unknown as Json,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    project_location: payload.location,
    project_setting: payload.service,
    space_type: payload.spaceType || null,
    review_preference: payload.consultationPreference,
    room_width: payload.roomWidth || null,
    room_depth: payload.roomDepth || null,
    ceiling_height: payload.ceilingHeight || null,
    handedness: payload.handedness || null,
    simulator_system: payload.simulatorSystem || null,
    desired_timeline: payload.timeline || null,
    project_description: payload.description,
    referral_source: payload.referralSource || null,
    privacy_consent_at: new Date().toISOString(),
    source: "website",
  });
  if (error) throw error;

  const uploads: UploadAuthorization[] = [];
  try {
    for (const manifest of uploadManifest) {
      const { data, error: uploadError } = await client.storage
        .from(PHOTO_BUCKET)
        .createSignedUploadUrl(manifest.path, { upsert: false });
      if (uploadError) throw uploadError;
      uploads.push({
        clientId: manifest.clientId,
        originalFilename: manifest.originalFilename,
        mimeType: manifest.mimeType,
        byteSize: manifest.byteSize,
        caption: manifest.caption,
        path: manifest.path,
        token: data.token,
      });
    }
  } catch (error) {
    await client.from("consultations").delete().eq("id", id).eq("submission_state", "pending");
    throw error;
  }
  return { consultationId: id, submissionToken, expiresAt, uploads };
}

export async function cancelPendingConsultation(client: AdminClient, id: string, token: string) {
  const { data } = await client.from("consultations").select("submission_token_hash").eq("id", id).eq("submission_state", "pending").maybeSingle();
  if (!data || data.submission_token_hash !== hashSubmissionToken(token)) return false;
  const folder = `consultations/${id}`;
  const { data: objects } = await client.storage.from(PHOTO_BUCKET).list(folder, { limit: 100 });
  if (objects?.length) await client.storage.from(PHOTO_BUCKET).remove(objects.map((object) => `${folder}/${object.name}`));
  await client.from("consultations").delete().eq("id", id).eq("submission_state", "pending");
  return true;
}
