import { createHash, randomBytes, randomUUID } from "node:crypto";

export function createSubmissionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSubmissionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function createSafeStorageName(mimeType: string) {
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return `${randomUUID()}.${extension}`;
}
