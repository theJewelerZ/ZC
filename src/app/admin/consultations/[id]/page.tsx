/* eslint-disable @next/next/no-img-element -- private signed URLs and local blob previews are intentionally not sent through the public image optimizer. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateConsultationAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { PHOTO_BUCKET, SIGNED_PHOTO_SECONDS } from "@/lib/consultations/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ConsultationStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Consultation detail", robots: { index: false, follow: false, nocache: true } };

const statuses: ConsultationStatus[] = ["new", "reviewing", "contacted", "site_visit", "proposal", "won", "lost", "archived"];
function date(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Detroit" }).format(new Date(value)) : "Not available";
}
function value(item: string | null) { return item || "Not provided"; }

export default async function ConsultationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const client = createSupabaseAdminClient();
  const [{ data: consultation, error }, { data: photos }] = await Promise.all([
    client.from("consultations").select("*").eq("id", id).eq("submission_state", "complete").maybeSingle(),
    client.from("consultation_photos").select("*").eq("consultation_id", id).order("sort_order"),
  ]);
  if (error || !consultation) notFound();

  const signedPhotos = await Promise.all((photos || []).map(async (photo) => {
    const { data } = await client.storage.from(PHOTO_BUCKET).createSignedUrl(photo.storage_path, SIGNED_PHOTO_SECONDS);
    return { ...photo, signedUrl: data?.signedUrl || null };
  }));

  const details = [
    ["Project location", consultation.project_location], ["Project setting", consultation.project_setting],
    ["Space type", value(consultation.space_type)], ["Review preference", consultation.review_preference],
    ["Desired timeline", value(consultation.desired_timeline)], ["Room width", value(consultation.room_width)],
    ["Room depth", value(consultation.room_depth)], ["Ceiling height", value(consultation.ceiling_height)],
    ["Player handedness", value(consultation.handedness)], ["Known simulator system", value(consultation.simulator_system)],
    ["Referral source", value(consultation.referral_source)], ["Received", date(consultation.created_at)],
    ["Updated", date(consultation.updated_at)], ["Completed", date(consultation.completed_at)],
    ["Notification", consultation.notification_status || "Not attempted"],
  ];

  return <main className="admin-shell" id="main-content">
    <Link className="admin-back" href="/admin">← All consultations</Link>
    <div className="admin-heading"><div><p className="eyebrow">Consultation {consultation.id.slice(0, 8)}</p><h1>{consultation.name}</h1><p>{consultation.project_location}</p></div><div className="admin-contact-links"><a className="button button-outline" href={`mailto:${consultation.email}`}>Email customer</a>{consultation.phone ? <a className="button button-outline" href={`tel:${consultation.phone}`}>Call customer</a> : null}</div></div>
    <section className="admin-card"><h2>Submitted details</h2><dl className="admin-detail-grid"><div><dt>Email</dt><dd>{consultation.email}</dd></div><div><dt>Phone</dt><dd>{value(consultation.phone)}</dd></div>{details.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}<div><dt>Consultation ID</dt><dd><code>{consultation.id}</code></dd></div></dl><h3>Project description</h3><p className="admin-description">{consultation.project_description}</p>{consultation.notification_error ? <div className="notification-warning" role="status"><strong>Notification attention required</strong><p>{consultation.notification_error}</p></div> : null}</section>
    <section className="admin-card"><h2>Room photos</h2>{signedPhotos.length ? <div className="admin-photo-grid">{signedPhotos.map((photo) => <figure key={photo.id}>{photo.signedUrl ? <a href={photo.signedUrl} rel="noreferrer" target="_blank"><img alt={photo.caption || "Customer-provided room photograph"} height={360} src={photo.signedUrl} width={480} /></a> : <div className="photo-unavailable">Secure preview unavailable. Reload to refresh.</div>}<figcaption>{photo.caption || photo.original_filename}<span>{(photo.byte_size / 1024 / 1024).toFixed(1)} MB</span></figcaption></figure>)}</div> : <p>No photos were included with this consultation.</p>}</section>
    <section className="admin-card"><h2>Review status and private notes</h2><form action={updateConsultationAction} className="admin-update-form"><input name="id" type="hidden" value={consultation.id} /><label htmlFor="status">Lead status</label><select defaultValue={consultation.status} id="status" name="status">{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select><label htmlFor="internalNotes">Internal notes</label><textarea defaultValue={consultation.internal_notes || ""} id="internalNotes" maxLength={5000} name="internalNotes" rows={8} /><p>Private founder notes are not included in customer email or analytics.</p><button className="button button-primary" type="submit">Save review</button></form></section>
  </main>;
}
