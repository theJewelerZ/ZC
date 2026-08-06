import { randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error("Usage: node scripts/reprocess-project-media.mjs <published-build-slug>");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server configuration is unavailable.");

const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: project, error: projectError } = await client
  .from("projects")
  .select("id,slug,publication_status,publication_permission_status")
  .eq("slug", slug)
  .single();
if (projectError || !project) throw projectError || new Error("Build not found.");
if (project.publication_status !== "published" || project.publication_permission_status !== "granted") {
  throw new Error("The Build must be published and permission-cleared before media is reprocessed.");
}

const { data: photos, error: photoError } = await client
  .from("project_photos")
  .select("id,private_storage_path,public_storage_path,byte_size,caption,alt_text,upload_state")
  .eq("project_id", project.id)
  .eq("upload_state", "complete")
  .order("created_at");
if (photoError) throw photoError;

let published = 0;
for (const photo of photos || []) {
  if (!photo.caption?.trim() || !photo.alt_text?.trim()) {
    throw new Error(`Photo ${photo.id} requires caption and alt text before publication.`);
  }
  const { data: source, error: downloadError } = await client.storage
    .from("project-media-private")
    .download(photo.private_storage_path);
  if (downloadError || !source || source.size !== photo.byte_size) {
    throw new Error(`Private original verification failed for ${photo.id}.`);
  }

  const { data: derivative, info } = await sharp(Buffer.from(await source.arrayBuffer()), {
    failOn: "error",
    limitInputPixels: 60_000_000,
    sequentialRead: true,
  })
    .rotate()
    .flatten({ background: "#F7F9FB" })
    .toColorspace("srgb")
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, progressive: true, chromaSubsampling: "4:2:0" })
    .toBuffer({ resolveWithObject: true });
  if (!info.width || !info.height || !derivative.length) {
    throw new Error(`Sanitized derivative verification failed for ${photo.id}.`);
  }

  const publicPath = `projects/${project.id}/${photo.id}/${randomUUID()}.jpg`;
  const { error: uploadError } = await client.storage.from("project-media-public").upload(publicPath, derivative, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const generatedAt = new Date().toISOString();
  const { error: updateError } = await client.from("project_photos").update({
    approval_status: "approved",
    publication_candidate: false,
    visibility: "public",
    public_storage_path: publicPath,
    public_mime_type: "image/jpeg",
    public_byte_size: derivative.length,
    public_width: info.width,
    public_height: info.height,
    public_generated_at: generatedAt,
    published_at: generatedAt,
  }).eq("id", photo.id).eq("project_id", project.id);
  if (updateError) {
    await client.storage.from("project-media-public").remove([publicPath]);
    throw updateError;
  }
  if (photo.public_storage_path && photo.public_storage_path !== publicPath) {
    await client.storage.from("project-media-public").remove([photo.public_storage_path]);
  }
  published += 1;
}

console.log(JSON.stringify({ slug: project.slug, sanitized_public_derivatives: published }));
