import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";

export const PUBLIC_IMAGE_MAX_PIXELS = 60_000_000;
export const PUBLIC_IMAGE_MAX_EDGE = 2400;
export const PUBLIC_IMAGE_MIME_TYPE = "image/jpeg" as const;

export type SanitizedPublicImage = {
  buffer: Buffer;
  byteSize: number;
  width: number;
  height: number;
  mimeType: typeof PUBLIC_IMAGE_MIME_TYPE;
};

export function generatedPublicPhotoPath(projectId: string, photoId: string) {
  return `projects/${projectId}/${photoId}/${randomUUID()}.jpg`;
}

export async function sanitizeProjectPhoto(input: Buffer): Promise<SanitizedPublicImage> {
  const pipeline = sharp(input, {
    failOn: "error",
    limitInputPixels: PUBLIC_IMAGE_MAX_PIXELS,
    sequentialRead: true,
  })
    .rotate()
    .flatten({ background: "#F7F9FB" })
    .toColorspace("srgb")
    .resize({
      width: PUBLIC_IMAGE_MAX_EDGE,
      height: PUBLIC_IMAGE_MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 86, progressive: true, chromaSubsampling: "4:2:0" });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  if (!info.width || !info.height || !data.length) {
    throw new Error("The public image derivative could not be verified.");
  }

  return {
    buffer: data,
    byteSize: data.length,
    width: info.width,
    height: info.height,
    mimeType: PUBLIC_IMAGE_MIME_TYPE,
  };
}
