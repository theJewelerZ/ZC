# Implementation Plan

## Phase 1 implementation record — July 23, 2026

Workstreams 0–5 are implemented and verified, except for founder-controlled
GitHub remote setup, approved logo/photography, real Resend delivery, Turnstile
credentials, and attorney/founder legal review. Workstream 6 is complete through
temporary Vercel production deployment and smoke testing at
<https://zarka-construction.vercel.app>. Custom domains were not added.
Workstream 7 has not begun and remains separately authorized.

The temporary deployment is intentionally non-indexable and the contact form is
in honest disabled mode until production credentials are supplied. See
`progress.md` and `LAUNCH_CHECKLIST.md` for the exact open gates.

## Workstream 0 — Inputs and repository foundation

1. Resolve or explicitly omit launch-blocking business values in
   `OPEN_QUESTIONS.md`.
2. Obtain GitHub and Vercel destinations and confirm the production owner.
3. Obtain temporary logo exports or approve the text fallback.
4. Initialize Git, create the GitHub repository, protect `main` as appropriate,
   and add a focused `.gitignore`.
5. Scaffold a stable Next.js App Router project with TypeScript, Tailwind,
   linting, tests, and the agreed Node/npm versions.
6. Create `.env.example`; never commit secrets.

**Dependencies:** founder/account access.

**Acceptance:** clean initial build; documented local commands; exact dependency
versions locked; no application secrets or invented business data.

**Verify:** install from lockfile, lint/typecheck/test/build, secret scan, clean
working tree.

**Commit:** `chore: initialize website foundation`

## Workstream 1 — Configuration and visual foundation

1. Implement brand tokens for all five approved colors, typography, spacing,
   radii, focus rings, and container widths.
2. Create typed business, navigation, services, related-project, and asset
   configuration.
3. Create `BrandMark` with light/dark/icon roles and text fallback.
4. Implement base metadata, canonical origin handling, font loading, skip link,
   and semantic layout.
5. Build reusable header, accessible mobile navigation, footer, buttons/links,
   form primitives, and minimal cards.

**Dependencies:** scaffold; temporary asset decision.

**Acceptance:** no hard-coded public business details outside configuration;
orange remains controlled; layout works without logo files or web fonts; mobile
menu is keyboard-operable.

**Verify:** typecheck, component tests, keyboard walkthrough, 320px/desktop
visual checks, missing-asset test.

**Commit:** `feat: establish brand and site shell`

## Workstream 2 — Homepage

1. Implement the approved section order and stable anchor IDs.
2. Build the hero with one primary and one secondary action.
3. Render approved services and visually distinguish conservative scope copy.
4. Give simulator construction a full section with spatial/build considerations.
5. Add Why Zarka and capability-led work without fictional projects.
6. Render the planning process, room-review paths, and future real-project
   image slots; do not render public software or product cards.
7. Add approved company context and final contact CTA.
8. Optimize responsive layout, section rhythm, images, and anchor offsets.

**Dependencies:** content approval, configuration, shell.

**Acceptance:** visitor can identify Zarka as a golf simulator room builder, understand the
room-planning difference, and reach the consultation path in one mobile scan; no unsupported claims.

**Verify:** content claim review; all internal/external links; headings and
landmarks; responsive screenshots; no horizontal overflow at 320px; image
dimensions/alt text; Lighthouse baseline.

**Commit:** `feat: build launch homepage`

## Workstream 3 — Contact experience

1. Implement the fields and enums specified in the architecture.
2. Add client affordances while retaining server-owned validation.
3. Add Turnstile, honeypot/timing signals, input limits, and chosen rate limiter.
4. Implement plain-text and escaped HTML Resend messages with correlation IDs,
   server-only recipient, verified sender, and visitor `reply-to`.
5. Add pending, inline error, error-summary, rate-limit, delivery-failure, and
   success states.
6. Add safe structured logs and production delivery runbook.
7. Track non-PII form events.

**Dependencies:** Resend/Turnstile accounts and keys, confirmed recipient,
chosen public fallback behavior.

**Acceptance:** valid submissions are delivered once; invalid/spam requests do
not send; visitors never see provider secrets/errors or a false success.

**Verify:** unit tests for normalization/schema/template escaping; integration
tests for validation, Turnstile, rate limit, provider success/failure; keyboard
and screen-reader check; real production inbox delivery and reply test.

**Commit:** `feat: add secure consultation form`

## Workstream 4 — Legal, SEO, and analytics

1. Add `/privacy` and `/terms` using clearly reviewable content that reflects
   actual form, analytics, hosting, and anti-spam processing.
2. Add per-route titles/descriptions, canonical URLs, Open Graph/Twitter data,
   icons, sitemap, robots, and factual JSON-LD.
3. Add the approved OG image/fallback.
4. Enable privacy-conscious analytics and the documented event names.
5. Verify legal copy with the founder and, when required, counsel.

**Dependencies:** actual implementation choices; business contact details;
approved assets.

**Acceptance:** metadata is unique; legal copy does not describe unimplemented
collection; structured data contains no invented address/phone/license/type.

