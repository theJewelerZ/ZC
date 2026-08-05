# Decision Log

Statuses:

- **Accepted:** established by the founder’s project brief or required to keep
  the launch safe.
- **Proposed:** recommended architecture awaiting implementation validation or
  founder acceptance.
- **Superseded:** retained for history with a link to the replacement.

## ADR-001 — Next.js and Vercel

- **Status:** Accepted
- **Context:** The site needs rapid delivery, static/server-rendered marketing
  pages, one secure server-side form, strong performance, and easy deployment.
- **Decision:** Use stable Next.js App Router with TypeScript and Tailwind,
  hosted on Vercel.
- **Consequences:** One deployment platform covers pages and the contact server
  boundary; framework/runtime choices must remain compatible and pinned.
- **Reconsider when:** An approved platform constraint or operating requirement
  cannot be met without disproportionate complexity.

## ADR-002 — Canonical apex domain

- **Status:** Superseded by ADR-020
- **Context:** The founder has designated the official domain.
- **Decision:** Use `https://zarkaconstruction.com` as the canonical origin.
  Redirect `www` permanently to the apex while preserving path/query.
- **Consequences:** Metadata, sitemap, structured data, analytics, and internal
  absolute URLs use the apex.
- **Reconsider when:** Only through an explicit founder-approved domain strategy.

## ADR-003 — Keep GoDaddy as registrar during launch

- **Status:** Accepted
- **Context:** The domain is founder-owned and managed through GoDaddy; domain
  transfer is unnecessary for the website replacement.
- **Decision:** Retain registration at GoDaddy for initial launch.
- **Consequences:** Domain ownership remains under founder control; registrar
  transfer risk is removed from the launch.
- **Reconsider when:** After launch, as a separate operational decision with
  transfer-lock, renewal, privacy, and ownership review.

## ADR-004 — Record-level DNS update, no nameserver change

- **Status:** Accepted
- **Context:** Existing email and verification records are active.
- **Decision:** Keep GoDaddy DNS/nameservers and change only the apex and `www`
  website records required by Vercel.
- **Consequences:** MX, TXT, SPF, DKIM, DMARC, verification, CAA, SRV, and
  unrelated subdomains remain in place; a full inventory is mandatory.
- **Reconsider when:** A later DNS-host migration has a separately approved
  inventory, test, rollback, and operational rationale.

## ADR-005 — Landing-page-first information architecture

- **Status:** Accepted
- **Context:** The immediate need is a professional site that can launch quickly.
- **Decision:** Put the primary narrative on `/`; add only `/contact`,
  `/privacy`, and `/terms` in Phase 1.
- **Consequences:** Homepage anchors must work across routes; deeper portfolio
  and service pages wait for approved content.
- **Reconsider when:** Real content and visitor/search evidence justify a route.

## ADR-006 — No CMS in the MVP

- **Status:** Accepted
- **Context:** Four pages and configuration-driven content do not justify a
  publishing platform.
- **Decision:** Keep launch content typed and local.
- **Consequences:** Code review/deployment updates content; no CMS security or
  operations burden.
- **Reconsider when:** A non-developer publishing owner has a regular workflow.

## ADR-007 — No authentication

- **Status:** Accepted
- **Context:** The launch is public marketing and contact, not a customer product.
- **Decision:** Do not implement accounts, protected routes, or user identity.
- **Consequences:** Smaller attack surface and scope.
- **Reconsider when:** A separately approved portal/integration use case defines
  users, authorization, support, and security.

## ADR-008 — No Supabase without an accepted persistence requirement

- **Status:** Accepted
- **Context:** Contact email does not inherently require a database.
- **Decision:** Do not configure Supabase for Phase 1.
- **Consequences:** Failed email cannot be described as durably queued; fallback
  behavior must be truthful.
- **Reconsider when:** Lead retention, uploads, portal data, or integration
  requirements define ownership, schema, access, and retention.

## ADR-009 — Related project links are configuration-driven

- **Status:** Accepted
- **Context:** CapProof and Precision Impact Screens have confirmed URLs; Bid
  Desk does not.
- **Decision:** Store project URL/status in typed configuration and render a
  non-linked card when URL is `null`.
- **Consequences:** No fabricated Bid Desk URL; later activation is a data change.
- **Reconsider when:** The ecosystem develops a shared navigation/API contract.

