import type { Metadata } from "next";
import Link from "next/link";

import { signOutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ConsultationStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Consultations", robots: { index: false, follow: false, nocache: true } };

const statuses: { value: "" | ConsultationStatus; label: string }[] = [
  { value: "", label: "All statuses" }, { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" }, { value: "contacted", label: "Contacted" },
  { value: "site_visit", label: "Site visit" }, { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" }, { value: "lost", label: "Lost" }, { value: "archived", label: "Archived" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Detroit" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const status = statuses.some((item) => item.value && item.value === params.status) ? params.status as ConsultationStatus : "";
  const query = (params.q || "").trim().toLowerCase().slice(0, 100);
  const client = createSupabaseAdminClient();
  let request = client.from("consultations").select("*").eq("submission_state", "complete").order("created_at", { ascending: false }).limit(100);
  if (status) request = request.eq("status", status);
  const { data, error } = await request;
  if (error) throw new Error("Consultations could not be loaded.");

  const filtered = (data || []).filter((item) => !query || [item.name, item.email, item.project_location].some((value) => value.toLowerCase().includes(query)));
  const ids = filtered.map((item) => item.id);
  const photoCounts = new Map<string, number>();
  if (ids.length) {
    const { data: photos } = await client.from("consultation_photos").select("consultation_id").in("consultation_id", ids);
    photos?.forEach((photo) => photoCounts.set(photo.consultation_id, (photoCounts.get(photo.consultation_id) || 0) + 1));
  }

  return <main className="admin-shell" id="main-content">
    <div className="admin-heading"><div><p className="eyebrow">Founder dashboard</p><h1>Consultations</h1><p>Private inquiry records. Email is a notification channel; this list is the system of record.</p></div><form action={signOutAction}><button className="button button-outline" type="submit">Sign out</button></form></div>
    <form className="admin-filters" method="get"><div><label htmlFor="q">Search name, email, or location</label><input defaultValue={params.q || ""} id="q" maxLength={100} name="q" type="search" /></div><div><label htmlFor="status">Status</label><select defaultValue={status} id="status" name="status">{statuses.map((item) => <option key={item.value || "all"} value={item.value}>{item.label}</option>)}</select></div><button className="button button-primary" type="submit">Apply filters</button></form>
    {filtered.length ? <div className="admin-table-wrap"><table className="admin-table"><caption className="sr-only">Consultations newest first</caption><thead><tr><th>Received</th><th>Customer</th><th>Project</th><th>Review</th><th>Status</th><th>Photos</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td>{formatDate(item.created_at)}</td><td><Link href={`/admin/consultations/${item.id}`}><strong>{item.name}</strong></Link><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : null}</td><td>{item.project_location}<span>{item.project_setting}</span></td><td>{item.review_preference}</td><td><span className={`status-badge status-${item.status}`}>{item.status.replace("_", " ")}</span></td><td>{photoCounts.get(item.id) || 0}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><h2>No consultations match this view.</h2><p>Clear the filters or check again after a new request is stored.</p></div>}
  </main>;
}
