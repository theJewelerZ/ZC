# Zarka Construction Website

## Project purpose

The official website for Zarka Construction LLC: a Michigan-based construction
and specialty installation company connecting decades of field experience with
modern estimating, documentation, and construction technology.

**Canonical production domain:** <https://www.zarkaconstruction.com>

## Immediate goal

Ship a polished, fast, mobile-first marketing website that can be shared with
prospects, contractors, vendors, and partners immediately. The first release is
a focused professional front door, not a construction management application.

## Implemented stack

- Next.js 16 App Router with React 19 and strict TypeScript
- Tailwind CSS 4 with project-owned accessible components
- Static or server-rendered marketing pages on Vercel
- Environment-driven Resend contact email through a Next.js route handler
- Optional Cloudflare Turnstile, honeypot/timing checks, and rate limiting
- Vercel Analytics with PII-free conversion events
- Supabase only after a real persistence requirement is approved

Use the current stable compatible versions when implementation begins. Pin
resolved versions in the package lockfile and record material version choices
in `docs/DECISIONS.md`.

## Current status

Phase 1.5 production readiness is deployed on the canonical production site:
<https://www.zarkaconstruction.com>.

Founder-supplied raster brand artwork is integrated through the
configuration-driven logo component and browser icons; the narrow header keeps
the legible text wordmark paired with the approved icon. A professionally
recreated SVG and approved project photography remain future replacements.

The linked Vercel Production project contains the server-only Resend recipient,
sender, API key, and rate-limit configuration. The
`zarkaconstruction.com` sender domain and its DKIM/SPF records are verified by
Resend. A real production submission returned HTTP 200 and produced a
privacy-safe `contact_delivery_accepted` event with a provider ID. Turnstile
remains inactive until both credentials are configured. GoDaddy remains the
registrar and DNS host; future DNS work must preserve unrelated website and
email records.

Production indexing is enabled on the canonical deployment. Preview and local
builds remain non-indexable by default.

## Documentation

- [Product brief](docs/PRODUCT_BRIEF.md)
- [Brand system](docs/BRAND_SYSTEM.md)
- [Information architecture](docs/INFORMATION_ARCHITECTURE.md)
- [Content plan](docs/CONTENT_PLAN.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Deployment and domain cutover](docs/DEPLOYMENT_AND_DOMAIN_CUTOVER.md)
- [SEO and analytics](docs/SEO_AND_ANALYTICS.md)
- [Decision log](docs/DECISIONS.md)
- [Open questions](docs/OPEN_QUESTIONS.md)
- [Launch checklist](docs/LAUNCH_CHECKLIST.md)
- [Asset inventory](docs/ASSET_INVENTORY.md)
- [Current progress](progress.md)
- [Agent operating instructions](AGENTS.md)

## Development setup

Requirements: Node.js 24.x and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Configure only the environment values available
to you; the site remains operational with contact delivery and Turnstile
disabled.

Quality and production commands:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run check
npm run start
```

Never commit `.env.local`, Resend credentials, Turnstile secrets, or private DNS
exports.

### Production environment

Required for contact delivery:

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`

The domain used by `CONTACT_FROM_EMAIL` must also be verified in the configured
Resend account. Environment variables alone do not establish sender
authorization.

Optional Turnstile hardening:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Set `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true` only in the canonical Vercel
Production environment. Leave it absent or `false` in Preview and local
environments so non-canonical deployments remain non-indexable. See
[.env.example](.env.example) for the complete safe template.

## Scope constraints

- MVP routes are `/`, `/contact`, `/privacy`, and `/terms`.
- The homepage carries the primary marketing narrative.
- Do not invent contact details, address, service radius, licensing, insurance,
  team size, years in business, reviews, certifications, or metrics.
- Do not imply that Zarka Construction performs every licensed trade or acts as
  a full-service general contractor without founder approval.
- Indoor golf simulator construction is a major specialty, not a minor card.
- CapProof and Precision Impact Screens may link to their confirmed sites. Bid
  Desk must have no public link until its URL is supplied.
- Business data, external links, and logo paths must be configuration-driven.
- No authentication, CMS, CRM, portal, database, scheduling platform, AI chat,
  or product-to-product integration belongs in the MVP.
- Do not change DNS or cancel a GoDaddy product until the production deployment,
  domain records, mail records, SSL, redirects, and rollback plan have been
  verified.
