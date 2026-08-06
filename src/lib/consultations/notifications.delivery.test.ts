import { afterEach, describe, expect, it, vi } from "vitest";
import { sendConsultationNotifications } from "@/lib/consultations/notifications";
import type { Database } from "@/lib/supabase/database.types";

const consultation = {
  id: "12345678-1234-1234-1234-123456789012", created_at: "", updated_at: "",
  completed_at: "", expires_at: null, submission_state: "complete",
  submission_token_hash: null, upload_manifest: [], name: "Customer",
  email: "customer@example.com", phone: null, project_location: "Michigan",
  project_setting: "simulator-construction", space_type: null,
  review_preference: "guided-remote-review", room_width: null, room_depth: null,
  ceiling_height: null, handedness: null, simulator_system: null,
  desired_timeline: null, project_description: "A complete description for this simulator room.",
  referral_source: null, status: "new", internal_notes: null, privacy_consent_at: "",
  source: "website", source_project_id: null, notification_status: "pending", notification_error: null,
} satisfies Database["public"]["Tables"]["consultations"]["Row"];

describe("notification failure semantics", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
  it("returns failed without attempting delivery when configuration is absent", async () => {
    expect(await sendConsultationNotifications(consultation, 0)).toMatchObject({ status: "failed" });
  });
  it("records a partial outcome when founder email succeeds and customer email fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "secret");
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "founder@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.com");
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "one" }), { status: 200 }))
      .mockResolvedValueOnce(new Response("bounce", { status: 422 }));
    expect(await sendConsultationNotifications(consultation, 2)).toMatchObject({
      status: "partial", error: expect.stringContaining("Customer confirmation failed"),
    });
  });
});
