import { describe, expect, it } from "vitest";
import { hasSupportedImageSignature, MAX_PHOTO_BYTES, validateConsultationStartPayload, validatePhotoDescriptors } from "@/lib/consultations/schema";

const valid = {
  name: "Test Customer", email: "customer@example.com", phone: "", location: "Michigan",
  service: "simulator-construction", consultationPreference: "guided-remote-review",
  timeline: "planning", description: "A serious simulator room consultation with enough detail.",
  referralSource: "", website: "", startedAt: String(Date.now() - 5000), turnstileToken: "",
  spaceType: "Existing room", roomWidth: "16 feet", roomDepth: "20 feet",
  ceilingHeight: "10 feet", handedness: "Both", simulatorSystem: "", privacyConsent: true,
  photos: [],
};

describe("consultation validation", () => {
  it("accepts a valid no-photo consultation", () => {
    expect(validateConsultationStartPayload(valid)).toMatchObject({ success: true, data: { photos: [] } });
  });
  it("accepts valid photo descriptors and normalizes unsafe filename paths", () => {
    const result = validateConsultationStartPayload({ ...valid, photos: [{ clientId: "one", originalFilename: "../../room.jpg", mimeType: "image/jpeg", byteSize: 100, caption: "Screen wall" }] });
    expect(result).toMatchObject({ success: true, data: { photos: [{ originalFilename: "room.jpg" }] } });
  });
  it("rejects invalid fields and missing privacy consent", () => {
    const invalidEmail = validateConsultationStartPayload({ ...valid, email: "bad" });
    const missingConsent = validateConsultationStartPayload({ ...valid, privacyConsent: false });
    expect(invalidEmail).toMatchObject({ success: false, errors: { email: expect.any(String) } });
    expect(missingConsent).toMatchObject({ success: false, errors: { privacyConsent: expect.any(String) } });
  });
  it("rejects too many, unsupported, zero-byte, oversized, and combined-oversized photos", () => {
    expect(validatePhotoDescriptors(Array.from({ length: 11 }, (_, i) => ({ clientId: String(i), originalFilename: "a.jpg", mimeType: "image/jpeg", byteSize: 1, caption: "" })))).toHaveProperty("error");
    expect(validatePhotoDescriptors([{ clientId: "1", originalFilename: "a.pdf", mimeType: "application/pdf", byteSize: 1, caption: "" }])).toHaveProperty("error");
    expect(validatePhotoDescriptors([{ clientId: "1", originalFilename: "a.jpg", mimeType: "image/jpeg", byteSize: 0, caption: "" }])).toHaveProperty("error");
    expect(validatePhotoDescriptors([{ clientId: "1", originalFilename: "a.jpg", mimeType: "image/jpeg", byteSize: MAX_PHOTO_BYTES + 1, caption: "" }])).toHaveProperty("error");
    expect(validatePhotoDescriptors(Array.from({ length: 6 }, (_, i) => ({ clientId: String(i), originalFilename: "a.jpg", mimeType: "image/jpeg", byteSize: 13 * 1024 * 1024, caption: "" })))).toHaveProperty("error");
  });
  it("recognizes JPEG, PNG, and WebP signatures and rejects malformed bytes", () => {
    expect(hasSupportedImageSignature(new Uint8Array([0xff,0xd8,0xff]), "image/jpeg")).toBe(true);
    expect(hasSupportedImageSignature(new Uint8Array([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]), "image/png")).toBe(true);
    expect(hasSupportedImageSignature(new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80]), "image/webp")).toBe(true);
    expect(hasSupportedImageSignature(new Uint8Array([0,1,2,3]), "image/jpeg")).toBe(false);
  });
});
