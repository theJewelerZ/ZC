import type { ProjectOperationalStatus, ProjectStage, ProjectRow } from "@/lib/supabase/database.types";

export const FIELD_PHOTO_BATCH_MAX = 20;
export const FIELD_NOTE_MAX_LENGTH = 1000;
export const FIELD_CAPTURE_EXPIRY_MS = 60 * 60 * 1000;
export const FIELD_CAPTURE_ALLOWED_STATUSES: ProjectOperationalStatus[] = ["planning", "active", "on_hold", "completed"];

export const fieldStageOptions: Array<{ value: ProjectStage; label: string }> = [
  { value: "consultation", label: "Room Review" },
  { value: "planning", label: "Planning and Layout" },
  { value: "preparation", label: "Room Preparation" },
  { value: "framing", label: "Screen Environment" },
  { value: "protection", label: "Wall and Ceiling Protection" },
  { value: "finish_work", label: "Turf, Hitting Area, and Finish Work" },
  { value: "technology_coordination", label: "Testing and Coordination" },
  { value: "final_details", label: "Trim and Detailing" },
  { value: "complete", label: "Ready for Play / Completed" },
];

export function isProjectStage(value: unknown): value is ProjectStage {
  return typeof value === "string" && fieldStageOptions.some((option) => option.value === value);
}

export function canCaptureProject(status: ProjectOperationalStatus) {
  return FIELD_CAPTURE_ALLOWED_STATUSES.includes(status);
}

export function fieldProjectPriority(project: Pick<ProjectRow, "operational_status" | "started_on" | "updated_at">) {
  const rank: Record<ProjectOperationalStatus, number> = { active: 0, planning: 1, on_hold: 2, completed: 3, cancelled: 4, archived: 5 };
  return [rank[project.operational_status], project.started_on || "9999-12-31", project.updated_at] as const;
}

export function sortFieldProjects<T extends Pick<ProjectRow, "operational_status" | "started_on" | "updated_at">>(projects: T[]) {
  return [...projects].sort((a, b) => {
    const aa = fieldProjectPriority(a); const bb = fieldProjectPriority(b);
    return aa[0] - bb[0] || aa[1].localeCompare(bb[1]) || bb[2].localeCompare(aa[2]);
  });
}

export function safeFieldNote(value: unknown) {
  if (typeof value !== "string") return null;
  const note = value.trim();
  return note ? note.slice(0, FIELD_NOTE_MAX_LENGTH) : null;
}