import type {
  ConsultationStatus,
  ProjectOperationalStatus,
  ProjectStage,
  PublicationStatus,
  PublicBuildStatus,
} from "@/lib/supabase/database.types";

export type MissionProject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  internalName: string;
  slug: string;
  publicLocation: string | null;
  operationalStatus: ProjectOperationalStatus;
  projectStage: ProjectStage;
  publicationStatus: PublicationStatus;
  publicBuildStatus: PublicBuildStatus;
  startedOn: string | null;
  completedOn: string | null;
};

export type MissionConsultation = {
  id: string;
  createdAt: string;
  completedAt: string | null;
  name: string;
  projectLocation: string;
  status: ConsultationStatus;
  submissionState: "pending" | "complete" | "failed";
  notificationStatus: "pending" | "sent" | "partial" | "failed" | null;
};

export type MissionPhoto = {
  id: string;
  projectId: string;
  createdAt: string;
  publicationCandidate: boolean;
  visibility: "private" | "public";
  uploadState: "pending" | "complete" | "failed";
};

export type MissionUpdate = {
  id: string;
  projectId: string;
  createdAt: string;
  occurredOn: string;
  title: string;
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
};

export type MissionCapture = {
  id: string;
  projectId: string;
  createdAt: string;
  completedAt: string | null;
  sessionState: "pending" | "complete" | "partial" | "failed";
};

export type MissionSnapshot = {
  projects: MissionProject[];
  consultations: MissionConsultation[];
  photos: MissionPhoto[];
  updates: MissionUpdate[];
  captures: MissionCapture[];
};

export type MissionBuild = MissionProject & {
  latestCaptureAt: string | null;
  latestUpdateAt: string | null;
  privatePhotoCount: number;
  candidatePhotoCount: number;
  publishedUpdateCount: number;
  draftUpdateCount: number;
};

export type AttentionItem = {
  id: string;
  count: number;
  title: string;
  description: string;
  href: string;
  priority: "high" | "normal";
};

export type MissionActivity = {
  id: string;
  label: string;
  detail: string;
  occurredAt: string;
  href: string;
};

export type MissionControlModel = {
  attention: AttentionItem[];
  activeBuilds: MissionBuild[];
  upcomingBuilds: Array<MissionBuild & { daysUntilStart: number | null }>;
  consultationCounts: Record<ConsultationStatus, number>;
  recentConsultations: MissionConsultation[];
  recentActivity: MissionActivity[];
  metrics: {
    consultations7Days: number;
    consultations30Days: number;
    completedConsultations30Days: number;
    activeBuilds: number;
    upcomingBuilds: number;
    publishedBuilds: number;
    candidatePhotos: number;
    publishedUpdates30Days: number;
  };
  publishing: {
    publishedBuilds: number;
    candidatePhotos: number;
    draftUpdates: number;
    buildsWithoutPublicActivity: MissionBuild[];
    recentlyPublishedUpdates: MissionUpdate[];
  };
  lastConsultationAt: string | null;
  lastFieldCaptureAt: string | null;
  notificationFailureCount: number;
};

const consultationStatuses: ConsultationStatus[] = [
  "new", "reviewing", "contacted", "site_visit", "proposal", "won", "lost", "archived",
];

function timestamp(value: string | null | undefined) {
  return value ? new Date(value).getTime() : 0;
}

function withinDays(value: string | null, now: Date, days: number) {
  if (!value) return false;
  const age = now.getTime() - timestamp(value);
  return age >= 0 && age <= days * 86_400_000;
}

function buildSummary(project: MissionProject, snapshot: MissionSnapshot): MissionBuild {
  const photos = snapshot.photos.filter((photo) => photo.projectId === project.id && photo.uploadState === "complete");
  const updates = snapshot.updates.filter((update) => update.projectId === project.id);
  const captures = snapshot.captures.filter((capture) => capture.projectId === project.id && ["complete", "partial"].includes(capture.sessionState));
  return {
    ...project,
    latestCaptureAt: captures.sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))[0]?.createdAt ?? null,
    latestUpdateAt: updates.sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))[0]?.createdAt ?? null,
    privatePhotoCount: photos.filter((photo) => photo.visibility === "private").length,
    candidatePhotoCount: photos.filter((photo) => photo.visibility === "private" && photo.publicationCandidate).length,
    publishedUpdateCount: updates.filter((update) => update.publicationStatus === "published").length,
    draftUpdateCount: updates.filter((update) => update.publicationStatus !== "published").length,
  };
}

