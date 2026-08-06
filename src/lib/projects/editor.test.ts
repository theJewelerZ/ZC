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
      editor.indexOf("Progress updates"),
    );
  });

  it("shows explicit confirmation after saving", () => {
    expect(editor).toContain("Project saved.");
    expect(actions).toContain('?saved=1');
  });

  it("contains no mojibake in the editor", () => {
    expect(editor).not.toMatch(/ÃƒÆ’|Ãƒâ€š|ÃƒÂ¢/);
  });
});
