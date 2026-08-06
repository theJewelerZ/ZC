import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupportedImageSignature, type SupportedPhotoType } from "@/lib/consultations/schema";
import { PROJECT_PRIVATE_BUCKET } from "@/lib/projects/schema";
import type { Database, ProjectPhotoRow } from "@/lib/supabase/database.types";

export function generatedProjectPhotoPath(projectId: string, photoId: string, mimeType: SupportedPhotoType) {
  const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];
  return `projects/${projectId}/${photoId || randomUUID()}.${extension}`;
}

export async function verifyPrivateProjectPhoto(client: SupabaseClient<Database>, photo: ProjectPhotoRow) {
  const { data: file, error } = await client.storage.from(PROJECT_PRIVATE_BUCKET).download(photo.private_storage_path);
  if (error || !file || file.size !== photo.byte_size) return false;
  const signature = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  return hasSupportedImageSignature(signature, photo.mime_type as SupportedPhotoType);
}

export async function removePrivateProjectPhoto(client: SupabaseClient<Database>, path: string) {
  await client.storage.from(PROJECT_PRIVATE_BUCKET).remove([path]);
}