function daysUntil(date: string | null, now: Date) {
  if (!date) return null;
  const start = new Date(`${date}T12:00:00`).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).getTime();
  return Math.ceil((start - today) / 86_400_000);
}

export function createMissionControlModel(snapshot: MissionSnapshot, now = new Date()): MissionControlModel {
  const builds = snapshot.projects.map((project) => buildSummary(project, snapshot));
  const activeBuilds = builds.filter((build) => build.operationalStatus === "active")
    .sort((a, b) => timestamp(b.latestCaptureAt ?? b.updatedAt) - timestamp(a.latestCaptureAt ?? a.updatedAt));
  const upcomingBuilds = builds.filter((build) => build.operationalStatus === "planning")
    .map((build) => ({ ...build, daysUntilStart: daysUntil(build.startedOn, now) }))
    .sort((a, b) => (a.daysUntilStart ?? Number.MAX_SAFE_INTEGER) - (b.daysUntilStart ?? Number.MAX_SAFE_INTEGER));
  const completeConsultations = snapshot.consultations.filter((item) => item.submissionState === "complete");
  const candidatePhotos = snapshot.photos.filter((photo) => photo.uploadState === "complete" && photo.visibility === "private" && photo.publicationCandidate);
  const draftUpdates = snapshot.updates.filter((update) => update.publicationStatus !== "published");
  const notificationFailures = completeConsultations.filter((item) => ["failed", "partial"].includes(item.notificationStatus ?? ""));
  const failedCaptures = snapshot.captures.filter((capture) => ["failed", "partial"].includes(capture.sessionState));
  const staleBuilds = activeBuilds.filter((build) => {
    const latest = build.latestCaptureAt ?? build.latestUpdateAt ?? build.updatedAt;
    return !withinDays(latest, now, 14);
  });
  const startingSoon = upcomingBuilds.filter((build) => build.daysUntilStart !== null && build.daysUntilStart >= 0 && build.daysUntilStart <= 14);
  const attention: AttentionItem[] = [];
  const addAttention = (condition: boolean, item: AttentionItem) => { if (condition) attention.push(item); };
  addAttention(completeConsultations.some((item) => item.status === "new"), { id: "new-consultations", count: completeConsultations.filter((item) => item.status === "new").length, title: "New consultations", description: "Review new simulator-room inquiries.", href: "/admin/consultations?status=new", priority: "high" });
  addAttention(notificationFailures.length > 0, { id: "notification-failures", count: notificationFailures.length, title: "Notification follow-up", description: "Stored consultations have an email delivery issue.", href: "/admin/consultations", priority: "high" });
  addAttention(candidatePhotos.length > 0, { id: "candidate-photos", count: candidatePhotos.length, title: "Candidate photos", description: "Review field photos selected for possible publication.", href: "/admin/projects?review=candidates", priority: "normal" });
  addAttention(draftUpdates.length > 0, { id: "draft-updates", count: draftUpdates.length, title: "Unpublished updates", description: "Review saved Build updates before publication.", href: "/admin/projects?review=updates", priority: "normal" });
  addAttention(staleBuilds.length > 0, { id: "stale-builds", count: staleBuilds.length, title: "Active Builds need an update", description: "No capture or update has been recorded in 14 days.", href: "/field", priority: "normal" });
  addAttention(startingSoon.length > 0, { id: "starting-soon", count: startingSoon.length, title: "Builds starting soon", description: "Review Builds scheduled to begin within 14 days.", href: "/admin/projects", priority: "normal" });
  addAttention(failedCaptures.length > 0, { id: "incomplete-captures", count: failedCaptures.length, title: "Incomplete field captures", description: "Review partial or failed jobsite capture sessions.", href: "/admin/projects?review=captures", priority: "high" });

  const consultationCounts = Object.fromEntries(consultationStatuses.map((status) => [status, completeConsultations.filter((item) => item.status === status).length])) as Record<ConsultationStatus, number>;
  const recentlyPublishedUpdates = snapshot.updates.filter((update) => update.publicationStatus === "published")
    .sort((a, b) => timestamp(b.publishedAt ?? b.createdAt) - timestamp(a.publishedAt ?? a.createdAt)).slice(0, 5);
  const activities: MissionActivity[] = [
    ...completeConsultations.map((item) => ({ id: `consultation-${item.id}`, label: "Consultation received", detail: `${item.name} - ${item.projectLocation}`, occurredAt: item.completedAt ?? item.createdAt, href: `/admin/consultations/${item.id}` })),
    ...snapshot.projects.map((item) => ({ id: `project-${item.id}`, label: "Build created", detail: item.internalName, occurredAt: item.createdAt, href: `/admin/projects/${item.id}` })),
    ...snapshot.captures.filter((item) => item.sessionState === "complete").map((item) => ({ id: `capture-${item.id}`, label: "Field capture completed", detail: snapshot.projects.find((project) => project.id === item.projectId)?.internalName ?? "Build", occurredAt: item.completedAt ?? item.createdAt, href: `/admin/projects/${item.projectId}#field-captures` })),
    ...candidatePhotos.map((item) => ({ id: `candidate-${item.id}`, label: "Photo marked candidate", detail: snapshot.projects.find((project) => project.id === item.projectId)?.internalName ?? "Build", occurredAt: item.createdAt, href: `/admin/projects/${item.projectId}#project-photography` })),
    ...recentlyPublishedUpdates.map((item) => ({ id: `update-${item.id}`, label: "Update published", detail: item.title, occurredAt: item.publishedAt ?? item.createdAt, href: `/admin/projects/${item.projectId}#progress-updates` })),
  ].sort((a, b) => timestamp(b.occurredAt) - timestamp(a.occurredAt)).slice(0, 8);

  return {
    attention,
    activeBuilds,
    upcomingBuilds,
    consultationCounts,
    recentConsultations: completeConsultations.sort((a, b) => timestamp(b.completedAt ?? b.createdAt) - timestamp(a.completedAt ?? a.createdAt)).slice(0, 5),
    recentActivity: activities,
    metrics: {
      consultations7Days: completeConsultations.filter((item) => withinDays(item.completedAt ?? item.createdAt, now, 7)).length,
      consultations30Days: completeConsultations.filter((item) => withinDays(item.completedAt ?? item.createdAt, now, 30)).length,
      completedConsultations30Days: completeConsultations.filter((item) => withinDays(item.completedAt ?? item.createdAt, now, 30)).length,
      activeBuilds: activeBuilds.length,
      upcomingBuilds: upcomingBuilds.length,
      publishedBuilds: builds.filter((build) => build.publicationStatus === "published").length,
      candidatePhotos: candidatePhotos.length,
      publishedUpdates30Days: snapshot.updates.filter((update) => update.publicationStatus === "published" && withinDays(update.publishedAt ?? update.createdAt, now, 30)).length,
    },
    publishing: {
      publishedBuilds: builds.filter((build) => build.publicationStatus === "published").length,
      candidatePhotos: candidatePhotos.length,
      draftUpdates: draftUpdates.length,
      buildsWithoutPublicActivity: builds.filter((build) => build.publicationStatus !== "published" && build.publishedUpdateCount === 0).slice(0, 5),
      recentlyPublishedUpdates,
    },
    lastConsultationAt: completeConsultations.sort((a, b) => timestamp(b.completedAt ?? b.createdAt) - timestamp(a.completedAt ?? a.createdAt))[0]?.completedAt ?? completeConsultations[0]?.createdAt ?? null,
    lastFieldCaptureAt: snapshot.captures.sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))[0]?.createdAt ?? null,
    notificationFailureCount: notificationFailures.length,
  };
}