## ADR-010 — Logo assets remain replaceable

- **Status:** Accepted
- **Context:** The approved concept is not yet a verified production vector.
- **Decision:** Use an asset manifest, role-based `BrandMark`, reviewed temporary
  raster exports, and a text fallback.
- **Consequences:** Final SVG substitution does not rewrite layout components.
- **Reconsider when:** Final vectors and their usage system are formally approved;
  the configuration seam should remain.

## ADR-011 — No unsupported business claims

- **Status:** Accepted
- **Context:** Contact, service, licensing, insurance, and operating facts remain
  incomplete.
- **Decision:** Omit or clearly flag unresolved facts internally. Do not infer
  public claims.
- **Consequences:** Some launch content may be intentionally concise.
- **Reconsider when:** Founder-supplied facts and evidence are approved.

## ADR-012 — Signal Orange is a controlled accent

- **Status:** Accepted
- **Context:** The approved identity is navy-dominant and disciplined.
- **Decision:** Reserve `#F26A21` for primary CTAs, active/focus detail, key
  separators, and limited structural accents.
- **Consequences:** Orange does not become a page-sized background or default
  decorative color.
- **Reconsider when:** Only as a documented brand-system revision.

## ADR-013 — Server-side email contact with layered abuse protection

- **Status:** Accepted
- **Context:** The MVP needs reliable inquiries without a CRM/database.
- **Decision:** Use `POST /api/contact`, strict schema validation, same-origin
  checks, request limits, Resend, optional Turnstile, honeypot/timing signals,
  and configurable best-effort request limiting. Disable the public submit
  action honestly when Resend configuration is incomplete.
- **Consequences:** Requires verified sender/recipient and production testing;
  the privacy page must reflect processors.
- **Reconsider when:** Delivery/operations require durable queueing or a CRM.

## ADR-014 — Privacy-conscious first-party measurement

- **Status:** Accepted
- **Context:** Launch needs basic conversion and performance feedback.
- **Decision:** Use Vercel Analytics initially with small, PII-free custom events.
- **Consequences:** Reporting remains intentionally limited; implementation and
  privacy behavior must be verified against current product terms.
- **Reconsider when:** A defined reporting question requires another tool.

## ADR-015 — Conservative structured-data type

- **Status:** Accepted
- **Context:** Local-business details and general-contractor language are not
  confirmed.
- **Decision:** Start with `Organization` or another factually supported type and
  omit unknown fields.
- **Consequences:** Rich-result scope may be smaller but remains accurate.
- **Reconsider when:** Public contact/service/licensing facts are confirmed.

## ADR-016 — System font and text-only temporary brand assets

- **Status:** Superseded by ADR-019 for logo artwork; system-font decision remains
  accepted
- **Context:** No approved production logo raster/vector or project photography
  is present, and remote font downloads add no necessary launch value.
- **Decision:** Use a disciplined system sans-serif stack, a configuration-driven
  text wordmark, generated text favicon/touch icons, and a brand-only generated
  Open Graph image.
- **Consequences:** The launch is fast and visually coherent without inventing a
  logo. Approved assets can replace paths/components at the existing seams.
- **Reconsider when:** Professionally approved logo exports and image rights are
  supplied.

## ADR-017 — Temporary production URL remains non-indexable

- **Status:** Accepted
- **Context:** The site is live at a temporary `vercel.app` production alias
  before the canonical GoDaddy cutover.
- **Decision:** Default `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED` to `false`, emit
  noindex metadata, and disallow crawling until the canonical domain is ready.
- **Consequences:** Temporary testing does not compete with the current canonical
  website; Lighthouse SEO is intentionally reduced during this state.
- **Reconsider when:** Immediately before the approved domain cutover, set the
  value to `true`, redeploy, and verify canonical/robots behavior.

## ADR-018 — In-process rate limiting is defense in depth

- **Status:** Accepted
- **Context:** The MVP has no database or durable rate-limit store, and Vercel
  functions may run across multiple instances.
- **Decision:** Use a privacy-hashed configurable in-process window alongside
  validation, timing, and honeypot controls. Treat Turnstile and a Vercel
  Firewall/WAF rule as the production cross-instance protections.
- **Consequences:** The local limiter reduces repeat abuse per warm instance but
  is not represented as globally durable.
- **Reconsider when:** Inquiry volume or abuse justifies a shared store.

