# Progress

**Current phase:** Phase 2 - focused simulator construction increment

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** `phase-2/simulator-construction`

**Last updated:** August 4, 2026

## Current production status

Phase 1 and the Phase 1.5 readiness work remain live. Redirects, contact
delivery and visitor Reply-To, Cloudflare Turnstile, contact rate limiting,
search indexing, canonical metadata, and the existing public routes are
confirmed. No database, CMS, authentication, or Supabase is present.

Before Phase 2 implementation, the previously empty GitHub repository was
configured as `origin` and the complete local `main` history was pushed. Local
and remote `main` matched at `53ff306bd7ed59df7e10a6b82553f943db657a41`
before the feature branch was created.

## Focused Phase 2 implementation

- Added the static `/simulator-construction` route.
- Covered room feasibility, player clearances, framing/finish scope, impact
  screen and enclosure context, wall/ceiling protection, turf and hitting area,
  projector/lighting/technology coordination, maintenance access, process, FAQ,
  Precision Impact Screens context, and consultation CTA.
- Kept Zarka positioned as the room-construction and specialty-installation
  expert without claiming equipment manufacturing, sales, certification,
  warranty, dealer, or manufacturer relationships.
- Added four typed, configuration-driven image slots with approved future alt
  text. All sources remain `null`; the page renders decorative architectural
  schematics and no fake project photography.
- Added canonical/Open Graph/Twitter metadata, factual Service and FAQ JSON-LD,
  and sitemap inclusion.
- Updated primary navigation, footer navigation, and the homepage simulator
  section to link to the dedicated route.
- Reused the existing contact route and backend with
  `?service=simulator-construction` safely preselecting the configured service.
- Added regression coverage for the new sitemap route, service query guard, and
  null photography configuration.
- Added no dependencies, database, Supabase, CMS, authentication, new backend,
  or unrelated Phase 2 features.

## Verification

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run test`: 23 tests pass across eight files
- Production build with indexing enabled: pass
- `/simulator-construction`: static route, HTTP 200
- `/contact?service=simulator-construction`: HTTP 200 and simulator option
  selected in server-rendered markup
- Sitemap: five canonical public URLs including the simulator route
- Metadata: canonical `www` URL, Open Graph/Twitter values, one H1, factual
  Service JSON-LD, visible-content FAQ JSON-LD
- Photography audit: only approved shared brand-mark images render; simulator
  image slots remain null
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.8 s, LCP 2.4 s, TBT 20 ms, CLS 0
- Responsive Lighthouse captures reviewed at 320, 375, 768, 1024, and 1440 CSS
  pixels; header, hero, CTAs, and breakpoint changes fit without visible
  horizontal overflow
- In-app interactive browser was unavailable in this environment; Lighthouse
  artifacts and route/markup checks were used instead. A final human preview
  review remains part of deployment acceptance.
- Implementation commit: `dc6a796` (`Add simulator construction service page`)
- Documentation commit: `3d3983b` (`Document focused Phase 2 simulator increment`)
- Feature branch pushed to GitHub and confirmed to track
  `origin/phase-2/simulator-construction`.
- Vercel preview deployment `dpl_8Zsg6dGVS9Weiq4ZtKxjBudNixDY`: ready at
  <https://zarka-construction-ng22g9wkb-matthews-projects-7e2a9d39.vercel.app>
- Authenticated preview assertions passed for the simulator route, canonical
  metadata, preview noindex behavior, Service/FAQ structured data, homepage
  internal link, sitemap entry, and simulator contact preselection.
- Production was not promoted or changed during this focused increment.

## Missing founder content

- Approved real simulator project photography and publication rights
- Final crop choices and context-specific alt text after images are selected
- Confirmed service-area language, if it should be published
- Any future manufacturer, product, warranty, or equipment relationship facts;
  none are currently claimed

## Immediate next action

Complete a human review of the protected Vercel preview, then merge or promote
only after approval. Do not begin portfolio, CMS, database, authentication, or
unrelated Phase 2 work.
