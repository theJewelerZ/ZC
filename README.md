# Zarka Construction Website

## Project purpose

The official website for Zarka Construction LLC, positioned publicly as a
**Golf Simulator Room Builder**.

Zarka Construction plans and builds custom indoor golf simulator rooms for
residential and commercial spaces. Construction, carpentry, renovation,
painting, maintenance, estimating, and documentation experience support that
specialty rather than compete with it.

**Canonical production domain:** <https://www.zarkaconstruction.com>

## Current objective

The active Phase 2 branch repositions the existing production-quality website
around simulator-room planning and construction. The customer journey begins
with room feasibility and leads to either an on-site consultation or guided
remote room review.

This is a conversation-generating marketing website. It is not an equipment
store, configurator, estimator, portal, or software-product directory.

## Stack

- Next.js 16 App Router with React 19 and strict TypeScript
- Tailwind CSS 4 with project-owned accessible components
- Static or server-rendered marketing pages on Vercel
- Resend contact delivery through `POST /api/contact`
- Cloudflare Turnstile, honeypot/timing checks, and rate limiting
- Vercel Analytics with PII-free events
- No database, Supabase, CMS, authentication, uploads, or product catalog

## Public routes

- `/` — simulator-room-builder homepage
- `/simulator-construction` — detailed planning and construction page
- `/contact` — simulator project inquiry and room-review selection
- `/privacy`
- `/terms`
- generated `/sitemap.xml` and `/robots.txt`

## Current branch status

Work continues on `phase-2/simulator-construction`. The branch is based on the
existing simulator feature and must not be merged or promoted until founder
approval of a protected Vercel preview.

The production domain remains live with the prior approved release. DNS,
GoDaddy, Vercel domain settings, and production deployment are not changed by
the repositioning work.

## Strategic boundaries

- Lead with “Golf Simulator Room Builder.”
- Keep approximately 80% of homepage emphasis on simulator rooms, 15% on
  construction credibility, and 5% on supporting systems.
- Organize services around residential rooms, commercial bays, conversions,
  impact environments, finish integration, room planning, and coordination.
- Explain why dimensions, player position, screen geometry, projection,
  protection, turf, lighting, and construction must be coordinated.
- Use founder-owned project photography only after work begins and publication
  is approved.
- CapProof may appear only as part of the field-documentation process.
- Bid Desk is not named publicly; organized estimates, scopes, and documented
  assumptions express its operational value.
- Precision Impact Screens has no public copy, link, card, footer entry,
  metadata, structured data, sitemap, analytics, or SEO role.
- Do not invent service area, address, phone, email, licensing, insurance,
  certifications, dealer status, warranties, prices, timing, counts, or projects.

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
- [Agent instructions](AGENTS.md)

## Development

Requirements: Node.js 24.x and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

Quality commands:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

Never commit `.env.local`, Resend credentials, Turnstile secrets, private DNS
exports, or customer/project photographs without approved publication rights.

## Environment configuration

Contact delivery requires:

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`

Production abuse protection uses:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `CONTACT_RATE_LIMIT_SECRET`
- optional rate-window overrides documented in `.env.example`

Set `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true` only in canonical Vercel
Production. Protected previews and local builds remain non-indexable.

## Deployment safeguard

Deploy and review a protected preview first. Do not merge, promote, alter DNS,
change nameservers, transfer the domain, modify email records, or cancel a
GoDaddy product without explicit founder authorization.