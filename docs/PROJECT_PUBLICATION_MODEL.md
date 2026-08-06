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
