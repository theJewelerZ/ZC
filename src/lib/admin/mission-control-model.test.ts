import { describe, expect, it } from "vitest";
import { createMissionControlModel, type MissionSnapshot } from "@/lib/admin/mission-control-model";

const now = new Date("2026-08-06T12:00:00Z");
const project = (overrides: Partial<MissionSnapshot["projects"][number]> = {}): MissionSnapshot["projects"][number] => ({
  id: "project-1", createdAt: "2026-07-01T12:00:00Z", updatedAt: "2026-08-05T12:00:00Z", internalName: "Mason Build", slug: "mason-build", publicLocation: "Mason, Michigan", operationalStatus: "active", projectStage: "framing", publicationStatus: "published", publicBuildStatus: "current", startedOn: "2026-08-01", completedOn: null, ...overrides,
});
const empty = (): MissionSnapshot => ({ projects: [], consultations: [], photos: [], updates: [], captures: [] });

function fullSnapshot(): MissionSnapshot {
  return {
    projects: [
      project(),
      project({ id: "project-2", internalName: "Later Build", operationalStatus: "planning", publicationStatus: "private", publicBuildStatus: "upcoming", startedOn: "2026-08-15" }),
      project({ id: "project-3", internalName: "Sooner Build", operationalStatus: "planning", publicationStatus: "private", publicBuildStatus: "upcoming", startedOn: "2026-08-10" }),
    ],
    consultations: [{ id: "consultation-1", createdAt: "2026-08-05T10:00:00Z", completedAt: "2026-08-05T10:05:00Z", name: "Customer", projectLocation: "Michigan", status: "new", submissionState: "complete", notificationStatus: "sent" }],
    photos: [{ id: "photo-1", projectId: "project-1", createdAt: "2026-08-05T12:00:00Z", publicationCandidate: true, visibility: "private", uploadState: "complete" }],
    updates: [{ id: "update-1", projectId: "project-1", createdAt: "2026-08-05T12:00:00Z", occurredOn: "2026-08-05", title: "Framing complete", publicationStatus: "draft", publishedAt: null }],
    captures: [{ id: "capture-1", projectId: "project-1", createdAt: "2026-08-05T12:00:00Z", completedAt: "2026-08-05T12:10:00Z", sessionState: "complete" }],
  };
}

describe("Mission Control model", () => {
  it("orders active Builds by recent work and upcoming Builds by start date", () => {
    const snapshot = fullSnapshot();
    snapshot.projects.push(project({ id: "project-4", internalName: "Older Active", updatedAt: "2026-07-01T12:00:00Z" }));
    const model = createMissionControlModel(snapshot, now);
    expect(model.activeBuilds.map((item) => item.internalName)).toEqual(["Mason Build", "Older Active"]);
    expect(model.upcomingBuilds.map((item) => item.internalName)).toEqual(["Sooner Build", "Later Build"]);
  });

  it("creates only actionable attention items and counts real queues", () => {
    const model = createMissionControlModel(fullSnapshot(), now);
    expect(model.attention.map((item) => item.id)).toEqual(expect.arrayContaining(["new-consultations", "candidate-photos", "draft-updates", "starting-soon"]));
    expect(model.metrics.candidatePhotos).toBe(1);
    expect(model.publishing.draftUpdates).toBe(1);
    expect(model.consultationCounts.new).toBe(1);
  });

  it("does not expose candidate photos as public activity", () => {
    const model = createMissionControlModel(fullSnapshot(), now);
    expect(model.publishing.publishedBuilds).toBe(1);
    expect(model.activeBuilds[0].candidatePhotoCount).toBe(1);
    expect(model.activeBuilds[0].publishedUpdateCount).toBe(0);
  });

  it("provides a quiet zero state without invented warnings", () => {
    const model = createMissionControlModel(empty(), now);
    expect(model.attention).toEqual([]);
    expect(model.recentActivity).toEqual([]);
    expect(model.metrics).toMatchObject({ activeBuilds: 0, upcomingBuilds: 0, candidatePhotos: 0 });
  });

  it("shows notification and partial capture failures only when present", () => {
    const snapshot = fullSnapshot();
    snapshot.consultations[0].notificationStatus = "failed";
    snapshot.captures[0].sessionState = "partial";
    const model = createMissionControlModel(snapshot, now);
    expect(model.notificationFailureCount).toBe(1);
    expect(model.attention.map((item) => item.id)).toEqual(expect.arrayContaining(["notification-failures", "incomplete-captures"]));
  });
});
