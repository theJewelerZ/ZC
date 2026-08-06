import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { copyBuildLink, shareBuild, type BuildShareEnvironment } from "@/lib/projects/share-client";
import { getBuildShareData, getCanonicalBuildUrl } from "@/lib/projects/share";

const data = getBuildShareData({
  slug: "albatross-golf-mason",
  title: "Albatross Golf — Mason, Michigan",
  description: "A published Build summary.",
});
const shareComponent = readFileSync(join(process.cwd(), "src/components/projects/build-share.tsx"), "utf8");
const buildCard = readFileSync(join(process.cwd(), "src/components/projects/build-card.tsx"), "utf8");
const buildPage = readFileSync(join(process.cwd(), "src/app/projects/[slug]/page.tsx"), "utf8");

describe("premium Build sharing", () => {
  it("always generates the configured canonical www Build URL", () => {
    expect(getCanonicalBuildUrl("albatross-golf-mason")).toBe(
      "https://www.zarkaconstruction.com/projects/albatross-golf-mason",
    );
    expect(() => getCanonicalBuildUrl("https://preview.vercel.app/private")).toThrow();
  });

  it("creates a parameterized X Web Intent with only approved public content", () => {
    const intent = new URL(data.xIntentUrl);
    expect(intent.origin + intent.pathname).toBe("https://x.com/intent/post");
    expect(intent.searchParams.get("text")).toBe("Albatross Golf — Mason, Michigan | Inside the Build");
    expect(intent.searchParams.get("url")).toBe(data.canonicalUrl);
    expect(data.xIntentUrl).not.toMatch(/project-media|supabase|vercel|source_project_id/);
  });

  it("uses native sharing without touching the clipboard", async () => {
    const environment: BuildShareEnvironment = {
      share: vi.fn().mockResolvedValue(undefined),
      copy: vi.fn(),
      clipboardAvailable: true,
    };
    await expect(shareBuild(data, environment)).resolves.toBe("shared");
    expect(environment.copy).not.toHaveBeenCalled();
  });

  it("treats closing the native share sheet as cancellation", async () => {
    const environment: BuildShareEnvironment = {
      share: vi.fn().mockRejectedValue({ name: "AbortError" }),
      copy: vi.fn(),
      clipboardAvailable: true,
    };
    await expect(shareBuild(data, environment)).resolves.toBe("cancelled");
    expect(environment.copy).not.toHaveBeenCalled();
  });

  it("copies when native sharing is unavailable", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await expect(shareBuild(data, { copy, clipboardAvailable: true })).resolves.toBe("copied");
    expect(copy).toHaveBeenCalledWith(data.canonicalUrl);
  });

  it("provides a manual fallback when clipboard access fails", async () => {
    await expect(copyBuildLink(data.canonicalUrl, {
      copy: vi.fn().mockRejectedValue(new Error("denied")),
      clipboardAvailable: true,
    })).resolves.toBe("manual");
  });

  it("integrates sharing without analytics or social SDKs", () => {
    expect(buildCard).toContain(`presentation="card"`);
    expect(buildPage).toContain("<BuildShare data={shareData} />");
    expect(shareComponent).toContain(`aria-live="polite"`);
    expect(shareComponent).toContain("readOnly");
    expect(shareComponent).not.toMatch(/analytics|facebook|instagram|sdk/i);
  });
});
