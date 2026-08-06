import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const repositorySource = readFileSync("src/lib/admin/mission-control.ts", "utf8");
const pageSource = readFileSync("src/app/admin/page.tsx", "utf8");
const viewSource = readFileSync("src/components/admin/mission-control.tsx", "utf8");

describe("Mission Control boundaries", () => {
  it("uses bounded parallel server queries", () => {
    expect(repositorySource).toContain("Promise.all");
    expect(repositorySource.match(/\.limit\(/g)?.length).toBe(5);
    expect(repositorySource).toContain('import "server-only"');
  });

  it("requires founder authorization and disables private caching", () => {
    expect(pageSource).toContain("await requireAdmin()");
    expect(pageSource).toContain('dynamic = "force-dynamic"');
    expect(pageSource).toContain("revalidate = 0");
    expect(pageSource).toContain("nocache: true");
  });

  it("reports configuration state without rendering values", () => {
    expect(viewSource).toContain('"Available"');
    expect(viewSource).not.toContain("serviceRoleKey");
    expect(viewSource).not.toContain("publishableKey");
    expect(viewSource).not.toContain("notification_error");
  });
});
