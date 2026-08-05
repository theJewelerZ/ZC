# Progress

**Current phase:** Phase 3 — protected consultation-system review

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** phase-3/consultation-dashboard

**Last updated:** August 5, 2026

## Production status

Production remains on the prior approved release. This branch is not merged or
promoted. DNS, nameservers, GoDaddy products, production email DNS, and the
canonical Vercel domain were not changed.

## Implemented

- Supabase SSR/browser/server clients with strict service-secret separation.
- Additive migration 20260805000100 applied to the confirmed Zarka project.
- consultations and consultation_photos constraints, indexes, updated-at
  trigger, forced RLS, revoked browser privileges, service-only transactional
  finalization, and private consultation-photos bucket.
- Validated pending consultation sessions, one-object signed direct uploads,
  stored-object/signature checks, atomic completion, cancellation, and 24-hour
  abandoned-session cleanup.
- Optional JPEG/PNG/WebP photos: 10 files, 15 MiB each, 75 MiB combined,
  thumbnails, captions, remove controls, progress, errors, and retry.
- Resend founder notification and customer confirmation after persistence.
  Failed or partial notification state preserves the lead.
- Supabase magic-link Auth, no public registration, server email allowlist,
  private /admin list/detail, five-minute signed images, status, and notes.
- Accurate privacy, robots, CSP, private cache/noindex, environment, setup, data,
  retention, and operating documentation.
- Legacy email-only POST endpoint retired so it cannot bypass persistence.

## Verification

- Full npm run check passes: ESLint, TypeScript, 41 Vitest tests across 15 files,
  and Next.js 16.3.0 production build.
- npm audit: zero known vulnerabilities after targeted stable security updates.
- Supabase db lint: no schema errors.
- Remote local/history match; exactly the two expected empty tables exist.
- Publishable key gets 401 for table reads; service credential gets 200.
- Anonymous private-bucket listing exposes no objects; server bucket access works.
- Controlled no-photo and signed-photo Preview submissions stored successfully;
  both notification pairs were accepted as sent.
- The two synthetic records and generated test object were removed; database and
  private bucket returned to an empty state and metadata cascade was verified.
- Anonymous /admin renders no consultation table; /admin/login shows the
  magic-link form and no-registration copy.
- Lighthouse:
  - homepage: Performance 98, Accessibility 100, Best Practices 100, SEO 100
  - contact: Performance 98, Accessibility 100, Best Practices 100, SEO 100
  - founder login: Performance 98, Accessibility 100, Best Practices 100;
    private-route SEO 69 is intentional because the route is noindex
  - CLS 0 on all audited routes
- Lighthouse reports completed despite the known Windows temporary-folder
  cleanup EPERM warning.

## Protected Preview

Deployment ID: dpl_ADDDhWM8Rd3rmVpqnAwNYtpWTdae

URL:
<https://zarka-construction-kxeshnmj3-matthews-projects-7e2a9d39.vercel.app>

Status: Ready; target: Preview. Branch-scoped Supabase and rate-limit variables
are configured without exposing values. Production variables were not changed.

## Remaining founder setup and review

- Supply the exact email for ADMIN_ALLOWED_EMAILS.
- Create or invite that same Supabase Auth user.
- Add the protected Preview /auth/callback URL in Supabase Auth.
- Complete authenticated list/detail/photo/status/notes review.
- Verify an authenticated but non-allowlisted account is denied.
- Complete manual responsive review at 320, 375, 768, 1024, and 1440px. The
  connected browser runtime was unavailable during implementation; automated
  accessibility and Lighthouse checks passed.
- Confirm received Preview founder/customer emails if desired.
- Approve or request changes. Do not merge or promote without explicit approval.

## Immediate next action

Founder supplies the admin email and completes the exact protected-preview review
in docs/SUPABASE_SETUP.md. Do not merge or promote.
