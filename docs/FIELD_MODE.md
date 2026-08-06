# Field Mode

## Purpose

Field Mode is the founder-only, phone-first capture surface at `/field`. It is
designed to make organized project documentation faster than using an
unstructured camera roll.

## Online-first workflow

1. Authenticate with the existing founder account.
2. Select an active or upcoming project.
3. Choose the internal project stage.
4. Add an optional private note.
5. Capture or select up to 20 JPEG, PNG, or WebP images.
6. Optionally caption each image and mark it Private or Public candidate.
7. Upload directly to private Supabase Storage.
8. Verify each stored object and finalize the capture session.
9. Update the internal project stage only after durable finalization.

## Privacy and publication

All uploads remain private. Candidate means “review later,” not approved or
public. Notes never enter public project queries. Public Build content changes
only through the existing full-admin publication workflow.

## Failure behavior

Selections remain in the current browser session while the page is open.
Per-file states distinguish ready, uploading, uploaded, and failed. A failed
file can request fresh upload authorization and retry. Partial completion is
recorded honestly. Closing the page before finalization can abandon a pending
session; bounded cleanup removes abandoned objects and marks expired sessions/photos failed for operational evidence.

## Security

`/field` is dynamic, no-store, noindex, and server-authorized. All mutations
verify the authoritative Supabase user and `ADMIN_ALLOWED_EMAILS`, enforce same
origin, validate project and photo identifiers, generate storage paths on the
server, and reject cancelled or archived projects.

## Explicit exclusions

No offline writes, background sync, customer accounts, crew roles, analytics,
CRM behavior, public auto-publishing, CapProof/Bid Desk sync, or native mobile
application is included.

## Phase 3 presentation refinement

Field Mode keeps the same online-first capture architecture. Direct Mission Control actions can preselect the intended Build through a validated existing project identifier; server capture authorization remains authoritative. Candidate/private wording, completion feedback, touch targets, and high-contrast surfaces follow the shared premium experience tokens. No offline synchronization or background queue was added.
