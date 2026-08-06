# Zarka Construction Website

Official website for Zarka Construction LLC, positioned as a Golf Simulator
Construction Specialist.

**Canonical production domain:** <https://www.zarkaconstruction.com>

## Current objective

The production application includes a narrow durable consultation system,
optional private room-photo intake, and a founder-only review dashboard. The
current production-readiness change replaces routine magic-link access with
founder email-and-password sign-in while preserving Supabase SSR sessions and
the server-only email allowlist.

This is not a CRM, customer portal, estimator, scheduler, equipment store, or
project-management platform. There is no public signup or customer login.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4
- Vercel hosting and privacy-conscious Analytics
- Supabase Postgres as consultation system of record
- Private Supabase Storage for optional room photographs
- Supabase Auth email/password plus server-enforced founder email allowlist
- Email-based password recovery delivered through Resend SMTP; magic links are
  not routine login
- Resend founder notification and customer confirmation after persistence
- Cloudflare Turnstile, honeypot/timing checks, and rate limiting
- No CMS, customer accounts, CRM, proposals, invoices, scheduling,
  CapProof/Bid Desk sync, or product catalog

## Routes

Public:

- `/`
- `/simulator-construction`
- `/contact`
- `/privacy`
- `/terms`
- `/sitemap.xml` and `/robots.txt`

Private/system:

- `/admin` and `/admin/consultations/[id]`
- `/admin/login`, `/admin/forgot-password`, `/admin/set-password`, and
  `/admin/reset-password`
- `/auth/recovery`, `/auth/callback` (legacy/setup compatibility), and
  `/auth/signout`
- `/api/admin/auth/login`, `/recovery-request`, and `/password`
- `/api/consultations/start`, `/finalize`, and `/cancel`

Private routes are dynamic, no-store, noindex, and server-authorized.

## Development

Requirements: Node.js 24.x and npm.

    npm install
    Copy-Item .env.example .env.local
    npm run dev

Quality commands:

    npm run lint
    npm run typecheck
    npm test
    npm run build
    npm run check

Do not commit `.env.local`, Supabase/Resend/Turnstile credentials, private DNS
exports, consultation records, customer photographs, passwords, or recovery
links.

## Environment

Public site controls:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_ENABLED`
- `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED`

Consultation persistence and Auth:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `ADMIN_ALLOWED_EMAILS` (server only, authoritative dashboard allowlist)
- `ADMIN_AUTH_ORIGIN` (optional Preview email-callback origin)
- `ADMIN_AUTH_RATE_LIMIT_MAX` and `ADMIN_AUTH_RATE_LIMIT_WINDOW_MS` (optional)

Email and abuse protection:

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `CONTACT_RATE_LIMIT_SECRET`
- `CONTACT_RATE_LIMIT_MAX`
- `CONTACT_RATE_LIMIT_WINDOW_MS`

See `.env.example` and `docs/SUPABASE_SETUP.md`. Never print or document values.

## Documentation

- [Product brief](docs/PRODUCT_BRIEF.md)
- [Brand system](docs/BRAND_SYSTEM.md)
- [Content plan](docs/CONTENT_PLAN.md)
- [Information architecture](docs/INFORMATION_ARCHITECTURE.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Consultation backend](docs/CONSULTATION_BACKEND.md)
- [Data model](docs/DATA_MODEL.md)
- [Founder dashboard](docs/ADMIN_DASHBOARD.md)
- [Privacy and retention](docs/PRIVACY_AND_RETENTION.md)
- [Supabase setup](docs/SUPABASE_SETUP.md)
- [Decisions](docs/DECISIONS.md)
- [Open questions](docs/OPEN_QUESTIONS.md)
- [Launch checklist](docs/LAUNCH_CHECKLIST.md)
- [SEO and analytics](docs/SEO_AND_ANALYTICS.md)
- [Deployment/domain cutover](docs/DEPLOYMENT_AND_DOMAIN_CUTOVER.md)
- [Asset inventory](docs/ASSET_INVENTORY.md)
- [Current progress](progress.md)

## Deployment safeguard

`main` deploys production. Push it only after lint, TypeScript, tests, production
build, and controlled authentication verification pass. Never alter DNS,
nameservers, GoDaddy services, production email DNS, or Supabase data as part of
an authentication UI change. Database rollback must preserve consultation data;
never use a linked remote reset.
