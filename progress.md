# Progress

**Current phase:** Phase 3 — protected consultation-system authentication review

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** phase-3/consultation-dashboard

**Last updated:** August 5, 2026

## Production status

Production remains on the prior approved release. This branch is not merged or
promoted. DNS, nameservers, GoDaddy products, production email DNS, and the
canonical Vercel domain were not changed.

## Implemented

- Durable Supabase consultation records, private direct photo uploads, Resend
  notifications, Turnstile/rate limiting, and founder-only dashboard remain in
  place without widening the CRM scope.
- Response-bound PKCE callback and sign-out handlers preserve Supabase cookies.
- Preview founder authentication now uses the stable Git branch hostname instead
  of deployment-specific Preview hostnames.
- Branch-scoped `ADMIN_AUTH_ORIGIN` is configured in Vercel Preview; Production
  remains request-origin based.
- Privacy-safe callback and admin-guard stages distinguish origin mismatch,
  missing verifier, expired/used link, configuration, session-cookie, user, and
  allowlist outcomes without logging PII, codes, tokens, URLs, or cookie values.
- A discreet `Founder Login` link is present in the public footer and mobile
  navigation. Responsive navigation now presents a visible Menu/Close label.
- Login errors provide useful, bounded founder-facing recovery instructions.

## Root cause confirmed

A server-only Supabase `generateLink` diagnostic requested the stable Preview
callback without sending or exposing a magic link. Supabase returned the
Production site root instead of the requested callback. This confirms the stable
Preview callback is not currently accepted by Auth URL Configuration, or the
Magic Link template ignores `RedirectTo`. The resulting cross-host return cannot
carry the Preview PKCE verifier cookie and causes the apparent login loop.

Required exact Supabase Additional Redirect URL:

`https://zarka-construction-git-phase-9e8031-matthews-projects-7e2a9d39.vercel.app/auth/callback`

## Verification

- ESLint passes.
- TypeScript passes.
- 67 Vitest tests across 21 files pass, including contact-flow regressions.
- Callback coverage includes stable-origin selection, missing verifier, expired
  code, session-cookie write, allowlist, host-only cookies, and open redirects.
- Navigation coverage confirms the shared root header/footer, public routes, one
  Founder Login utility destination, and visible responsive menu label.
- Previous controlled Preview checks verified durable no-photo and photo
  consultations, private Storage metadata, both notification acceptances, and
  cleanup. Authenticated dashboard/photo review must be repeated after login.

## Stable protected Preview

Branch URL:
<https://zarka-construction-git-phase-9e8031-matthews-projects-7e2a9d39.vercel.app>

Founder login:
<https://zarka-construction-git-phase-9e8031-matthews-projects-7e2a9d39.vercel.app/admin/login>

Current verified code deployment: `dpl_4QCVexPcfuWT9znzXTY18hVdsJbi`.
The stable alias updates on every branch push without changing its hostname.

Live route checks returned 200 for `/`, `/simulator-construction`, `/contact`,
`/privacy`, `/terms`, and `/admin/login`. The live shell contains the Founder
Login link and responsive Menu label. A commit-host callback is rejected as a
callback mismatch; the stable callback reports a missing verifier distinctly.

## Merge blockers

- Add and verify the exact stable callback in Supabase Auth URL Configuration.
- Verify the Magic Link email template honors the requested redirect.
- Founder completes newest-link login, refresh, second-tab, and sign-out checks.
- Founder verifies dashboard list/detail, status/notes, and signed photo view.
- Repeat one no-photo and one photo consultation on the final Preview and confirm
  durable persistence plus founder/customer notifications.
- Complete founder responsive review at 320, 375, 768, 1024, and 1440px.

## Immediate next action

Deploy the current branch through the Vercel Git integration. Add the exact stable
callback in Supabase, verify it is preserved, then complete the founder login and
consultation workflow. Do not merge or promote until every merge blocker passes.
