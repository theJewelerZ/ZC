# Progress

**Current phase:** Phase 2 - Field Mode and PWA implementation

**Roadmap maturity:** 3/10 (Phase 1 is operational; Phase 2 production evidence pending)

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository / branch:** <https://github.com/theJewelerZ/ZC> / `main`

**Last updated:** August 6, 2026

## Operational foundation

- Phase 0 public website, consultation persistence, private consultation photos, Resend notifications, founder authentication, and consultation dashboard are live.
- Phase 1 Projects and Inside the Build is operational.
- The first public Build is `/projects/albatross-golf-mason`.
- Project records, original media, updates, and field notes remain private unless the founder explicitly publishes eligible content through the full admin workflow.

## Phase 2 implementation

- Added founder-only `/field`, dynamically rendered with no-store and noindex controls.
- Added active, upcoming, and recently updated Build views plus mobile Quick Capture.
- Added direct private uploads for up to 20 JPEG, PNG, or WebP files at 15 MB each.
- Added capture sessions, one private note per session, existing-stage assignment, and independent `publication_candidate` classification.
- Added per-file states and retry authorization; partial success is reported honestly.
- Added admin review of field sessions, private notes, timestamps, counts, stages, and candidate badges.
- Added the installable Zarka Field manifest, approved brand icons, `/field` start URL, and phone installation help.
- Added safe post-login return to `/field`; `ADMIN_ALLOWED_EMAILS` remains authoritative.
- Kept Field Mode online-first. No service worker, private-response cache, offline write queue, or background synchronization was added.

## Security and publication boundary

Field Mode never mutates project publication status, public Build status, or photo visibility. Candidate media remains private/pending. Only the full admin photo review may create a separately stored public copy after caption, alt text, and founder approval. Field notes are not selected by public repositories.

## Verification to date

- Lint: pass.
- TypeScript: pass.
- Vitest: 34 files / 120 tests pass.
- Production build: pass; `/field` and Field APIs are dynamic.
- Linked migration dry run contained only `20260806000100_create_field_capture_sessions.sql`; it is now applied and local/remote history match.
- Linked database lint: no schema errors.
- Live RLS/storage check: anonymous table reads return 401; private-bucket listing exposes zero objects; service-role access succeeds.
- `npm audit`: zero vulnerabilities.

## Remaining production gate

- Field Mode production deployment `dpl_4RYZJGjzfDcnyLAoZ1uZpRD5APsH` reached Ready and passed unauthenticated route, manifest, robots, icon, public Build, same-origin, and cross-origin smoke checks.
- Lighthouse after responsive public-project image optimization: homepage 97/100/100/100 locally; deployed Build page 100/100/100/100.
- Verify `/field`, capture, retry, candidate review, publication boundary, and sign-out on the founder's real phone.
- Automated 320, 375, and 768 pixel review found no horizontal overflow; visible controls meet the 44-pixel target. Complete PWA installation and real camera capture on the founder phone.
- Record real field failures before deciding whether Phase 2 needs offline synchronization.

## Immediate next action

Verify the final image-optimized production deployment, then perform the founder phone test. Do not begin Phase 3 Founder Dashboard analytics or Phase 4 Site Controls.