## ADR-019 — Founder-supplied raster artwork as the temporary production mark

- **Status:** Accepted
- **Context:** The founder supplied transparent raster exports of the approved
  impossible-geometry mark, stacked lockup, and favicon concept. The supplied
  “horizontal” file is visually stacked and is not suitable for a narrow header.
- **Decision:** Preserve source files under `assets/brand-source`, publish
  lossless trimmed derivatives under `public/brand`, use the approved mark with
  the typeset wordmark in the shared shell and hero, and derive metadata icons
  deterministically from the supplied favicon. Do not redraw or claim vector
  status.
- **Consequences:** The real approved concept is now visible without squeezing a
  stacked presentation into the header. The configuration seam still supports
  later light/dark horizontal SVG replacement without page rewrites.
- **Reconsider when:** Professionally recreated and rights-confirmed SVG
  deliverables are approved.

## ADR-020 — Canonical www domain with Vercel-owned hostname redirect

- **Status:** Accepted
- **Context:** The founder designated `https://www.zarkaconstruction.com` as the
  canonical origin. Vercel project-domain configuration already redirects the
  apex to `www` with status 308. A legacy Next.js rule redirected `www` back to
  the apex, creating an alternating 308 loop.
- **Decision:** Use `https://www.zarkaconstruction.com` for canonical metadata,
  sitemap, robots, structured data, and absolute URLs. Keep the Vercel project
  domain setting as the sole apex-to-`www` redirect source. Do not duplicate
  hostname redirects in Next.js, middleware, route handlers, or `vercel.json`.
- **Consequences:** The apex redirects once at Vercel, while `www` serves the
  application directly. Path and query preservation are controlled and tested
  at the Vercel domain layer.
- **Reconsider when:** Only through an explicit founder-approved canonical-host
  change accompanied by coordinated Vercel, application, SEO, and test updates.

## ADR-021 — Simulator-room-builder-first public positioning

- **Status:** Accepted
- **Context:** The founder approved a deliberate change from broad construction
  positioning to a focused category position built around custom indoor golf
  simulator rooms. General construction capability now supports credibility;
  it no longer competes with the primary offer. Precision Impact Screens is no
  longer part of the public website, while CapProof and Bid Desk operate only as
  internal advantages in documentation, estimating, scopes, and assumptions.
- **Decision:** Position Zarka Construction publicly as a **Golf Simulator Room
  Builder**. Lead with residential and commercial custom simulator rooms, room
  feasibility, planning, construction, protection, finish integration, and
  coordination. Use the existing `/simulator-construction` route and feature
  branch as the foundation. Remove all public Precision Impact Screens and
  software-product cards. Mention CapProof only as part of the professional
  documentation process; express Bid Desk only through organized scopes,
  estimating, and documented assumptions without naming it publicly. Guide
  inquiries toward an on-site consultation or guided remote room review.
- **Consequences:** The homepage, navigation, contact flow, metadata, structured
  data, legal copy, analytics vocabulary, and canonical documentation must tell
  one simulator-room-builder story. Existing general construction services
  remain secondary evidence. No product catalog, equipment sales, uploads,
  database, CMS, authentication, estimator, or customer portal is added.
- **Reconsider when:** Only after founder approval supported by qualified-lead
  evidence or a material change to the company’s intended business model.

## ADR-022 — Experience-first simulator-room storytelling

- **Status:** Accepted
- **Context:** Simulator-room-builder positioning established the correct category, but construction tasks and equipment relationships still carried too much of the public narrative. Prospects are ultimately creating a place to practice, play, gather, entertain, and enjoy golf throughout the year.
- **Decision:** Sell the experience of a professionally built golf simulator room. Golf and the life around the room lead the story; construction, planning, and technical coordination serve as evidence of how Zarka delivers it. Protect the philosophy: “We don't build golf simulators. We build the spaces where great golf happens.” Use technical details to explain why the room plays and feels right, without presenting Zarka as an equipment seller or reducing the offer to an installation checklist.
- **Consequences:** Homepage hierarchy, service descriptions, simulator-page copy, contact language, metadata, and social imagery must emphasize the finished experience while preserving truthful scope boundaries. Project imagery remains founder-owned only, and missing photography remains an intentional editorial state rather than fabricated proof.
- **Reconsider when:** Only through an explicit founder-approved positioning change supported by customer evidence.
