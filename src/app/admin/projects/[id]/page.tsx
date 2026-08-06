import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createProjectUpdateAction,
  setProjectPublicationAction,
  setUpdatePublicationAction,
  updateProjectAction,
  updateProjectUpdateAction,
} from "@/app/admin/projects/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProjectPhotoEditor } from "@/components/admin/project-photo-editor";
import { ProjectPhotoUploader } from "@/components/admin/project-photo-uploader";
import { requireAdmin } from "@/lib/admin/auth";
import {
  PROJECT_PRIVATE_BUCKET,
  isUuid,
  label,
  operationalStatuses,
  permissionMethods,
  permissionStatuses,
  projectStages,
  publicBuildStatuses,
} from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Build workspace", robots: { index: false, follow: false, nocache: true } };

function localTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Detroit" }).format(new Date(value));
}

export default async function ProjectDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; publication?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!isUuid(id)) notFound();
  const client = createSupabaseAdminClient();
  const publicConfig = getSupabasePublicConfig();
  const [{ data: project }, { data: updates }, { data: photos }, { data: captures }] = await Promise.all([
    client.from("projects").select("*").eq("id", id).maybeSingle(),
    client.from("project_updates").select("*").eq("project_id", id).order("occurred_on", { ascending: false }).order("created_at", { ascending: false }),
    client.from("project_photos").select("*").eq("project_id", id).eq("upload_state", "complete").order("sort_order").order("created_at"),
    client.from("field_capture_sessions").select("*").eq("project_id", id).in("session_state", ["complete", "partial"]).order("created_at", { ascending: false }),
  ]);
  if (!project) notFound();
  const signed = await Promise.all((photos || []).map(async (photo) => ({
    ...photo,
    url: (await client.storage.from(PROJECT_PRIVATE_BUCKET).createSignedUrl(photo.private_storage_path, 300)).data?.signedUrl || null,
  })));
  const milestoneOptions = (updates || []).map((update) => ({ id: update.id, title: update.title, occurredOn: update.occurred_on }));
  const completionReadiness = {
    livingProject: project.publication_status === "published",
    caseStudy: project.public_build_status === "completed" && Boolean(project.public_starting_point && project.public_outcome && updates?.some((update) => update.publication_status === "published")),
    portfolio: project.public_build_status === "completed" && Boolean(project.public_outcome && project.cover_photo_id),
    planningGuide: project.public_build_status === "completed" && Boolean(project.public_planning_takeaways),
  };

  return <main className="admin-shell" id="main-content">
    <AdminNav />
    {query.saved === "1" ? <div className="admin-save-confirmation" role="status"><strong>Build saved.</strong><span>Project information and editorial settings are up to date.</span></div> : null}
    {query.publication === "1" ? <div className="admin-save-confirmation" role="status"><strong>Publication updated.</strong></div> : null}

    <Link className="admin-back" href="/admin/projects">Back to Builds</Link>
    <div className="admin-heading">
      <div><p className="eyebrow">{label(project.publication_status)}</p><h1>{project.internal_name}</h1><p>Private project source and founder-controlled public story.</p></div>
      <div className="admin-security-actions">
        <Link className="button button-outline" href={`/field?project=${id}#capture`}>Capture progress</Link>
        <Link className="button button-outline" href={`/admin/projects/${id}/preview`} target="_blank">Preview journal</Link>
        {project.publication_status === "published" ? <Link className="button button-outline" href={`/projects/${project.slug}`} target="_blank">View public Build</Link> : null}
        <form action={setProjectPublicationAction}>
          <input name="id" type="hidden" value={id} />
          <input name="intent" type="hidden" value={project.publication_status === "published" ? "unpublish" : "publish"} />
          <button className="button button-primary">{project.publication_status === "published" ? "Unpublish Build" : "Publish Build"}</button>
        </form>
      </div>
    </div>

    {project.publication_permission_status !== "granted" ? <div className="notification-warning" role="status"><strong>Publication permission is not active.</strong><p>The Build, milestones, and photographs cannot be published until permission is recorded. Withdrawing permission removes all public presentation.</p></div> : null}

    <section className="admin-card">
      <div className="admin-section-heading"><div><p className="eyebrow">Source of truth</p><h2>Build information</h2></div><p>Operational facts stay private. Public story fields appear only after explicit publication.</p></div>
      <form action={updateProjectAction} className="admin-project-form">
        <input name="id" type="hidden" value={id} />
        <fieldset className="admin-form-section admin-wide"><legend>Identity and public summary</legend>
          <div className="admin-form-grid">
            <label>Internal name<input defaultValue={project.internal_name} name="internalName" required /></label>
            <label>Public title<input defaultValue={project.public_title} name="publicTitle" required /></label>
            <label>Slug<input defaultValue={project.slug} name="slug" required /></label>
            <label>Public location<input defaultValue={project.public_location || ""} name="publicLocation" /></label>
            <label className="admin-wide">Timeless public summary<textarea defaultValue={project.public_summary || ""} maxLength={600} name="publicSummary" rows={4} /><small>Avoid relative language such as “this week” so the page remains useful years later.</small></label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section admin-wide"><legend>Lifecycle and dates</legend>
          <div className="admin-form-grid">
            <label>Operational status<select defaultValue={project.operational_status} name="operationalStatus">{operationalStatuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label>Internal stage<select defaultValue={project.project_stage} name="projectStage">{projectStages.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label>Public Build status<select defaultValue={project.public_build_status} name="publicBuildStatus">{publicBuildStatuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <span />
            <label>Planned start<input defaultValue={project.planned_start_on || ""} name="plannedStartOn" type="date" /></label>
            <label>Planned completion<input defaultValue={project.planned_completion_on || ""} name="plannedCompletionOn" type="date" /></label>
            <label>Actual start<input defaultValue={project.actual_started_on || ""} name="actualStartedOn" type="date" /></label>
            <label>Actual completion<input defaultValue={project.actual_completed_on || ""} name="actualCompletedOn" type="date" /></label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section admin-wide"><legend>Editorial story</legend>
          <div className="admin-form-grid">
            <label className="admin-wide">What existed<textarea defaultValue={project.public_starting_point || ""} maxLength={3000} name="publicStartingPoint" rows={4} /><small>Describe the starting conditions and the customer need without exposing private details.</small></label>
            <label className="admin-wide">Zarka’s role<textarea defaultValue={project.public_zarka_role || ""} maxLength={3000} name="publicZarkaRole" rows={4} /><small>State the defined simulator-environment work and any coordination without overstating scope.</small></label>
            <label className="admin-wide">Completed outcome<textarea defaultValue={project.public_outcome || ""} maxLength={3000} name="publicOutcome" rows={4} /><small>Explain what the finished environment enables.</small></label>
            <label className="admin-wide">Planning takeaways<textarea defaultValue={project.public_planning_takeaways || ""} maxLength={3000} name="publicPlanningTakeaways" rows={4} /><small>Record lessons that could help a future customer plan with more confidence.</small></label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section admin-wide"><legend>Publication permission</legend>
          <div className="admin-form-grid">
            <label>Permission status<select defaultValue={project.publication_permission_status} name="permissionStatus">{permissionStatuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label>Permission method<select defaultValue={project.publication_permission_method || ""} name="permissionMethod"><option value="">Select when permission is granted</option>{permissionMethods.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label>Private reference<input defaultValue={project.publication_permission_reference || ""} maxLength={500} name="permissionReference" /></label>
            <label className="admin-wide">Private permission notes<textarea defaultValue={project.publication_permission_notes || ""} maxLength={2000} name="permissionNotes" rows={3} /></label>
          </div>
          <p className="field-help">Do not store contracts or customer documents here. Record only enough private context to verify the decision. Withdrawing permission unpublishes the Build and removes public media.</p>
        </fieldset>

        <fieldset className="admin-form-section admin-wide"><legend>Private operations</legend>
          <div className="admin-form-grid">
            <label>Private address<input defaultValue={project.private_address || ""} name="privateAddress" /></label>
            <label className="admin-wide">Internal scope<textarea defaultValue={project.internal_scope || ""} name="internalScope" rows={5} /></label>
            <label className="admin-wide">Private notes<textarea defaultValue={project.internal_notes || ""} name="internalNotes" rows={5} /></label>
          </div>
        </fieldset>

        <label className="admin-check"><input defaultChecked={project.featured_on_homepage} name="featured" type="checkbox" /> Feature on homepage when published</label>
        <button className="button button-primary" type="submit">Save Build</button>
      </form>
    </section>

    <section className="admin-card" id="field-captures">
      <h2>Field capture sessions</h2><p>Private notes and candidate media from Zarka Field. Field notes never become public milestones automatically.</p>
      {captures?.length ? <div className="field-session-list">{captures.map((capture) => <article key={capture.id}><div><strong>{label(capture.project_stage)}</strong><time dateTime={capture.created_at}>{localTimestamp(capture.created_at)}</time></div><p>{capture.field_note || "Photo-only capture"}</p><small>{capture.completed_photo_count} saved · {capture.failed_photo_count} failed · {label(capture.session_state)}</small></article>)}</div> : <p className="field-muted">No field captures yet.</p>}
    </section>

    <section className="admin-card" id="project-photography">
      <div className="admin-section-heading"><div><p className="eyebrow">Private originals</p><h2>Project photography</h2></div><p>Every published image becomes a metadata-free derivative. Originals remain private.</p></div>
      {publicConfig ? <ProjectPhotoUploader projectId={id} publishableKey={publicConfig.publishableKey} url={publicConfig.url} /> : <p className="notification-warning">Photo storage is not configured.</p>}
      {signed.length ? <div className="admin-photo-review-list">{signed.map((photo) => <ProjectPhotoEditor
        altText={photo.alt_text || ""}
        candidate={photo.publication_candidate}
        caption={photo.caption || ""}
        coverSelected={project.cover_photo_id === photo.id}
        key={photo.id}
        milestones={milestoneOptions}
        photoId={photo.id}
        projectId={id}
        selectedMilestoneId={photo.update_id}
        signedUrl={photo.url}
        socialSelected={project.social_photo_id === photo.id}
        sortOrder={photo.sort_order}
        visibility={photo.visibility}
      />)}</div> : <p className="field-muted">No project photography has been uploaded.</p>}
    </section>

    <section className="admin-card" id="progress-updates">
      <div className="admin-section-heading"><div><p className="eyebrow">Editorial journal</p><h2>Milestones</h2></div><p>Each milestone should explain what changed, why it mattered, and what a future customer can learn.</p></div>
      <form action={createProjectUpdateAction} className="admin-update-form admin-milestone-create">
        <input name="projectId" type="hidden" value={id} />
        <label>Milestone title<input maxLength={160} name="title" required /></label>
        <label>Concise story<textarea maxLength={5000} minLength={10} name="body" required rows={5} /></label>
        <label>Internal stage<select defaultValue={project.project_stage} name="projectStage">{projectStages.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
        <label>Date<input defaultValue={new Date().toISOString().slice(0, 10)} name="occurredOn" type="date" /></label>
        <button className="button button-primary">Save private milestone</button>
      </form>
      {updates?.length ? <div className="admin-milestone-list">{updates.map((update) => <article className="admin-milestone-editor" key={update.id}>
        <form action={updateProjectUpdateAction} className="admin-update-form">
          <input name="id" type="hidden" value={update.id} />
          <input name="projectId" type="hidden" value={id} />
          <label>Title<input defaultValue={update.title} maxLength={160} name="title" required /></label>
          <label>Story<textarea defaultValue={update.body} maxLength={5000} minLength={10} name="body" required rows={5} /></label>
          <label>Internal stage<select defaultValue={update.project_stage} name="projectStage">{projectStages.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
          <label>Date<input defaultValue={update.occurred_on} name="occurredOn" type="date" /></label>
          <button className="button button-outline">Save milestone</button>
        </form>
        <div className="admin-milestone-footer"><span className="status-badge">{label(update.publication_status)}</span><a href={`#project-photography`}>{signed.filter((photo) => photo.update_id === update.id).length} assigned photos</a><form action={setUpdatePublicationAction}><input name="id" type="hidden" value={update.id} /><input name="projectId" type="hidden" value={id} /><input name="intent" type="hidden" value={update.publication_status === "published" ? "unpublish" : "publish"} /><button className="button button-outline">{update.publication_status === "published" ? "Unpublish milestone" : "Publish milestone"}</button></form></div>
      </article>)}</div> : <p className="field-muted">No milestones have been written.</p>}
    </section>

    <section className="admin-card" id="completion-readiness">
      <div className="admin-section-heading"><div><p className="eyebrow">Derived, not duplicated</p><h2>Completion readiness</h2></div><p>The project remains the source. Future presentations derive from the approved record.</p></div>
      <dl className="admin-readiness-grid">
        <div><dt>Living project journal</dt><dd>{completionReadiness.livingProject ? "Ready" : "Publish the Build"}</dd></div>
        <div><dt>Case study candidate</dt><dd>{completionReadiness.caseStudy ? "Ready" : "Needs completion, starting point, outcome, and a milestone"}</dd></div>
        <div><dt>Portfolio candidate</dt><dd>{completionReadiness.portfolio ? "Ready" : "Needs completion, outcome, and cover image"}</dd></div>
        <div><dt>Planning guide candidate</dt><dd>{completionReadiness.planningGuide ? "Ready" : "Needs completion and planning takeaways"}</dd></div>
      </dl>
    </section>
  </main>;
}
