# Zarka Construction Website

## Project purpose

The official website for Zarka Construction LLC: a Michigan-based construction
and specialty installation company connecting decades of field experience with
modern estimating, documentation, and construction technology.

**Canonical production domain:** <https://zarkaconstruction.com>

## Immediate goal

Ship a polished, fast, mobile-first marketing website that can be shared with
prospects, contractors, vendors, and partners immediately. The first release is
a focused professional front door, not a construction management application.

## Proposed stack

- Next.js App Router with TypeScript
- Tailwind CSS; shadcn/ui only where a primitive clearly reduces risk
- Static or server-rendered marketing pages on Vercel
- Resend for contact email
- Cloudflare Turnstile and lightweight rate limiting for form abuse
- Vercel Analytics or an equivalent privacy-conscious analytics tool
- Supabase only after a real persistence requirement is approved

Use the current stable compatible versions when implementation begins. Pin
resolved versions in the package lockfile and record material version choices
in `docs/DECISIONS.md`.

## Current status

Phase 0 — Foundation and Decisions. The planning and architecture baseline is
present; application implementation has not begun. The project root was empty
and was not a Git repository when this baseline was created. No production logo
files, brand-board image, or project photography are currently in the
repository.

Deployment target: Vercel. GoDaddy remains the registrar and DNS host during the
initial launch. Website hosting migration and domain registration are separate
operations.

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

Application setup is intentionally deferred to Phase 1. Once the Next.js
project exists, replace this section with the exact prerequisites, install
command, environment-file setup, development command, checks, and production
build command. Do not publish real secrets in this file or commit `.env*`
files containing secrets.

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
