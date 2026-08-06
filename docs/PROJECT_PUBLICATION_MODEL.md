# Project Publication Model

## Default state

Every project, update, field note, capture session, and original photograph is
private by default. No background process or Field Mode action publishes.

## Photograph states

- **Private:** operational media with no publication recommendation.
- **Candidate:** private media worth reviewing later.
- **Approved:** founder-reviewed media with caption and alt text.
- **Published:** an approved, separate copy in the public bucket.
- **Rejected:** retained or removed according to the founder's private-media
  decision; never public.

Phase 2 Field Mode can set only Private or Candidate. The full project admin
workflow remains the only path to approval and publication.

## Storage boundary

Originals use generated object names in `project-media-private`. Approved
publication creates a separate object in `project-media-public`. Public pages
never receive private storage paths or signed original URLs.

## Text boundary

Field notes and draft captions are not formal public updates. Public progress
copy requires a separately approved project update. Candidate flags, capture
timestamps, and internal stage changes are not public metadata.

## Correction and unpublish

Unpublishing removes the public copy while retaining the private original.
Publication failures preserve the private original and saved metadata.

## Field candidate lifecycle

`publication_candidate` is not a public state. Field Mode may set only private or candidate. Both remain `visibility = private` and `approval_status = pending`. Full admin review requires caption and alt text, clears candidate status, marks approval, and creates the separate public media object. The database constraint prevents candidate media from also being public or approved.
## Editorial publication contract

Public storytelling is milestone-based rather than log-based. Database and code retain `project_updates`, while public and founder-facing editorial controls call them Milestones. Each published milestone requires a clear title, concise story, explicit ordering, and only the photographs intentionally assigned to it.

A public Build requires recorded publication permission. Permission status, method, evidence reference, and private notes remain operational data. Withdrawal immediately unpublishes the Build and its milestones and removes public media copies without deleting private source records.

Public media is never the uploaded original. Publication creates a metadata-stripped, orientation-normalized, color-normalized JPEG derivative at an immutable generated path. Only derivatives with recorded output metadata can enter the public projection. A selected cover or social image must belong to the same Build and remain published, approved, and sanitized; otherwise the selection is cleared automatically.

Planned dates and actual dates are separate. Public pages label planned dates honestly and use actual completion only after it is recorded. Completion can derive future case-study, portfolio, and planning-guide candidates from the same project, but those future products do not duplicate project truth and are not implemented in this phase.

## Mission Control publication summaries

Mission Control may count and link to candidate photos, unpublished updates, and published Builds, but it cannot publish content by itself. Candidate remains private. Existing guarded project, photo, and update actions remain the only publication mutations. The dashboard therefore changes visibility of operational work, not public visibility of data.
