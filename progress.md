# Progress

**Current phase:** Phase 3 — consultation system implementation

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** phase-3/consultation-dashboard

**Last updated:** August 5, 2026

## Production status

Production remains on the prior approved release. This branch has not been
merged or promoted. DNS, nameservers, GoDaddy products, production email DNS,
and the canonical Vercel domain were not changed.

## Completed

- Updated local main to origin/main at 4a5a1ef and created the feature branch.
- Added official Supabase SSR/browser/server clients with strict secret
  separation.
- Created and applied additive migration 20260805000100 to the confirmed Zarka
  Construction project.
- Created consultations and consultation_photos with constraints, indexes,
  updated_at trigger, forced RLS, revoked browser privileges, transactional
  finalization, and private consultation-photos bucket.
- Replaced the public form flow with pending durable records, direct one-object
  signed uploads, stored-object/signature checks, atomic finalization, and
  cancellation/expiration cleanup.
- Added optional JPEG/PNG/WebP room photos: 10 files, 15 MiB each, 75 MiB total,
  thumbnails, captions, remove controls, progress states, errors, and retry.
- Added Resend founder notification and customer confirmation after persistence.
  Partial/failed notification state remains visible without losing the lead.
- Added Supabase magic-link Auth, no public registration, server email allowlist,
  private /admin list/detail, short-lived signed images, status, and notes.
- Updated privacy, robots, CSP, no-store/noindex behavior, environment template,
  and backend/admin/data/retention/setup documentation.
- TypeScript and production build pass. Vitest: 47 tests pass across 16 files.
- Remote migration history and table creation verified. Both new tables are
  empty pending preview testing.

## Security decisions

- Supabase is the consultation system of record; Resend is notification only.
- Direct anonymous table and storage access is denied.
- Public writes use server validation and a server-only service credential.
- Founder access requires both a valid Supabase session and
  ADMIN_ALLOWED_EMAILS membership on every page and mutation.
- Private photos use generated paths, one-object signed uploads, and five-minute
  signed dashboard reads.
- No consultation PII is sent to analytics or routine logs.

## Current blockers

- Founder must supply the exact ADMIN_ALLOWED_EMAILS value.
- The same email must exist as a Supabase Auth user.
- Supabase Auth redirect URL must include the final protected preview callback.
- Branch-specific Vercel Preview variables can be added after this branch is
  pushed; the first attempt correctly failed because the branch did not yet
  exist remotely.
- A real no-photo/photo submission and both email deliveries require the
  configured preview and founder Auth setup.
- Lighthouse and responsive browser review remain to be completed on the
  protected preview.

## Immediate next action

Complete documentation/quality checks, commit and push this branch, configure
branch-scoped Preview variables without exposing values, deploy a protected
preview, then perform authenticated founder review. Do not merge or promote.
