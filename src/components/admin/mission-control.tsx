import Link from "next/link";
import type { MissionBuild, MissionControlModel } from "@/lib/admin/mission-control-model";
import { label } from "@/lib/projects/schema";

function formatDate(value: string | null, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return value ? new Intl.DateTimeFormat("en-US", options).format(new Date(value)) : "Not set";
}

function BuildCard({ build, upcoming = false }: { build: MissionBuild & { daysUntilStart?: number | null }; upcoming?: boolean }) {
  return <article className="mission-build-card">
    <div className="mission-build-heading"><div><p className="mission-meta">{build.publicLocation ?? "Location not set"}</p><h3>{build.internalName}</h3></div><span className={`status-badge status-${build.operationalStatus}`}>{label(build.operationalStatus)}</span></div>
    <dl className="mission-build-facts">
      <div><dt>Stage</dt><dd>{label(build.projectStage)}</dd></div>
      <div><dt>{upcoming ? "Starts" : "Schedule"}</dt><dd>{upcoming && build.daysUntilStart !== null && build.daysUntilStart !== undefined ? (build.daysUntilStart === 0 ? "Today" : `${build.daysUntilStart} days`) : `${formatDate(build.startedOn)} - ${formatDate(build.completedOn)}`}</dd></div>
      <div><dt>Latest capture</dt><dd>{formatDate(build.latestCaptureAt)}</dd></div>
      <div><dt>Photos</dt><dd>{build.privatePhotoCount} private / {build.candidatePhotoCount} candidate</dd></div>
      <div><dt>Published updates</dt><dd>{build.publishedUpdateCount}</dd></div>
      <div><dt>Public page</dt><dd>{label(build.publicationStatus)}</dd></div>
    </dl>
    <div className="mission-actions" aria-label={`Actions for ${build.internalName}`}><Link href={`/admin/projects/${build.id}`}>Open Build</Link><Link href={`/field?project=${build.id}#capture`}>Capture Progress</Link><Link href={`/admin/projects/${build.id}#project-photography`}>Review Photos</Link><Link href={`/admin/projects/${build.id}#progress-updates`}>Add Update</Link>{build.publicationStatus === "published" ? <Link href={`/projects/${build.slug}`} target="_blank">View Public Page</Link> : null}</div>
  </article>;
}