**Verify:** view generated head/JSON-LD, social preview checks, sitemap/robots
requests, analytics debug view, no PII in event payloads.

**Commit:** `feat: add legal pages metadata and analytics`

## Workstream 5 — Quality gate

1. Run formatting check, lint, typecheck, unit/integration tests, and production
   build from a clean install.
2. Test current Chrome, Safari/WebKit, Firefox, and Edge where available.
3. Test common mobile/tablet/desktop sizes, 200% zoom, reduced motion, keyboard,
   screen-reader basics, and high contrast.
4. Audit accessibility and performance; resolve material issues.
5. Review every fact, link, asset right, and TODO. Confirm no internal TODO is
   rendered publicly.
6. Review security headers, form abuse paths, error logs, and secret boundaries.

**Acceptance:** required checks pass; no critical/serious accessibility issue;
no broken route/link; acceptable production Core Web Vitals baseline; launch
blockers documented.

**Verify:** store command output or CI evidence and complete the pre-deployment
checklist.

**Commit:** `test: complete launch readiness checks`

## Workstream 6 — Vercel deployment

1. Import the GitHub repository into the confirmed Vercel scope.
2. Configure framework/build settings and Preview/Production variables.
3. Deploy a preview, then promote/create the intended production deployment.
4. Test the temporary `vercel.app` production URL end to end, including a real
   contact message and analytics.
5. Add apex and `www` in Vercel and capture the exact requested DNS records.

**Dependencies:** passing quality gate; account access; verified sender domain.

**Acceptance:** production build is healthy at the temporary URL; rollback
deployment is known; both custom domains are assigned before DNS changes.

**Verify:** all routes/status codes, runtime logs, email delivery/reply,
Turnstile host configuration, analytics, headers, mobile smoke test.

**Commit:** normally none; record configuration evidence in the launch record
without committing secrets.

## Workstream 7 — GoDaddy cutover

Follow `DEPLOYMENT_AND_DOMAIN_CUTOVER.md` exactly:

1. Export/capture authoritative DNS and products; identify website records.
2. Preserve mail, SPF, DKIM, DMARC, verification, and other service records.
3. Replace only apex/www website targets with exact Vercel values.
4. Verify propagation, SSL, canonical redirect, routes, contact delivery, and
   analytics.
5. Monitor and either declare success or restore recorded prior website records.
6. Cancel the unwanted GoDaddy website subscription only after the written
   success gate; retain registration, DNS, and active email.

**Acceptance:** `www` serves Vercel over HTTPS; the apex redirects once to
`www`; mail and external services remain operational; rollback data is retained.

**Verify:** independent DNS resolvers, browser/network checks, Vercel status,
mail send/receive, form delivery, and at least one post-propagation recheck.

## Post-launch workstream

1. Connect Search Console and align Google Business Profile after NAP/service
   facts are confirmed.
2. Review analytics, logs, delivery, indexing, and Core Web Vitals.
3. Replace temporary logo assets with final vectors through the asset manifest.
4. Add approved project photography and portfolio content.
5. Prioritize Phase 2 from real inquiry and search evidence.

## Risks and controls

| Risk | Control |
| --- | --- |
| Missing business facts delay launch | Omit optional public values; block only unsafe/essential behavior |
| Temporary logo looks inconsistent | Limited approved variants, text fallback, manifest replacement |
| Form delivery fails | Pre-cutover production test, correlation IDs, truthful fallback, rollback |
| Spam or abuse | Server validation, Turnstile, honeypot/timing, rate limiting |
| Mail breaks during cutover | Record-level website changes only; preserve all MX/TXT and verify mail |
| DNS rollback is incomplete | Export zone and record exact before/after values and TTLs |
| Marketing overstates scope | Founder claim review and delivery classification |
| MVP becomes a platform build | Enforce roadmap exclusions and ADR approval for scope additions |

## Rollback boundaries

- Code: redeploy the last known-good Vercel deployment.
- Environment: restore recorded known-good variables without exposing secrets.
- Domain: restore only the confirmed previous apex/www website records.
- Contact: disable the form CTA or show an approved confirmed email only if
  delivery cannot be restored; never claim receipt.
- GoDaddy subscription: do not cancel it until rollback is no longer needed.


## Phase 3 — Narrow consultation operations

1. Version and dry-run the additive consultation schema, forced RLS, least
   privileges, transaction function, and private bucket.
2. Preserve public form validation/Turnstile/rate limiting, then create pending
   durable rows only after those checks.
3. Issue generated-path, one-object signed uploads; verify stored objects and
   signatures before atomic finalization.
4. Attempt founder/customer Resend messages only after storage; persist partial
   and failed notification results.
5. Protect /admin with Supabase Auth plus server email allowlist; implement only
   list, search/filter, detail, signed photos, status, and private notes.
6. Update privacy, environment/setup documentation, tests, and protected-preview
   verification. Do not merge or promote without founder approval.

Rollback keeps Production on its prior Vercel deployment and preserves stored
consultations; no automatic schema/bucket destruction is allowed.
