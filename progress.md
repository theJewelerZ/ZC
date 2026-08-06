# Progress

**Current phase:** Phase 3 — founder password-authentication production readiness

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Branch:** `main`

**Last updated:** August 5, 2026

## Production status

`main` matched `origin/main` at commit `95cb441d8f3496a2b8768b09c1d0f4d2dd5c8d85`
before this narrow change began. The password-authentication work is ready for
its authorized commit and push. Production Supabase and Turnstile variables are
configured. DNS, nameservers, GoDaddy products, consultation records, Storage
objects, and Supabase Auth users were not destructively changed.

## Implemented locally

- Replaced routine magic-link access with email-and-password sign-in through a
  same-origin, rate-limited Route Handler.
- Preserved response-bound `@supabase/ssr` cookie writes, authoritative
  `auth.getUser()` verification, and `ADMIN_ALLOWED_EMAILS` authorization.
- Added authenticated `/admin/set-password` and a 14-character mixed-character
  password policy with confirmation and accessible show/hide controls.
- Added generic `/admin/forgot-password`, PKCE `/auth/recovery`, a ten-minute
  recovery marker, and authenticated `/admin/reset-password`.
- Recovery signs the founder out after a successful password change and returns
  to routine password login. Missing, expired, reused, cross-host, and
  unauthorized recovery states fail safely.
- Retained `/auth/callback` only for already-issued setup/legacy email links;
  magic-link login is not presented as the normal interface.
- Added password/security access from the private dashboard while retaining the
  discreet public `Founder Login` link.
- Added same-origin enforcement, bounded in-memory abuse protection layered on
  Supabase provider rate limits, generic credential/recovery responses, and
  privacy-safe stage-only diagnostics.
- No schema migration, user creation, RLS change, consultation mutation, or
  Storage change is part of this work.

## Verification completed

- ESLint passes.
- Strict TypeScript passes.
- 94 Vitest tests across 27 files pass.
- Production build passes.
- `npm audit` reports zero vulnerabilities.
- Route coverage includes successful password login, response cookies, generic
  invalid/unknown-account failures, allowlist rejection, rate limiting,
  password policy, confirmation mismatch, setup authorization, recovery PKCE,
  recovery marker enforcement, expired/reused links, sign-out, session guard,
  host-only cookies, and open-redirect rejection.
- The founder received a recovery email through Resend SMTP, reset the password
  with a visible success confirmation, signed out, and successfully signed in
  with the new password.
- Required Supabase and Turnstile variable names are configured for both Vercel
  Preview and Production.
- The latest configuration-only Production redeployment is Ready; it still
  contains the prior `origin/main` commit until this change is pushed.

## Decisions

- Routine founder access uses Supabase email-and-password authentication.
- `ADMIN_ALLOWED_EMAILS` remains the independent server-side authorization
  source after Supabase validates the user.
- Supabase Auth continues to generate and validate recovery links and sessions.
  The native Resend SMTP integration delivers Auth recovery email from the
  verified `zarkaconstruction.com` domain.
- No public signup, customer login, custom password storage, or schema migration
  was added.
- Auth cookies remain host-scoped; no hard-coded cookie domain is introduced.

## Blockers

None. The founder manually verified recovery and routine password login, all
release checks pass, and required Production configuration is present.

## Immediate next action

Commit and push `main` once, monitor the automatic Vercel Production deployment,
then verify password sign-in, dashboard loading, refresh, second-tab session,
sign-out, recovery delivery, and one durable consultation submission.
