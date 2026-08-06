import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  PUBLIC_IMAGE_MAX_EDGE,
  generatedPublicPhotoPath,
  sanitizeProjectPhoto,
} from "@/lib/projects/public-image";

describe("public project-image derivatives", () => {
  it("creates an immutable JPEG path", () => {
    const first = generatedPublicPhotoPath("project", "photo");
    const second = generatedPublicPhotoPath("project", "photo");
    expect(first).toMatch(/^projects\/project\/photo\/[0-9a-f-]+\.jpg$/);
    expect(second).not.toBe(first);
  });

  it("auto-orients, bounds, and strips source metadata", async () => {
    const source = await sharp({
      create: { width: 3000, height: 1800, channels: 3, background: "#0B1F33" },
    }).withMetadata({ orientation: 6 }).jpeg().toBuffer();
    const result = await sanitizeProjectPhoto(source);
    const metadata = await sharp(result.buffer).metadata();

    expect(result.mimeType).toBe("image/jpeg");
    expect(Math.max(result.width, result.height)).toBe(PUBLIC_IMAGE_MAX_EDGE);
    expect(metadata.orientation).toBeUndefined();
    expect(metadata.exif).toBeUndefined();
    expect(metadata.xmp).toBeUndefined();
  });
});
