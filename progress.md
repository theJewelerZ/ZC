# Progress

**Current phase:** Phase 2 — final specialist-positioning review

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** `phase-2/simulator-construction`

**Last updated:** August 4, 2026

## Production status

The existing production release remains live and unchanged. This final trust and
positioning pass has not been merged, promoted, or connected to production.
DNS, nameservers, email records, GoDaddy products, and Vercel domain settings
were not changed.

## Accepted positioning

Zarka Construction is positioned as a **Golf Simulator Construction Specialist
focused on creating premium simulator environments while accurately
representing its present capabilities**.

The website preserves the experience-led idea:

> We Build the Room Around the Game.

It now defines Zarka's work through specific simulator-environment scope rather
than broad room or facility claims. ADR-023 records this decision.

## Present public scope

Depending on room review and written scope, work may include:

- room evaluation and simulator construction planning;
- simulator-room preparation and framing;
- impact-screen structures and custom layered impact screens;
- curtains and enclosure details;
- wall and ceiling protection;
- turf, stance areas, and hitting surfaces;
- finish carpentry, trim, transitions, and detailing;
- coordination with equipment providers or qualified trades when required.

The site does not claim equipment sales, manufacturer or dealer relationships,
architectural or engineering services, permit authority, complete facility
construction, or responsibility outside the written scope.

## Trust refinements completed

- Replaced “Golf Simulator Room Builder” with “Golf Simulator Construction
  Specialist” in public category, metadata, Open Graph, structured data, and documentation.
- Replaced broad residential/commercial room cards with seven specific,
  currently performed simulator-environment service categories.
- Added careful commercial settings: teaching studios, commercial golf spaces,
  entertainment venues, simulator businesses, country clubs, and training
  environments.
- Clarified that commercial references concern the simulator environment within
  a facility, not construction of the complete facility.
- Strengthened the differentiator to: “We Don't Simply Install Equipment. We
  Prepare the Environment for Great Simulator Experiences.”
- Rewrote the process around initial evaluation, defined scope, agreed specialty
  work, and remaining responsibilities.
- Rewrote About with a humble emphasis on experience, love of golf,
  craftsmanship, listening, clear communication, and identifying outside scope.
- Reframed Contact as a conversation about the space, not an equipment package
  or quote.
- Added direct Terms language for business scope, equipment, permits,
  architectural or engineering work, licensed trades, commercial settings, and
  no website-created warranty or agreement.
- Documented every current photography placeholder by intended image, story,
  construction state, residential/commercial relevance, and framing.
- Added no route, layout, feature, animation, database, CMS, Supabase,
  authentication, upload, store, estimator, or production change.

## Three-audience accuracy review

- **Homeowner:** sees a specialist who begins with the room, explains the work
  that may be included, and invites a practical conversation without selling equipment.
- **Golf facility owner:** sees relevant commercial simulator settings and
  specialty capability without a claim to construct the entire facility.
- **Licensed general contractor:** sees a defined simulator-environment scope,
  written responsibilities, and explicit separation of permits, professional
  design, equipment, and licensed trades.

All three audiences should leave with an accurate understanding of Zarka's
present role.

## Verification completed

- `npm run check`: pass
  - ESLint: pass
  - TypeScript: pass
  - Vitest: 24 tests pass across 8 files
  - Production build: pass; all 13 routes generated
- HTTP 200 verified for `/`, `/simulator-construction`, simulator-preselected
  `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, and `/robots.txt`.
- Public trust assertions pass for specialist category, present services,
  custom layered impact screens, commercial settings, complete-facility
  boundary, equipment boundary, permit boundary, professional-design boundary,
  contact framing, canonical metadata, and prohibited-reference removal.
- Responsive review completed at true 320px, 768px, 1024px, and 1440px.
  Long specialist and scope language wraps without clipped CTAs or overflow.
- Lighthouse:
  - Homepage: Performance 99, Accessibility 100, Best Practices 100, SEO 100
  - True 320px homepage: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - Simulator page: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - Contact page: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - CLS: 0 on every audited route
- Lighthouse can emit a Windows temporary-folder cleanup `EPERM` after writing
  valid reports; the reports and scores above are complete.

## Git and protected preview

- Application commit: `a98c069` — Clarify simulator construction specialist scope
- Documentation commit: `c3519f1` — Document accurate specialist positioning
- Both commits are pushed to `origin/phase-2/simulator-construction`.
- Protected preview deployment: `dpl_EgYXk2SUoKxanqJ98j5o2JDR6vok`
- Preview URL:
  <https://zarka-construction-qcl16xk68-matthews-projects-7e2a9d39.vercel.app>
- Deployment target: preview; status: Ready.
- Authenticated preview assertions pass for public category, current services,
  commercial and legal boundaries, contact positioning, canonical metadata,
  preview noindex, and removal of prohibited product references.

## Remaining founder review

- Approve or request changes to the final specialist positioning.
- Confirm that every service listed reflects work presently offered.
- Confirm the wording “custom layered impact screens.”
- Confirm the intended commercial settings.
- Approve founder-owned project photography and publication rights when real
  project images become available.
- Provide any future verified licensing, permit, insurance, equipment,
  manufacturer, dealer, warranty, or service-area information before it is claimed.

## Immediate next action

Founder review of the protected preview. Do not merge or promote to production
until explicit founder approval is received.
