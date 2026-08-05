# Zarka Construction Website

## Project purpose

The official website for Zarka Construction LLC, positioned publicly as a
**Golf Simulator Construction Specialist**.

Zarka Construction evaluates, plans, prepares, and completes defined
specialty-construction scopes for premium simulator environments in homes and
commercial golf settings. The website does not present the company as an
equipment dealer or as responsible for an entire home or commercial facility.

**Canonical production domain:** <https://www.zarkaconstruction.com>

## Current objective

The active Phase 2 branch presents Zarka's current simulator-environment
specialty accurately and builds trust before founder approval. The customer
journey begins with the space and leads to either an on-site consultation or
guided remote room review when appropriate.

This is a conversation-generating marketing website. It is not an equipment
store, configurator, estimator, portal, professional-design service, permit
service, or software-product directory.

## Stack

- Next.js 16 App Router with React 19 and strict TypeScript
- Tailwind CSS 4 with project-owned accessible components
- Static or server-rendered marketing pages on Vercel
- Resend contact delivery through `POST /api/contact`
- Cloudflare Turnstile, honeypot/timing checks, and rate limiting
- Vercel Analytics with PII-free events
- No database, Supabase, CMS, authentication, uploads, or product catalog

## Public routes

- `/` — simulator-construction-specialist homepage
- `/simulator-construction` — detailed scope and room-evaluation page
- `/contact` — simulator-environment inquiry and review selection
- `/privacy`
- `/terms`
- generated `/sitemap.xml` and `/robots.txt`

## Current branch status

Work continues on `phase-2/simulator-construction`. Do not merge or promote
until founder approval of a protected Vercel preview.

The production domain remains live with the prior approved release. DNS,
GoDaddy, Vercel domain settings, and production deployment are not changed by
this positioning work.

## Strategic boundaries

- Lead with “Golf Simulator Construction Specialist.”
- Keep the golf experience emotional and the construction claims specific.
- Present current work: room evaluation, construction planning, preparation and
  framing, impact-screen structures and custom layered screens, curtains, wall
  and ceiling protection, turf and hitting surfaces, finish carpentry, trim,
  detailing, and qualified-trade coordination where required.
- Commercial relevance includes simulator environments within teaching studios,
  commercial golf spaces, entertainment venues, simulator businesses, country
  clubs, and training environments.
- Never imply responsibility for an entire commercial facility.
- Never imply equipment sales, architectural or engineering services, permit
  authority, or unassigned professional or licensed-trade responsibilities.
- Use founder-owned project photography only after work begins and publication
  is approved.
- CapProof may appear only as part of the field-documentation process.
- Bid Desk is not named publicly.
- Precision Impact Screens has no public role.
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
