# Founder Mission Control

## Purpose

`/admin` is the founder's operational starting point. It answers what needs attention, what is active, what is coming next, what is waiting for review, and the fastest useful next action.

## Data architecture

Mission Control is a server-rendered, founder-authorized read model derived from existing Supabase records. Queries are bounded, run in parallel, and return only the fields required by the dashboard. The page is dynamic, `no-store`, and `noindex`.

No summary table, background job, permanent audit log, or analytics warehouse is added in Phase 3. Recent activity is derived from existing timestamps. Counts are operational facts, not estimates.

## Sections

1. Operational summary
2. Attention required
3. Active Builds
4. Upcoming Builds
5. Inside the Build publishing queue
6. Consultations
7. Recent activity
8. Quick actions and system health

Sections with no useful content are omitted or use one concise, actionable empty state.

## Attention rules

An attention item appears only when the founder can act on it. Phase 3 rules include new consultations, notification failures, candidate photos, unpublished update drafts, active Builds without a recent update, upcoming Builds beginning soon, and incomplete field captures. A missing publication-permission warning is not inferred because the current data model does not contain an authoritative permission field.

## Analytics boundary

Mission Control includes reliable Supabase-derived operational metrics: consultations received and completed, active and upcoming Builds, published Builds, candidate photos, and recently published updates. Vercel Analytics page views are not queried because the current integration does not provide an application-side dashboard data source. No values are scraped or fabricated.

## Security

- `requireAdmin()` authorizes every request before data access.
- Service-role access remains server-only.
- No private response is statically generated or publicly cached.
- Health indicators expose availability booleans, never values or raw provider errors.
- No consultation content, project private data, or PII is sent to analytics.

## Explicit exclusions

No CRM pipeline, charts, Site Controls, customer accounts, scheduling system, audit-log subsystem, or custom analytics infrastructure is included.
