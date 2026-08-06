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
## Mission Control publication summaries

Mission Control may count and link to candidate photos, unpublished updates, and published Builds, but it cannot publish content by itself. Candidate remains private. Existing guarded project, photo, and update actions remain the only publication mutations. The dashboard therefore changes visibility of operational work, not public visibility of data.
