import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ authenticated: true, status: "active", projectExists: true, insertedPhotos: [] as Array<Record<string, unknown>> }));
vi.mock("@/lib/admin/auth", () => ({ getAdminUser: async () => state.authenticated ? { id: "founder" } : null }));
vi.mock("@/lib/admin/auth-http", () => ({ isSameOriginAdminRequest: () => true }));
vi.mock("@/lib/supabase/admin", () => ({ createSupabaseAdminClient: () => ({
  from(table: string) {
    const query: Record<string, unknown> = {};
    const chain = () => query;
    Object.assign(query, { select: chain, eq: chain, lt: chain, limit: chain, in: chain, order: chain,
      maybeSingle: async () => table === "projects" ? { data: state.projectExists ? { id: "11111111-1111-4111-8111-111111111111", operational_status: state.status } : null } : { data: null },
      insert: async (value: Record<string, unknown>) => { if (table === "project_photos") state.insertedPhotos.push(value); return { error: null }; },
      update: chain,
    });
    return query;
  },
  storage: { from: () => ({ createSignedUploadUrl: async (path: string) => ({ data: { token: "signed", path }, error: null }), remove: async () => ({ error: null }) }) },
}) }));
import { POST } from "@/app/api/field/captures/start/route";
const projectId = "11111111-1111-4111-8111-111111111111";
function request(body: unknown) { return new NextRequest("https://www.zarkaconstruction.com/api/field/captures/start", { method: "POST", headers: { origin: "https://www.zarkaconstruction.com", "content-type": "application/json" }, body: JSON.stringify(body) }); }
const base = { projectId, stage: "framing", note: "Framing complete", clientSubmissionId: "22222222-2222-4222-8222-222222222222", files: [] };
describe("Field capture start", () => {
  beforeEach(() => { state.authenticated = true; state.status = "active"; state.projectExists = true; state.insertedPhotos = []; });
  it("denies anonymous access", async () => { state.authenticated = false; expect((await POST(request(base))).status).toBe(401); });
  it("saves a valid private note-only capture", async () => { const response = await POST(request(base)); expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ ok: true, uploads: [] }); });
  it("rejects missing, cancelled, and archived projects", async () => { state.projectExists = false; expect((await POST(request(base))).status).toBe(404); state.projectExists = true; state.status = "cancelled"; expect((await POST(request(base))).status).toBe(409); state.status = "archived"; expect((await POST(request(base))).status).toBe(409); });
  it("rejects unsupported, oversized, empty, and excessive files", async () => {
    expect((await POST(request({ ...base, files: [{ name:"x.gif", type:"image/gif", size:10 }] }))).status).toBe(422);
    expect((await POST(request({ ...base, files: [{ name:"x.jpg", type:"image/jpeg", size:0 }] }))).status).toBe(422);
    expect((await POST(request({ ...base, files: [{ name:"x.jpg", type:"image/jpeg", size:16*1024*1024 }] }))).status).toBe(422);
    expect((await POST(request({ ...base, files:Array.from({length:21},(_,i)=>({name:`${i}.jpg`,type:"image/jpeg",size:10})) }))).status).toBe(422);
  });
  it("creates generated private paths and candidate media that is not public", async () => { const response=await POST(request({ ...base, files:[{name:"camera.jpg",type:"image/jpeg",size:10,candidate:true}] })); expect(response.status).toBe(200); expect(state.insertedPhotos[0]).toMatchObject({ project_id:projectId, publication_candidate:true }); expect(String(state.insertedPhotos[0].private_storage_path)).toMatch(new RegExp(`^projects/${projectId}/[0-9a-f-]+\\.jpg$`)); expect(state.insertedPhotos[0]).not.toHaveProperty("visibility", "public"); });
  it("ignores a caller-supplied storage path", async () => { await POST(request({ ...base, path:"other-project/private.jpg", files:[{name:"safe.jpg",type:"image/jpeg",size:10}] })); expect(String(state.insertedPhotos[0].private_storage_path)).not.toContain("other-project"); });
});