export function MissionControl({ data }: { data: MissionControlModel }) {
  const nextBuild = data.activeBuilds[0] ?? data.upcomingBuilds[0] ?? null;
  const statusOrder = ["new", "reviewing", "contacted", "site_visit", "proposal", "won"] as const;
  return <>
    <header className="mission-hero"><div><p className="eyebrow">Founder Mission Control</p><h1>Good work starts with a clear next move.</h1><p>{data.attention.length ? `${data.attention.length} operational ${data.attention.length === 1 ? "item needs" : "items need"} attention.` : "Everything requiring review is currently clear."} {data.metrics.activeBuilds} active and {data.metrics.upcomingBuilds} upcoming {data.metrics.activeBuilds + data.metrics.upcomingBuilds === 1 ? "Build is" : "Builds are"} in the system.</p></div><Link className="button button-primary" href={nextBuild ? `/field?project=${nextBuild.id}#capture` : "/admin/projects/new"}>{nextBuild ? "Capture Progress" : "Create Build"}</Link></header>

    <section aria-labelledby="operational-overview" className="mission-metrics"><h2 className="sr-only" id="operational-overview">Operational overview</h2><article><strong>{data.metrics.activeBuilds}</strong><span>Active Builds</span></article><article><strong>{data.metrics.upcomingBuilds}</strong><span>Upcoming Builds</span></article><article><strong>{data.metrics.consultations7Days}</strong><span>Consultations / 7 days</span></article><article><strong>{data.metrics.candidatePhotos}</strong><span>Photos to review</span></article></section>

    <section aria-labelledby="attention-title" className="mission-section mission-attention"><div className="mission-section-heading"><div><p className="eyebrow">Priority</p><h2 id="attention-title">Attention Required</h2></div></div>{data.attention.length ? <div className="mission-attention-list">{data.attention.map((item) => <Link className={`mission-attention-item priority-${item.priority}`} href={item.href} key={item.id}><span className="mission-count">{item.count}</span><span><strong>{item.title}</strong><small>{item.description}</small></span><span aria-hidden="true">Review</span></Link>)}</div> : <p className="mission-clear">Everything requiring review is currently clear.</p>}</section>

    {data.activeBuilds.length ? <section aria-labelledby="active-builds-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">In progress</p><h2 id="active-builds-title">Active Builds</h2></div><Link href="/admin/projects">All Builds</Link></div><div className="mission-build-list">{data.activeBuilds.map((build) => <BuildCard build={build} key={build.id}/>)}</div></section> : <section className="mission-section"><h2>Active Builds</h2><p className="mission-empty">No Builds are currently marked active.</p></section>}

    {data.upcomingBuilds.length ? <section aria-labelledby="upcoming-builds-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">On the schedule</p><h2 id="upcoming-builds-title">Upcoming Builds</h2></div></div><div className="mission-build-list">{data.upcomingBuilds.map((build) => <BuildCard build={build} key={build.id} upcoming/>)}</div></section> : null}

    <div className="mission-two-column">
      <section aria-labelledby="publishing-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">Inside the Build</p><h2 id="publishing-title">Publishing queue</h2></div></div><dl className="mission-queue"><div><dt>Public Builds</dt><dd>{data.publishing.publishedBuilds}</dd></div><div><dt>Candidate photos</dt><dd>{data.publishing.candidatePhotos}</dd></div><div><dt>Unpublished updates</dt><dd>{data.publishing.draftUpdates}</dd></div><div><dt>Builds without public activity</dt><dd>{data.publishing.buildsWithoutPublicActivity.length}</dd></div></dl><div className="mission-actions"><Link href="/admin/projects?review=candidates">Review Candidates</Link><Link href="/admin/projects">Draft Update</Link><Link href="/projects" target="_blank">View Inside the Build</Link></div></section>
      <section aria-labelledby="consultations-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">New business</p><h2 id="consultations-title">Consultations</h2></div><Link href="/admin/consultations">Review all</Link></div><div className="mission-consultation-counts">{statusOrder.map((status) => <div key={status}><strong>{data.consultationCounts[status]}</strong><span>{label(status)}</span></div>)}</div>{data.recentConsultations.length ? <ul className="mission-record-list">{data.recentConsultations.map((item) => <li key={item.id}><Link href={`/admin/consultations/${item.id}`}><strong>{item.name}</strong><span>{item.projectLocation}</span><time dateTime={item.completedAt ?? item.createdAt}>{formatDate(item.completedAt ?? item.createdAt)}</time></Link></li>)}</ul> : <p className="mission-empty">No consultation requests are currently in the system.</p>}</section>
    </div>

    <div className="mission-two-column">
      <section aria-labelledby="activity-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">Latest</p><h2 id="activity-title">Recent Activity</h2></div></div>{data.recentActivity.length ? <ol className="mission-activity">{data.recentActivity.map((activity) => <li key={activity.id}><span aria-hidden="true"/><div><strong>{activity.label}</strong><Link href={activity.href}>{activity.detail}</Link></div><time dateTime={activity.occurredAt}>{formatDate(activity.occurredAt, { dateStyle: "medium", timeStyle: "short" })}</time></li>)}</ol> : <p className="mission-empty">Activity will appear as consultations and Builds move forward.</p>}</section>
      <section aria-labelledby="quick-actions-title" className="mission-section"><div className="mission-section-heading"><div><p className="eyebrow">Move work forward</p><h2 id="quick-actions-title">Quick Actions</h2></div></div><div className="mission-quick-actions"><Link className="button button-primary" href="/field#capture">Capture Progress</Link><Link className="button button-outline" href="/admin/projects/new">Create Build</Link><Link className="button button-outline" href="/admin/consultations">Review Consultations</Link><Link className="button button-outline" href="/admin/projects">Add Project Update</Link><Link className="button button-outline" href="/admin/projects?review=candidates">Review Candidate Photos</Link><Link className="button button-outline" href="/" target="_blank">View Public Site</Link></div><SystemHealth data={data}/></section>
    </div>
  </>;
}

function SystemHealth({ data }: { data: MissionControlModel }) {
  const health = [
    ["Supabase", process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "Available" : "Configuration needed"],
    ["Resend", process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_RECIPIENT_EMAIL ? "Available" : "Configuration needed"],
    ["Turnstile", process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? "Available" : "Configuration needed"],
    ["Search indexing", process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === "true" ? "Enabled" : "Disabled"],
    ["Last consultation", formatDate(data.lastConsultationAt)], ["Last field capture", formatDate(data.lastFieldCaptureAt)], ["Notification issues", String(data.notificationFailureCount)],
  ];
  return <div className="mission-health"><h3>System health</h3><ul>{health.map(([name, value]) => <li key={name}><span>{name}</span><strong>{value}</strong></li>)}</ul></div>;
}
