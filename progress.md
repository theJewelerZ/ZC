# Progress

**Current phase:** Phase 3.5 - Premium Build Sharing

**Roadmap maturity:** 4/10 (Phase 3 operational; Phase 3.5 deployed, founder acceptance pending)

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository / branch:** <https://github.com/theJewelerZ/ZC> / `main`

**Last updated:** August 6, 2026

## Operational state

- Phase 0 marketing, consultation persistence, founder authentication, and consultation review are operational.
- Phase 1 Projects and Inside the Build is operational; `/projects/albatross-golf-mason` is the first public Build.
- Phase 2 Field Mode and the Zarka Field PWA are operational and founder-verified on Android.
- Private notes and original/candidate media remain private until explicit founder publication through the full admin workflow.

## Phase 3 completed locally

- Replaced the minimal `/admin` count view with Founder Mission Control.
- Added actionable attention rules, active/upcoming Build summaries, publication queues, consultation summaries, recent derived activity, quick actions, and safe system health.
- Used five bounded parallel Supabase reads and no database migration.
- Limited analytics to reliable Supabase operational data; Vercel page views are not fabricated or scraped.
- Consolidated project-owned design tokens for spacing, surfaces, typography, status, focus, buttons, and touch targets.
- Standardized private navigation around Mission Control, Consultations, Builds, Field Mode, Public Site, and Sign Out.
- Added mobile admin record layouts without horizontal table scrolling.
- Connected Build-specific Mission Control actions to Field Mode preselection and exact admin review anchors.
- Refined public Build pages with editorial metadata, photography context, progress hierarchy, starting state, consultation CTA, and approved-photo Open Graph support.
- Preserved online-first Field Mode, PWA architecture, RLS, explicit publication, and no-store/noindex boundaries.
- Reframed public Build updates as editorial Milestones with ordered, intentionally grouped photography.
- Added recorded publication permission, separate planned/actual dates, editorial starting-point/role/outcome/takeaway fields, and founder-selected cover/social image roles.
- Added metadata-stripped, normalized public image derivatives while preserving private originals; reprocessed and verified the three current Albatross public images.
- Connected Build-specific consultation context without exposing internal project data.
- Preserved the founder-authored Story We Preserve and adopted the principle that the software should gradually disappear behind the work.
## Phase 3.5 completed locally

- Added one reusable, narrowly hydrated public Build share control.
- Build cards provide View the Build and Share without changing their editorial role.
- Build pages provide native Share, Copy Link, Post to X, and the existing Build-context consultation action.
- Canonical share URLs derive from trusted configuration; no private project identifiers or deployment hostnames enter the client.
- Native cancellation is neutral, clipboard denial exposes a selectable URL, and status changes are announced accessibly.
- Future Build publication requires founder-selected cover and social-preview images; existing Builds retain the branded fallback until the founder selects both.
- Added no database migration, social SDK, Meta integration, analytics infrastructure, account, comment, like, follow, notification, or subscription.
- Added an accessible, dismissible toast after Save Build; the one-time success state remains visible regardless of scroll position and does not replay on refresh.

## Current verification

- Lint: pass.
- TypeScript: pass.
- Tests: 40 files / 146 tests pass.
- Production build: pass; private routes remain dynamic.
- Linked database lint: no schema errors; local and remote migration history match through `20260806000200`.
- Live anonymous RLS checks: operational table reads denied; private storage listing exposes zero objects.
- Local production Lighthouse after editorial refinement: homepage 98/100/100/100; Inside the Build 100/100/100/100; Albatross Build 100/100/100/100.
- Phase 3.5 local production Lighthouse: homepage 98/100/100/100; Inside the Build 100/100/100/100; Albatross Build 98/100/100/100, with zero layout shift.
- Native-share and clipboard behavior are covered by deterministic tests; physical Android share-sheet acceptance remains a founder verification step.
- Founder login Lighthouse: 98 performance, 100 accessibility, 100 best practices; SEO 69 is expected for an intentionally noindexed private route.
- Synthetic Mission Control review: 100 accessibility on mobile and desktop; verified compact private navigation, no logo overlap, and no horizontal overflow at the captured mobile viewport.
- Editorial production deployment `dpl_Enmm7nKfxqbWbtewq5dnMixyuQjc` is Ready and production smoke checks pass; founder editorial acceptance remains.
- Phase 3.5 production sharing is deployed; live cards, Build actions, canonical metadata, X intent, privacy boundaries, and apex redirect pass smoke testing.

## Blockers

None currently. Vercel Analytics does not provide a supported application-side reporting source in the current architecture, so public page-view metrics are intentionally deferred.

## Immediate next action

Founder verifies native sharing on Android, then selects the Albatross cover and social-preview images in the Build workspace.

## Next recommended implementation prompt

After founder acceptance of sharing, define the narrow Phase 4 Site Controls scope from measured publishing needs. Do not add subscriptions, notifications, or a general CMS.
