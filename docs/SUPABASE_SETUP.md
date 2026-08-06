# Supabase Setup

Project reference: `odwkuzaudafkmgbsduou`.

## Variables

Public:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_ALLOWED_EMAILS`
- `ADMIN_AUTH_ORIGIN` (optional Preview email-callback origin)
- `ADMIN_AUTH_RATE_LIMIT_MAX` (optional; default 8)
- `ADMIN_AUTH_RATE_LIMIT_WINDOW_MS` (optional; default 900000)

The auth limiter uses `CONTACT_RATE_LIMIT_SECRET` when configured and otherwise
a per-runtime random salt. Existing Resend, Turnstile, consultation rate-limit,
analytics, and indexing variables remain supported. Configure Preview and
Production separately. Never place a service credential in a `NEXT_PUBLIC`
variable, commit it, or print it.

## Auth provider and user setup

1. In Supabase **Authentication > Providers > Email**, keep email/password
   authentication enabled. The application never calls `signUp` and exposes no
   registration page.
2. Keep the existing founder Auth user. Do not delete or recreate it merely to
   add a password.
3. Put the authorized founder email in comma-separated `ADMIN_ALLOWED_EMAILS`
   for Preview and Production. This server-only allowlist remains authoritative
   even when Supabase credentials are valid.
4. In **Authentication > URL Configuration**, keep the Site URL as
   `https://www.zarkaconstruction.com` and allow these exact Production paths:

   - `https://www.zarkaconstruction.com/auth/recovery`
   - `https://www.zarkaconstruction.com/auth/callback` (legacy/setup compatibility)

5. For a protected Preview, use one stable branch hostname and allow both matching
   callback paths. Set `ADMIN_AUTH_ORIGIN` to that origin only; do not include a
   path. A commit-specific hostname and stable hostname cannot share PKCE cookies.
6. Keep the recovery email template based on Supabase's confirmation URL or a
   correct `RedirectTo`; do not hard-code an old Preview or apex hostname.
7. Configure Supabase Auth custom SMTP through the native Resend integration.
   Use the verified `zarkaconstruction.com` sender domain. Supabase continues to
   generate and validate recovery links; Resend is the delivery provider. Keep
   provider and application rate limits enabled, and never commit or expose the
   integration API key.
8. Verify `consultation-photos` remains private and both consultation tables
   retain forced RLS/browser-denial policies.

The service-role key is in Supabase Project Settings > API Keys. It bypasses RLS
and belongs only in encrypted server configuration. Password sign-in and reset
use the publishable Auth client, never the service-role key.

## Founder first-password procedure

Preferred when an authenticated session already exists:

1. Sign in once with an already-issued/current setup email link.
2. Visit `/admin/set-password`.
3. Create a password-manager-generated password satisfying the displayed policy.
4. Sign out.
5. Visit `/admin/login` and sign in with email and the new password.
6. Refresh `/admin`, open it in a second tab, then sign out.

If no authenticated session is available, use `/admin/forgot-password`. Open
only the newest recovery email in the same browser/device that requested it,
choose a password at `/admin/reset-password`, and then sign in normally.

Never put the password in Vercel, Supabase project variables, `.env.local`, a
support message, screenshot, commit, or documentation.

## Recovery verification

- Confirm the exact recovery redirect is preserved rather than replaced by the
  Site URL.
- Confirm the callback URL has no token after it redirects to the reset page.
- Confirm an expired/reused link returns a safe error.
- Confirm the reset page cannot load without both a verified session and the
  short-lived recovery marker.
- Confirm successful recovery signs out the temporary recovery session.
- Confirm a non-allowlisted Auth user cannot reach the dashboard or update a
  password through application routes.

## Migration commands

This auth change requires no database migration. Existing consultation setup
commands remain:

- `npx supabase link --project-ref odwkuzaudafkmgbsduou`
- `npx supabase migration list`
- `npx supabase db push --dry-run`
- `npx supabase db push`

Never use `db reset --linked`, destructive repair, or production seed data.

## Rollback

Roll back the Vercel deployment to the prior known-good release. Do not reset
Supabase, delete the founder Auth user, drop tables, remove Storage objects, or
alter consultation data. Existing sessions can be invalidated through Supabase
only as a separate, deliberate security action. DNS and email DNS are outside
this change.

## Phase 2 migration and verification

Apply `20260806000100_create_field_capture_sessions.sql` with the existing linked CLI workflow. It is additive: one table, two project-photo columns, constraints, indexes, trigger, forced RLS, and deny policies. It does not reset data or recreate the existing Albatross Golf Mason record. Verify the `project-media-private` bucket remains private, direct public listing is denied, service-role credentials remain server-only, and authenticated browser roles cannot read `field_capture_sessions` directly.