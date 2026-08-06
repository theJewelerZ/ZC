# Progress

**Current phase:** Phase 1 â€” Projects and Inside the Build implementation

**Roadmap maturity:** 2/10 (implementation in progress; operating evidence still required)

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Branch:** `main`

**Last updated:** August 5, 2026

## Completed in this implementation

- Added the additive project lifecycle schema for projects, updates, and photos.
- Separated operational status, project stage, public Build status, and publication state.
- Added private-original and approved-public project media buckets.
- Enforced forced RLS and denied direct anonymous/authenticated table access.
- Added founder Dashboard, Consultations, Projects, project creation, editing, updates, media review, and explicit publish/unpublish controls.
- Added direct-to-private-storage founder photo uploads with generated object paths.
- Added public `/projects` and `/projects/[slug]` Inside the Build routes.
- Added conditional homepage Inside the Build content; it renders only when founder-featured published Builds exist.
- Added published Build URLs to the sitemap while excluding all admin routes.
- Kept customer-facing language as Builds while retaining projects internally.

## Publication boundary

Every project, update, and photo begins private. Public project summaries require explicit founder publication. Updates are individually published. A public photograph requires a completed private upload, founder approval, caption, alt text, and a separate public storage copy. Exact addresses, internal scope, notes, consultation data, and private originals are never selected by public repositories.

## Verification

Application lint, TypeScript, 94 existing tests, 3 new migration tests, and production build pass. Linked Supabase lint reports no schema errors. The migration dry run contains only `20260805000200_create_project_lifecycle.sql`.

## Remaining launch work

- Apply the reviewed additive migration to the linked Supabase project.
- Exercise create/upload/approve/publish/unpublish against production as founder.
- Complete responsive, accessibility, and Lighthouse browser review after deployment.
- Add Mason Simulator Environment and Social Golfer Simulator Environment privately when the founder is ready; neither is seeded or published automatically.
- Establish documented media-rights confirmation before publishing real customer photography.

## Phase 1 exit criteria

Phase 1 is not complete until real Builds are documented, founder publishing is proven, approved photography is operating, and a completed Build produces reusable proof. Phase 2 Field Mode remains deferred.

## Immediate next action

Apply the additive migration, push the verified commit, monitor Vercel production, and complete the founder publication smoke test.
## Founder editor production follow-up — August 6, 2026

- Removed corrupted breadcrumb/separator characters from the project editor.
- Added explicit save/publication/photo confirmation messages.
- Moved Project photography directly below Project information and gave the private uploader a clear upload control treatment.
- Confirmed the founder-created project remains private and is not homepage-featured unless separately published and selected.