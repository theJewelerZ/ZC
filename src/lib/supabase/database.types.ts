export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined } | Json[];

export type ConsultationStatus =
  | "new" | "reviewing" | "contacted" | "site_visit"
  | "proposal" | "won" | "lost" | "archived";
export type ProjectOperationalStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled" | "archived";
export type PublicationStatus = "private" | "draft" | "published" | "unpublished";
export type ProjectStage = "consultation" | "planning" | "preparation" | "framing" | "protection" | "finish_work" | "technology_coordination" | "final_details" | "complete";
export type PublicBuildStatus = "upcoming" | "current" | "completed";

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

export type ProjectRow = {
  id: string; created_at: string; updated_at: string; consultation_id: string | null;
  internal_name: string; slug: string; public_title: string; public_summary: string | null;
  public_location: string | null; private_address: string | null; internal_scope: string | null;
  internal_notes: string | null; operational_status: ProjectOperationalStatus;
  publication_status: PublicationStatus; project_stage: ProjectStage;
  public_build_status: PublicBuildStatus; featured_on_homepage: boolean;
  started_on: string | null; completed_on: string | null; published_at: string | null;
  created_by: string | null; updated_by: string | null;
};

export type ProjectUpdateRow = {
  id: string; project_id: string; created_at: string; updated_at: string; occurred_on: string;
  title: string; body: string; project_stage: ProjectStage; publication_status: PublicationStatus;
  published_at: string | null; created_by: string | null; updated_by: string | null;
};

export type ProjectPhotoRow = {
  id: string; project_id: string; update_id: string | null; created_at: string; updated_at: string;
  private_storage_path: string; public_storage_path: string | null; original_filename: string;
  mime_type: "image/jpeg" | "image/png" | "image/webp"; byte_size: number;
  caption: string | null; alt_text: string | null; visibility: "private" | "public";
  approval_status: "pending" | "approved" | "rejected"; upload_state: "pending" | "complete" | "failed";
  upload_expires_at: string | null; sort_order: number; published_at: string | null;
  created_by: string | null; updated_by: string | null;
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
      projects: {
        Row: ProjectRow;
        Insert: Partial<ProjectRow> & { internal_name: string; slug: string; public_title: string };
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      project_updates: {
        Row: ProjectUpdateRow;
        Insert: Partial<ProjectUpdateRow> & { project_id: string; title: string; body: string };
        Update: Partial<ProjectUpdateRow>;
        Relationships: [];
      };
      project_photos: {
        Row: ProjectPhotoRow;
        Insert: Partial<ProjectPhotoRow> & { project_id: string; private_storage_path: string; original_filename: string; mime_type: ProjectPhotoRow["mime_type"]; byte_size: number };
        Update: Partial<ProjectPhotoRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      finalize_consultation: {
        Args: { target_consultation_id: string; expected_token_hash: string; photo_rows: Json };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};