/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/auth";
import { PROJECT_PRIVATE_BUCKET, isUuid, label } from "@/lib/projects/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Build journal preview", robots: { index: false, follow: false, nocache: true } };

function displayDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { dateStyle: "long" });
}

export default async function BuildPreview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const client = createSupabaseAdminClient();
  const [{ data: project }, { data: updates }, { data: photos }] = await Promise.all([
    client.from("projects").select("*").eq("id", id).maybeSingle(),
    client.from("project_updates").select("*").eq("project_id", id).order("occurred_on", { ascending: true }).order("created_at", { ascending: true }),
    client.from("project_photos").select("*").eq("project_id", id).eq("upload_state", "complete").order("sort_order").order("created_at"),
  ]);
  if (!project) notFound();
  const previews = await Promise.all((photos || []).map(async (photo) => ({
    ...photo,
    url: (await client.storage.from(PROJECT_PRIVATE_BUCKET).createSignedUrl(photo.private_storage_path, 300)).data?.signedUrl || null,
  })));
  const cover = previews.find((photo) => photo.id === project.cover_photo_id);
  const unassigned = previews.filter((photo) => !photo.update_id);

  return <main className="admin-shell admin-preview-shell" id="main-content">
    <AdminNav />
    <div className="admin-preview-banner"><strong>Private founder preview</strong><span>Draft milestones and private imagery are visible here only.</span><Link href={`/admin/projects/${id}`}>Return to editor</Link></div>
    <article className="build-journal">
      <header className="build-journal-hero">
        <div className="site-container build-journal-hero-grid">
          <div><p className="eyebrow">Inside the Build · {label(project.public_build_status)}</p><h1>{project.public_title}</h1>{project.public_location ? <p className="build-location">{project.public_location}</p> : null}<p className="build-journal-summary">{project.public_summary || "Add a timeless public summary before publishing."}</p></div>
          {cover?.url ? <figure className="build-cover"><img alt={cover.alt_text || "Private cover preview"} src={cover.url} /><figcaption>{cover.caption || "Cover caption needed"}</figcaption></figure> : <div className="build-cover-placeholder"><span>Select a published cover image</span></div>}
        </div>
      </header>
      {project.public_starting_point || project.public_zarka_role ? <section className="build-story-foundation"><div className="site-container build-story-columns">{project.public_starting_point ? <div><p className="eyebrow">The starting point</p><h2>What existed</h2><p>{project.public_starting_point}</p></div> : null}{project.public_zarka_role ? <div><p className="eyebrow">The work</p><h2>Zarka’s role</h2><p>{project.public_zarka_role}</p></div> : null}</div></section> : null}
      {updates?.length ? <section className="build-milestones"><div className="site-container build-reading-column"><p className="eyebrow">The story of the room</p><h2>Milestones</h2>{updates.map((update, index) => {
        const assigned = previews.filter((photo) => photo.update_id === update.id);
        return <article className="build-milestone" id={`milestone-${update.id}`} key={update.id}><div className="build-milestone-marker"><span>{String(index + 1).padStart(2, "0")}</span><time dateTime={update.occurred_on}>{displayDate(update.occurred_on)}</time><em>{label(update.publication_status)}</em></div><div className="build-milestone-story"><h3>{update.title}</h3><p>{update.body}</p>{assigned.length ? <div className={`build-milestone-photos ${assigned.length === 1 ? "is-single" : ""}`}>{assigned.map((photo) => <figure key={photo.id}>{photo.url ? <img alt={photo.alt_text || "Private milestone preview"} src={photo.url} /> : null}<figcaption>{photo.caption || "Caption needed before publication"}</figcaption></figure>)}</div> : null}</div></article>;
      })}</div></section> : null}
      {unassigned.length ? <section className="build-project-details"><div className="site-container"><p className="eyebrow">Project details</p><h2>Additional views</h2><div className="build-detail-gallery">{unassigned.map((photo) => <figure key={photo.id}>{photo.url ? <img alt={photo.alt_text || "Private project preview"} src={photo.url} /> : null}<figcaption>{photo.caption || "Caption needed before publication"}</figcaption></figure>)}</div></div></section> : null}
      {project.public_outcome || project.public_planning_takeaways ? <section className="build-completion-story"><div className="site-container build-story-columns">{project.public_outcome ? <div><p className="eyebrow">The completed environment</p><h2>What this room enables</h2><p>{project.public_outcome}</p></div> : null}{project.public_planning_takeaways ? <div><p className="eyebrow">For future rooms</p><h2>Planning takeaways</h2><p>{project.public_planning_takeaways}</p></div> : null}</div></section> : null}
    </article>
  </main>;
}
