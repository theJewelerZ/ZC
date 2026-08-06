import { describe, expect, it } from "vitest";
import { buildCustomerConfirmation, buildFounderNotification } from "@/lib/consultations/notifications";
import type { Database } from "@/lib/supabase/database.types";

const consultation = {
  id: "12345678-1234-1234-1234-123456789012", created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(), completed_at: new Date().toISOString(), expires_at: null,
  submission_state: "complete", submission_token_hash: null, upload_manifest: [],
  name: "A <Golfer>", email: "golfer@example.com", phone: null, project_location: "Michigan",
  project_setting: "simulator-construction", space_type: null,
  review_preference: "guided-remote-review", room_width: null, room_depth: null,
  ceiling_height: null, handedness: null, simulator_system: null, desired_timeline: "planning",
  project_description: "A room with <careful> requirements.", referral_source: null,
  status: "new", internal_notes: null, privacy_consent_at: new Date().toISOString(),
  source: "website", source_project_id: null, notification_status: "pending", notification_error: null,
} satisfies Database["public"]["Tables"]["consultations"]["Row"];

describe("consultation emails", () => {
  it("includes dashboard link and photo count without attaching photos", () => {
    const message = buildFounderNotification(consultation, 3, "https://example.com/admin/consultations/id");
    expect(message.text).toContain("Photos: 3");
    expect(message.text).toContain("Secure dashboard");
    expect(message.html).not.toContain("<careful>");
  });
  it("confirms receipt without promising feasibility, price, or schedule", () => {
    const message = buildCustomerConfirmation(consultation);
    expect(message.text).toContain("received");
    expect(message.text).toContain("does not establish feasibility, price, schedule");
    expect(message.html).not.toContain("<Golfer>");
  });
});
