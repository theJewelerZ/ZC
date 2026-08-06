import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  updates: [] as Array<Record<string, unknown>>,
  photo: {
    id: "22222222-2222-4222-8222-222222222222",
    project_id: "11111111-1111-4111-8111-111111111111",
    visibility: "private",
    upload_state: "complete",
    public_storage_path: null,
    private_storage_path: "projects/private/photo.jpg",
    mime_type: "image/jpeg",
  },
}));

vi.mock("@/lib/admin/auth", () => ({ getAdminUser: vi.fn(async () => ({ id: "founder" })) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ eq: () => ({ single: async () => ({ data: state.photo, error: null }) }) }),
      }),
      update: (payload: Record<string, unknown>) => {
        state.updates.push(payload);
        const builder = { eq: () => builder, then: (resolve: (value: { error: null }) => void) => resolve({ error: null }) };
        return builder;
      },
    }),
  }),
}));

import { PATCH } from "@/app/api/admin/projects/[id]/photos/[photoId]/route";

const params = Promise.resolve({
  id: "11111111-1111-4111-8111-111111111111",
  photoId: "22222222-2222-4222-8222-222222222222",
});

function request(body: unknown) {
  return new NextRequest("https://www.zarkaconstruction.com/api/admin/projects/11111111-1111-4111-8111-111111111111/photos/22222222-2222-4222-8222-222222222222", {
    method: "PATCH",
    headers: { "content-type": "application/json", origin: "https://www.zarkaconstruction.com" },
    body: JSON.stringify(body),
  });
}

describe("in-place project photo editor", () => {
  beforeEach(() => { state.updates.length = 0; });

  it("saves caption and alt text without a redirect", async () => {
    const result = await PATCH(request({ intent: "save", caption: "Finished enclosure", altText: "Black enclosure around a simulator screen" }), { params });
    expect(result.status).toBe(200);
    expect(await result.json()).toMatchObject({ ok: true, message: "Photo details saved." });
    expect(state.updates[0]).toMatchObject({ caption: "Finished enclosure", alt_text: "Black enclosure around a simulator screen" });
  });

  it("does not erase saved metadata when publish validation fails", async () => {
    const result = await PATCH(request({ intent: "publish", caption: "Finished enclosure", altText: "" }), { params });
    expect(result.status).toBe(422);
    expect(state.updates).toHaveLength(0);
  });

  it("rejects a cross-origin mutation", async () => {
    const crossOrigin = new NextRequest(request({ intent: "save", caption: "Caption", altText: "Description" }).url, {
      method: "PATCH",
      headers: { "content-type": "application/json", origin: "https://example.com" },
      body: JSON.stringify({ intent: "save", caption: "Caption", altText: "Description" }),
    });
    expect((await PATCH(crossOrigin, { params })).status).toBe(403);
  });
});
