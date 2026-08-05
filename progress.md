# Progress

**Current phase:** Phase 2 — experience-first simulator-room positioning

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Feature branch:** `phase-2/simulator-construction`

**Last updated:** August 4, 2026

## Production status

The existing production release remains live and unchanged. This experience-led
refinement has not been merged, promoted, or connected to production. DNS,
nameservers, email records, GoDaddy products, and Vercel domain settings were
not changed.

## Accepted positioning

Zarka Construction remains positioned as a **Golf Simulator Room Builder**, now
with the finished golf experience as the emotional center of the website.

Protected philosophy:

> We don't build golf simulators. We build the spaces where great golf happens.

Hero direction:

> We Build the Room Around the Game.

Golf, practice, play, gathering, and lasting enjoyment lead the narrative.
Construction, planning, craftsmanship, and technology coordination explain how
Zarka creates the result. ADR-022 records this refinement.

## Implementation completed

- Replaced the equipment-led hero with “We Build the Room Around the Game.”
- Standardized the primary action as “Request a Simulator Consultation.”
- Added an understated “It's More Than a Simulator” storytelling section around
  practice, family and friends, clients, improvement, and year-round enjoyment.
- Added the primary differentiator: “We Don't Install Golf Simulators. We Build
  Golf Simulator Rooms.”
- Reframed planning detail around confident swings, natural sightlines,
  comfortable movement, and a resolved room.
- Rewrote solution cards around complete residential and commercial room
  experiences rather than a trade list.
- Reframed the project area around honest founder-owned proof without publishing
  fake, stock, AI-generated, or premature project imagery.
- Rewrote construction credibility and About copy so field experience supports
  the simulator-room philosophy.
- Reworked the dedicated simulator page from checklist-led headings to
  golfer-led outcomes while retaining technical and trade-scope boundaries.
- Refocused the contact page on the room and golf experience the prospect wants
  to create; the existing backend and review options remain unchanged.
- Updated metadata, Open Graph messaging, structured-data descriptions, typed
  service/process copy, and header CTAs.
- Added no routes, products, CMS, Supabase, database, authentication, uploads,
  store, estimator, animations, or production changes.

## Verification completed

- `npm run check`: pass
  - ESLint: pass
  - TypeScript: pass
  - Vitest: 24 tests pass across 8 files
  - Production build: pass; all 13 routes generated
- HTTP 200 verified locally for `/`, `/simulator-construction`, simulator-
  preselected `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, and
  `/robots.txt`.
- Public copy checks: protected philosophy present on homepage and simulator
  page; no Precision Impact Screens or Bid Desk references.
- Canonical metadata remains `https://www.zarkaconstruction.com`; protected
  preview remains noindex.
- Responsive review completed at 320, 375, 768, 1024, and 1440 CSS pixels.
  True 320px Lighthouse emulation confirms correct wrapping and fully visible
  CTAs; tablet and desktop captures show the intended hierarchy.
- An initial low-contrast eyebrow in the new navy differentiator panel was
  corrected before commit.
- Final Lighthouse:
  - Homepage: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - Simulator page: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - Contact page: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - True 320px homepage: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse occasionally reports Windows temporary-folder cleanup `EPERM`
  after writing a valid report; saved report results are complete.

## Git and preview

- Application commit: `ed5122b` — Center simulator site on the golf experience
- Strategy documentation commit: `c28a14b` — Document experience-first
  simulator positioning
- Both commits are pushed to `origin/phase-2/simulator-construction`.
- Protected preview deployment: `dpl_3eFavDdhHEf9LaNdYBQBU2qxY89A`
- Preview URL:
  <https://zarka-construction-fqh2vmkmw-matthews-projects-7e2a9d39.vercel.app>
- Deployment target: preview; status: Ready.
- Authenticated preview checks passed for the hero, protected philosophy,
  dedicated simulator page, contact entry, canonical metadata, preview noindex,
  and prohibited-reference removal.

## Remaining founder content

- Approval of the experience-first protected preview
- Founder-owned simulator project photography and publication rights
- Approved project titles, verified scope facts, broad locations if publishable,
  crops, and alt text after real construction begins
- Confirmed public service-area wording, if any
- Any verified equipment, manufacturer, dealer, certification, or warranty
  relationships; none are claimed

## Immediate next action

Founder review of the protected preview. Do not merge or promote to production
until the founder explicitly approves this experience-first direction.
