import { validateContactPayload, type ContactField, type ContactPayload } from "@/lib/contact/schema";

export const PHOTO_BUCKET = "consultation-photos";
export const MAX_PHOTO_COUNT = 10;
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export const MAX_TOTAL_PHOTO_BYTES = 75 * 1024 * 1024;
export const PENDING_EXPIRATION_MS = 24 * 60 * 60 * 1000;
export const SIGNED_PHOTO_SECONDS = 300;
export const supportedPhotoTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export type SupportedPhotoType = (typeof supportedPhotoTypes)[number];

export type PhotoDescriptor = {
  clientId: string;
  originalFilename: string;
  mimeType: SupportedPhotoType;
  byteSize: number;
  caption: string;
};

export type ConsultationPayload = ContactPayload & {
  spaceType: string;
  roomWidth: string;
  roomDepth: string;
  ceilingHeight: string;
  handedness: string;
  simulatorSystem: string;
  privacyConsent: boolean;
};

export type ConsultationStartPayload = ConsultationPayload & {
  photos: PhotoDescriptor[];
};

export type ConsultationField =
  | ContactField
  | "spaceType"
  | "roomWidth"
  | "roomDepth"
  | "ceilingHeight"
  | "handedness"
  | "simulatorSystem"
  | "privacyConsent"
  | "photos";

type ConsultationValidation =
  | { success: true; data: ConsultationStartPayload }
  | { success: false; errors: Partial<Record<ConsultationField | "form", string>>; abuseDetected?: boolean };

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown, maximum: number) {
  const normalized = text(value);
  return normalized.length <= maximum ? normalized : null;
}

export function sanitizeOriginalFilename(value: string) {
  const base = value.replaceAll("\\", "/").split("/").pop() || "room-photo";
  return base.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 255) || "room-photo";
}

export function validatePhotoDescriptors(input: unknown) {
  if (!Array.isArray(input)) return { error: "Photo information could not be read." };
  if (input.length > MAX_PHOTO_COUNT) return { error: `Choose no more than ${MAX_PHOTO_COUNT} photos.` };

  const seen = new Set<string>();
  let total = 0;
  const photos: PhotoDescriptor[] = [];

  for (const [index, raw] of input.entries()) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return { error: `Photo ${index + 1} could not be read.` };
    }
    const item = raw as Record<string, unknown>;
    const clientId = text(item.clientId);
    const originalFilename = sanitizeOriginalFilename(text(item.originalFilename));
    const mimeType = text(item.mimeType);
    const byteSize = Number(item.byteSize);
    const caption = text(item.caption);

    if (!clientId || clientId.length > 100 || seen.has(clientId)) {
      return { error: "Each selected photo must have a unique identifier." };
    }
    if (!supportedPhotoTypes.includes(mimeType as SupportedPhotoType)) {
      return { error: `${originalFilename} is not a supported JPEG, PNG, or WebP image.` };
    }
    if (!Number.isSafeInteger(byteSize) || byteSize <= 0 || byteSize > MAX_PHOTO_BYTES) {
      return { error: `${originalFilename} must be larger than zero and no more than 15 MB.` };
    }
    if (caption.length > 240) return { error: `Keep the caption for ${originalFilename} under 240 characters.` };

    seen.add(clientId);
    total += byteSize;
    photos.push({ clientId, originalFilename, mimeType: mimeType as SupportedPhotoType, byteSize, caption });
  }

  if (total > MAX_TOTAL_PHOTO_BYTES) return { error: "The selected photos exceed the 75 MB combined limit." };
  return { photos };
}

export function validateConsultationStartPayload(input: unknown, now = Date.now()): ConsultationValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { form: "The submitted request could not be read." } };
  }
  const raw = input as Record<string, unknown>;
  const base = validateContactPayload({
    name: raw.name, email: raw.email, phone: raw.phone, location: raw.location,
    service: raw.service, consultationPreference: raw.consultationPreference,
    timeline: raw.timeline, description: raw.description,
    referralSource: raw.referralSource, website: raw.website,
    startedAt: raw.startedAt, turnstileToken: raw.turnstileToken,
  }, now);
  if (!base.success) return base;

  const errors: Partial<Record<ConsultationField | "form", string>> = {};
  const optional = {
    spaceType: optionalText(raw.spaceType, 80),
    roomWidth: optionalText(raw.roomWidth, 40),
    roomDepth: optionalText(raw.roomDepth, 40),
    ceilingHeight: optionalText(raw.ceilingHeight, 40),
    handedness: optionalText(raw.handedness, 80),
    simulatorSystem: optionalText(raw.simulatorSystem, 120),
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value === null) errors[key as keyof typeof optional] = "Keep this response within the stated limit.";
  }
  if (raw.privacyConsent !== true) errors.privacyConsent = "Confirm that Zarka Construction may use these details to review and respond.";
  const photoValidation = validatePhotoDescriptors(raw.photos ?? []);
  if ("error" in photoValidation) errors.photos = photoValidation.error;
  if (Object.keys(errors).length) return { success: false, errors };

  return {
    success: true,
    data: {
      ...base.data,
      spaceType: optional.spaceType || "",
      roomWidth: optional.roomWidth || "",
      roomDepth: optional.roomDepth || "",
      ceilingHeight: optional.ceilingHeight || "",
      handedness: optional.handedness || "",
      simulatorSystem: optional.simulatorSystem || "",
      privacyConsent: true,
      photos: photoValidation.photos || [],
    },
  };
}

export function hasSupportedImageSignature(bytes: Uint8Array, mimeType: SupportedPhotoType) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((v,i) => bytes[i] === v);
  return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
}
