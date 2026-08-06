import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const editor = readFileSync(
  join(process.cwd(), "src/app/admin/projects/[id]/page.tsx"),
  "utf8",
);
const photoEditor = readFileSync(
  join(process.cwd(), "src/components/admin/project-photo-editor.tsx"),
  "utf8",
);
const actions = readFileSync(
  join(process.cwd(), "src/app/admin/projects/actions.ts"),
  "utf8",
);

describe("founder project editor", () => {
  it("keeps the project photo uploader visible before progress updates", () => {
    expect(editor).toContain("ProjectPhotoUploader");
    expect(editor).toContain("ProjectPhotoEditor");
    expect(photoEditor).toContain("Save photo details");
    expect(editor.indexOf("Project photography")).toBeLessThan(
      editor.indexOf("Milestones"),
    );
  });

  it("shows an inline, accessible confirmation after saving", () => {
    const toast = readFileSync(
      join(process.cwd(), "src/components/admin/save-build-toast.tsx"),
      "utf8",
    );

    expect(editor).toContain("<SaveBuildToast />");
    expect(toast).toContain('role="status"');
    expect(toast).toContain('aria-live="polite"');
    expect(toast).toContain('url.searchParams.delete("saved")');
    expect(actions.match(/\?saved=1/g)).toHaveLength(1);
  });

  it("requires founder-selected cover and social images for future publication", () => {
    expect(editor).toContain("Sharing preview");
    expect(actions).toContain("Select a cover image and social preview image before publishing.");
  });

  it("contains no mojibake in the editor", () => {
    expect(editor).not.toMatch(/ÃƒÆ’|Ãƒâ€š|ÃƒÂ¢/);
  });
});
