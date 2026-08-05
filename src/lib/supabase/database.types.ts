export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined } | Json[];

export type ConsultationStatus =
  | "new" | "reviewing" | "contacted" | "site_visit"
  | "proposal" | "won" | "lost" | "archived";

type ConsultationRow = {
  id: string; created_at: string; updated_at: string;
  completed_at: string | null; expires_at: string | null;
  submission_state: "pending" | "complete" | "failed";
  submission_token_hash: string | null; upload_manifest: Json;
  name: string; email: string; phone: string | null;
  project_location: string; project_setting: string; space_type: string | null;
  review_preference: string; room_width: string | null; room_depth: string | null;
  ceiling_height: string | null; handedness: string | null;
  simulator_system: string | null; desired_timeline: string | null;
  project_description: string; referral_source: string | null;
  status: ConsultationStatus; internal_notes: string | null;
  privacy_consent_at: string; source: string;
  notification_status: "pending" | "sent" | "partial" | "failed" | null;
  notification_error: string | null;
};

type PhotoRow = {
  id: string; consultation_id: string; created_at: string;
  storage_path: string; original_filename: string;
  mime_type: "image/jpeg" | "image/png" | "image/webp";
  byte_size: number; caption: string | null; sort_order: number;
};

export type Database = {
  public: {
    Tables: {
      consultations: {
        Row: ConsultationRow;
        Insert: Partial<ConsultationRow> & {
          name: string; email: string; project_location: string;
          project_setting: string; review_preference: string;
          project_description: string; privacy_consent_at: string;
        };
        Update: Partial<ConsultationRow>;
        Relationships: [];
      };
      consultation_photos: {
        Row: PhotoRow;
        Insert: Omit<PhotoRow, "id" | "created_at">;
        Update: Partial<PhotoRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      finalize_consultation: {
        Args: {
          target_consultation_id: string;
          expected_token_hash: string;
          photo_rows: Json;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
