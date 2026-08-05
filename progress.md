# Progress

**Current phase:** Phase 2 — simulator-room-builder strategic repositioning

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** `phase-2/simulator-construction`

**Last updated:** August 4, 2026

## Production status

The existing production release remains live and unchanged. Redirects, contact
delivery, visitor Reply-To, Cloudflare Turnstile, rate limiting, canonical
metadata, and search indexing were already verified. This repositioning has not
been merged, promoted, or connected to production. DNS, nameservers, email
records, GoDaddy products, and Vercel domain settings were not changed.

## Accepted positioning decision

Zarka Construction is now positioned publicly as a **Golf Simulator Room
Builder**.

Approved position:

> Zarka Construction plans and builds custom indoor golf simulator rooms for
> residential and commercial spaces.

The website represents the business Zarka intends to build. Construction,
carpentry, renovation, painting, commercial maintenance, estimating, and
documentation experience support simulator-room credibility rather than compete
as equal primary services.

ADR-021 records the strategy change.

## Implementation completed on the feature branch

- Rebuilt homepage hierarchy around simulator-room planning and construction.
- Implemented the approved hero: “We Build the Room Around the Technology.”
- Reorganized public solutions into residential rooms, commercial bays, room
  conversions, impact environments, finish integration, planning, and
  construction coordination.
- Added detailed room-geometry education and a four-step planning process.
- Added on-site consultation and guided remote room review paths.
- Added a required, server-validated `consultationPreference` to the existing
  contact form and Resend HTML/plain-text email without adding a backend.
- Preserved the detailed `/simulator-construction` route and replaced its former
  external-product section with room-review guidance.
- Added configuration-driven, null project-photo slots and truthful project
  stages; no AI, stock, fake, or premature project imagery is public.
- Kept CapProof to one documentation-process sentence with no card or link.
- Removed all public Precision Impact Screens and Bid Desk references, links,
  cards, footer entries, metadata, structured data, analytics, and SEO paths.
- Updated header, footer, legal copy, Open Graph image, organization data,
  metadata, navigation, CTAs, and internal linking.
- Added no CMS, Supabase, database, authentication, uploads, scheduler,
  configurator, estimator, store, catalog, equipment sales, or new route.

## Verification completed

- `npm run check`: pass
  - ESLint: pass
  - TypeScript: pass
  - Vitest: 24 tests pass across 8 files
  - Production build: pass
- Routes return HTTP 200: `/`, `/simulator-construction`, simulator-preselected
  `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, and `/robots.txt`.
- Rendered public-page audit: no Precision Impact Screens or Bid Desk text;
  CapProof appears only as documentation-process context.
- Contact markup: simulator service preselected; both approved room-review
  options present.
- Canonical URLs and simulator sitemap entry: pass.
- Homepage and dedicated simulator page each contain one H1.
- Responsive captures reviewed at 320, 375, 768, 1024, and 1440 CSS pixels with
  no visible overflow, clipped CTAs, or broken hero layout.
- Contrast audit passes at every reviewed width.
- Lighthouse homepage: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.8 s, LCP 1.9 s, TBT 20 ms, CLS 0.
- Dedicated simulator route: Accessibility 100, SEO 100.
- Contact route after contrast correction: Accessibility 100, SEO 100.
- Lighthouse emits a Windows temporary-folder cleanup EPERM after writing valid
  reports; report generation and scores are complete.

## Remaining founder content

- Founder approval of the protected repositioning preview
- Founder-owned simulator project photography and publication rights
- Approved project titles, scope facts, broad locations if publishable, crops,
  and alt text after real construction begins
- Confirmed public service-area wording, if any
- Any verified equipment, manufacturer, dealer, certification, or warranty
  relationships; none are currently claimed

## Git and preview deployment

- Application commit: `b9a0187` — Reposition site around simulator room building
- Documentation commit: `1a77f2a` — Document simulator-room-builder strategy
- Both commits are pushed to `origin/phase-2/simulator-construction`.
- Protected preview deployment: `dpl_6kq4LmyJhrgrh1EABAJ2D8GoVH3Y`
- Preview URL:
  <https://zarka-construction-6d1azpg3r-matthews-projects-7e2a9d39.vercel.app>
- Authenticated preview assertions passed for category copy, hero, dedicated
  simulator content, canonical metadata, preview noindex, contact preselection,
  both review options, sitemap, and prohibited-reference removal.

## Immediate next action

Complete founder review of the protected preview. Do not merge or promote to
production until the founder explicitly approves the repositioned experience.