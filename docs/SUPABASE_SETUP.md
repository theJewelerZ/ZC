# Supabase Setup

Project reference: odwkuzaudafkmgbsduou.

## Variables

Public:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Server-only:

- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_ALLOWED_EMAILS

Existing Resend, Turnstile, rate-limit, analytics, and indexing variables remain
supported. Configure Preview and Production separately. Never place a service
credential in a NEXT_PUBLIC variable, commit it, or print it.

## Founder setup

1. Supabase Auth: enable Email magic links.
2. Create or invite the founder Auth user. Public registration is disabled by
   the application.
3. Add callback URLs for localhost, the protected preview origin, and production
   only when production rollout is approved. Each ends with /auth/callback.
4. Put the same founder email in comma-separated ADMIN_ALLOWED_EMAILS.
5. Verify consultation-photos is private, limited to 15 MiB per object, and
   limited to JPEG/PNG/WebP.
6. Verify both tables have RLS enabled/forced and browser roles cannot access
   them directly.

The service-role key is in Supabase Project Settings > API Keys. It bypasses RLS
and belongs only in encrypted server configuration.

## Migration commands

- npx supabase link --project-ref odwkuzaudafkmgbsduou
- npx supabase migration list
- npx supabase db push --dry-run
- npx supabase db push

Never use db reset --linked, destructive repair, or production seed data. The
initial additive migration was dry-run reviewed against an empty remote public
schema and applied on August 5, 2026.

## Preview test and rollback

Submit one no-photo and one photo inquiry; verify the completed row, private
object, metadata, both emails, Reply-To, dashboard list/detail, signed image
expiry, status, and notes. Test unauthorized and anonymous /admin access.

Keep Production on its prior deployment. Disable the protected preview or its
Preview variables if needed. Do not drop tables or the bucket automatically.
No DNS, nameserver, GoDaddy, or production email-DNS change belongs to this phase.

## Magic-link callback verification

The callback URL must match the exact browser origin used to request the link.
For a protected Preview, authorize through Vercel first, request the link from
that Preview hostname, and open only the newest email in the same browser and
device so the PKCE verifier cookie is available. Do not reuse a link: the code is
short-lived and one-time.

After callback, verify /admin loads, survives refresh, remains authenticated in
a second tab, and returns to /admin/login after POST sign-out. Preview and
production use host-only cookies; do not configure a shared cookie Domain.
