# Information Architecture

## Public sitemap

```text
/
├── #simulator-rooms
├── #planning
├── #planning-process
├── #projects
├── #capabilities
├── #about
└── #contact-cta
/simulator-construction
/contact
/privacy
/terms
```

The homepage owns the simulator-room-builder narrative. The dedicated simulator
route provides deeper planning and construction detail. No new public route is
required for this repositioning.

## Homepage sequence

1. **Header** — simulator-first navigation and one project CTA.
2. **Hero** — “Golf Simulator Room Builder” category and complete-room promise.
3. **Custom simulator solutions** — residential, commercial, conversion,
   impact, finish, planning, and coordination outcomes.
4. **Room feasibility and planning** — geometry and system dependencies.
5. **Planning process** — evaluation, coordination, construction, review, and
   the two consultation approaches.
6. **Projects** — future founder-owned photography slots; no invented proof.
7. **Construction credibility** — field experience supporting simulator work.
8. **About** — concise simulator-room-builder position and practical foundation.
9. **Contact CTA** — start an on-site or guided remote room review.
10. **Footer** — simulator navigation, project entry, and legal links.

This sequence targets approximately 80% simulator content, 15% construction
credibility, and 5% supporting systems.

## Navigation

Desktop and mobile order:

1. Simulator Rooms → `/simulator-construction`
2. Capabilities → `/#capabilities`
3. Planning Process → `/#planning-process`
4. Projects → `/#projects`
5. About → `/#about`
6. Contact → `/contact`

The primary button is **Plan a Simulator Room** and links to
`/contact?service=simulator-construction`. Homepage anchors use root-qualified
paths so they work from every route. Mobile behavior retains accessible button,
expanded state, Escape handling, keyboard order, and adequate touch targets.

## Footer

- Brand and approved statement
- Primary navigation
- Simulator construction, planning process, and room-review links
- Privacy and terms
- Legal identity and simulator-room positioning

No product directory, ecosystem links, public software cards, placeholder phone,
email, address, or unconfirmed service area.

## Primary visitor flow

```text
Referral or search
→ simulator-first homepage or /simulator-construction
→ room-planning explanation
→ Plan Your Simulator Room
→ /contact?service=simulator-construction
→ choose on-site consultation or guided remote review
→ validated, protected submission
→ accessible confirmation
```

## Residential flow

```text
Hero → Residential Simulator Rooms → planning dependencies
→ room review → contact
```

The visitor should understand that equipment choice alone does not establish
room feasibility.

## Commercial flow

```text
Hero → Commercial Simulator Bays → impact/durability/access coordination
→ detailed simulator page → room review → contact
```

Do not imply commercial capacity, operating geography, code responsibility, or
licensed-trade coverage beyond a confirmed scope.

## Project-proof flow

```text
Homepage Projects → real planning / construction / completed-room evidence
→ simulator detail → contact
```

Project images remain absent until founder-owned work is underway, publication
rights are confirmed, and context/alt text are approved. The upcoming secured
project is not published before construction begins.

## Contact architecture

The existing `/api/contact` backend remains the single delivery path. The form
adds a required, validated review preference:

- `on-site-consultation`
- `guided-remote-review`

Remote review copy explains that measurements and photographs are required in
follow-up. No upload field, storage, database, or scheduling system is added.

## Supporting systems

CapProof can be named only in a sentence describing professional field
documentation. Bid Desk remains invisible publicly; its operational value is
expressed through organized estimating, scopes, and assumptions. Precision
Impact Screens has no public IA node, link, card, footer entry, metadata entry,
or conversion path.

## Future expansion

Add only after factual content and founder approval:

- `/projects` and `/projects/[project]` with founder-owned media
- focused residential/commercial simulator pages when each has distinct value
- real service-area pages with confirmed operating boundaries
- useful planning guidance with an editorial owner

Do not add a CMS, database, configurator, estimator, store, portal, dashboard,
authentication, or equipment catalog merely to support these paths.