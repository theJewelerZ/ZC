# Projects and Inside the Build

Projects are the operational source of truth. Public-facing pages call them
Builds, but code and database objects retain the `project` name.

## Lifecycle

Consultation -> Project -> Updates and media -> Completion -> Case study ->
Portfolio -> Future referral.

Operational status, project stage, public Build status, and publication status
are independent. Changing one never implies a change to another.

## Private records

Private records include exact addresses, internal scope, notes, capture
sessions, original media, customer information, and unapproved updates. Browser
clients cannot query project tables directly. Founder operations use
server-authorized service-role calls behind the authenticated allowlist.

## Public projection

`/projects` and `/projects/[slug]` read only projects and updates explicitly
marked published, plus approved photos copied into the public media bucket.
Inside the Build never reads field notes or candidate-only media.

## Phase 2 extension

Field Mode adds private capture sessions. A session can update the internal
project stage after successful persistence, but never changes public Build or
publication status. Its note remains operational evidence, not public copy.

## Field Mode integration

Field Mode documents an existing project; it never creates a duplicate project record. Capture sessions attach private notes and private project photos to that source of truth. A successful session may update the current internal stage. It cannot change operational status, public Build status, project publication, or formal public update copy. Admin review shows field provenance and candidate state before any editorial decision.
## Editorial Build journal

Inside the Build is a curated project journal, not a public construction log. A Build story progresses through an honest starting point, Zarka's role, ordered editorial Milestones, an outcome when complete, and useful planning takeaways. The journal should answer what existed, what changed, why it mattered, what problem was solved, what experience the work enables, and what a future customer can learn.

The private project remains authoritative. Milestones are the public interpretation of selected `project_updates`; selected public photographs are grouped under their milestone and ordered intentionally. Operational statuses, approval labels, candidate states, storage paths, private notes, exact addresses, and customer information never enter the public projection.

Founder-selected cover and Open Graph images are explicit roles, not automatic first-photo choices. When neither is selected, the public experience uses a deliberate typography-led treatment rather than guessing. Public derivatives are resized, normalized, and stripped of camera and location metadata before publication.

Completed Builds remain living project records. Outcome, planning takeaways, future case-study eligibility, portfolio eligibility, and planning-guide opportunities derive from the project rather than becoming competing records. This release preserves those seams without creating new public products.

A Build-specific consultation link carries only the published slug. The server resolves that slug back to the approved project and records attribution without exposing internal project data. The public invitation is “Ask about a Build like this,” not a product package or automated quote.

## Phase 3 editorial refinement

Public Build detail pages use a stronger editorial hierarchy: quiet status and stage metadata, founder-approved photography with contextual captions, progress updates presented as a journal, a purposeful starting state, and a consultation close. Open Graph metadata may use the first approved public photo. No private or candidate media is eligible.
