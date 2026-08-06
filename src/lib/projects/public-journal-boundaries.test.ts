import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repository = readFileSync(join(process.cwd(), "src/lib/projects/repository.ts"), "utf8");
const publicPage = readFileSync(join(process.cwd(), "src/app/projects/[slug]/page.tsx"), "utf8");
const card = readFileSync(join(process.cwd(), "src/components/projects/build-card.tsx"), "utf8");
const contactPage = readFileSync(join(process.cwd(), "src/app/contact/page.tsx"), "utf8");
const contactRoute = readFileSync(join(process.cwd(), "src/app/api/consultations/start/route.ts"), "utf8");

describe("public editorial journal boundaries", () => {
  it("uses explicit public projections and permission-cleared sanitized media", () => {
    expect(repository).not.toContain('.select("*")');
    expect(repository).toContain('.eq("publication_permission_status", "granted")');
    expect(repository).toContain('.not("public_generated_at", "is", null)');
  });

  it("groups published photography into chronological milestones", () => {
    expect(repository).toContain("photo.updateId === update.id");
    expect(repository).toContain('order("occurred_on", { ascending: true })');
    expect(publicPage).toContain("build-milestone-photos");
  });

  it("keeps workflow language out of the public experience", () => {
    const publicCopy = `${publicPage}\n${card}`;
    expect(publicCopy).not.toMatch(/founder-approved|approved photography|public candidate/i);
    expect(card).toContain("View the Build");
  });

  it("resolves Build consultation context again on the server", () => {
    expect(contactPage).toContain("getPublishedBuildContext");
    expect(contactRoute).toContain("getPublishedBuildContext");
    expect(contactRoute).toContain('source: sourceBuild ? "inside_the_build" : "website"');
  });
});
