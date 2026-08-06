# Decision Log

Statuses:

- **Accepted:** established by the founderâ€™s project brief or required to keep
  the launch safe.
- **Proposed:** recommended architecture awaiting implementation validation or
  founder acceptance.
- **Superseded:** retained for history with a link to the replacement.

## ADR-001 â€” Next.js and Vercel

- **Status:** Accepted
- **Context:** The site needs rapid delivery, static/server-rendered marketing
  pages, one secure server-side form, strong performance, and easy deployment.
- **Decision:** Use stable Next.js App Router with TypeScript and Tailwind,
  hosted on Vercel.
- **Consequences:** One deployment platform covers pages and the contact server
  boundary; framework/runtime choices must remain compatible and pinned.
- **Reconsider when:** An approved platform constraint or operating requirement
  cannot be met without disproportionate complexity.

## ADR-002 â€” Canonical apex domain

- **Status:** Superseded by ADR-020
- **Context:** The founder has designated the official domain.
- **Decision:** Use `https://zarkaconstruction.com` as the canonical origin.
  Redirect `www` permanently to the apex while preserving path/query.
- **Consequences:** Metadata, sitemap, structured data, analytics, and internal
  absolute URLs use the apex.
- **Reconsider when:** Only through an explicit founder-approved domain strategy.

## ADR-003 â€” Keep GoDaddy as registrar during launch

- **Status:** Accepted
- **Context:** The domain is founder-owned and managed through GoDaddy; domain
  transfer is unnecessary for the website replacement.
- **Decision:** Retain registration at GoDaddy for initial launch.
- **Consequences:** Domain ownership remains under founder control; registrar
  transfer risk is removed from the launch.
- **Reconsider when:** After launch, as a separate operational decision with
  transfer-lock, renewal, privacy, and ownership review.

## ADR-004 â€” Record-level DNS update, no nameserver change

- **Status:** Accepted
- **Context:** Existing email and verification records are active.
- **Decision:** Keep GoDaddy DNS/nameservers and change only the apex and `www`
  website records required by Vercel.
- **Consequences:** MX, TXT, SPF, DKIM, DMARC, verification, CAA, SRV, and
  unrelated subdomains remain in place; a full inventory is mandatory.
- **Reconsider when:** A later DNS-host migration has a separately approved
  inventory, test, rollback, and operational rationale.

## ADR-005 â€” Landing-page-first information architecture

- **Status:** Accepted
- **Context:** The immediate need is a professional site that can launch quickly.
- **Decision:** Put the primary narrative on `/`; add only `/contact`,
  `/privacy`, and `/terms` in Phase 1.
- **Consequences:** Homepage anchors must work across routes; deeper portfolio
  and service pages wait for approved content.
- **Reconsider when:** Real content and visitor/search evidence justify a route.

## ADR-006 â€” No CMS in the MVP

- **Status:** Accepted
- **Context:** Four pages and configuration-driven content do not justify a
  publishing platform.
- **Decision:** Keep launch content typed and local.
- **Consequences:** Code review/deployment updates content; no CMS security or
  operations burden.
- **Reconsider when:** A non-developer publishing owner has a regular workflow.

## ADR-007 â€” No authentication

- **Status:** Superseded by ADR-025 and ADR-028
- **Context:** The launch is public marketing and contact, not a customer product.
- **Decision:** Do not implement accounts, protected routes, or user identity.
- **Consequences:** Smaller attack surface and scope.
- **Reconsider when:** A separately approved portal/integration use case defines
  users, authorization, support, and security.

## ADR-008 â€” No Supabase without an accepted persistence requirement

- **Status:** Superseded by ADR-024
- **Context:** Contact email does not inherently require a database.
- **Decision:** Do not configure Supabase for Phase 1.
- **Consequences:** Failed email cannot be described as durably queued; fallback
  behavior must be truthful.
- **Reconsider when:** Lead retention, uploads, portal data, or integration
  requirements define ownership, schema, access, and retention.

## ADR-009 â€” Related project links are configuration-driven

- **Status:** Accepted
- **Context:** CapProof and Precision Impact Screens have confirmed URLs; Bid
  Desk does not.
- **Decision:** Store project URL/status in typed configuration and render a
  non-linked card when URL is `null`.
- **Consequences:** No fabricated Bid Desk URL; later activation is a data change.
- **Reconsider when:** The ecosystem develops a shared navigation/API contract.

## ADR-010 â€” Logo assets remain replaceable

- **Status:** Accepted
- **Context:** The approved concept is not yet a verified production vector.
- **Decision:** Use an asset manifest, role-based `BrandMark`, reviewed temporary
  raster exports, and a text fallback.
- **Consequences:** Final SVG substitution does not rewrite layout components.
- **Reconsider when:** Final vectors and their usage system are formally approved;
  the configuration seam should remain.

## ADR-011 â€” No unsupported business claims

- **Status:** Accepted
- **Context:** Contact, service, licensing, insurance, and operating facts remain
  incomplete.
- **Decision:** Omit or clearly flag unresolved facts internally. Do not infer
  public claims.
- **Consequences:** Some launch content may be intentionally concise.
- **Reconsider when:** Founder-supplied facts and evidence are approved.

## ADR-012 â€” Signal Orange is a controlled accent

- **Status:** Accepted
- **Context:** The approved identity is navy-dominant and disciplined.
- **Decision:** Reserve `#F26A21` for primary CTAs, active/focus detail, key
  separators, and limited structural accents.
- **Consequences:** Orange does not become a page-sized background or default
  decorative color.
- **Reconsider when:** Only as a documented brand-system revision.

## ADR-013 â€” Server-side email contact with layered abuse protection

- **Status:** Accepted
- **Context:** The MVP needs reliable inquiries without a CRM/database.
- **Decision:** Use `POST /api/contact`, strict schema validation, same-origin
  checks, request limits, Resend, optional Turnstile, honeypot/timing signals,
  and configurable best-effort request limiting. Disable the public submit
  action honestly when Resend configuration is incomplete.
- **Consequences:** Requires verified sender/recipient and production testing;
  the privacy page must reflect processors.
- **Reconsider when:** Delivery/operations require durable queueing or a CRM.

## ADR-014 â€” Privacy-conscious first-party measurement

- **Status:** Accepted
- **Context:** Launch needs basic conversion and performance feedback.
- **Decision:** Use Vercel Analytics initially with small, PII-free custom events.
- **Consequences:** Reporting remains intentionally limited; implementation and
  privacy behavior must be verified against current product terms.
- **Reconsider when:** A defined reporting question requires another tool.

## ADR-015 â€” Conservative structured-data type

- **Status:** Accepted
- **Context:** Local-business details and general-contractor language are not
  confirmed.
- **Decision:** Start with `Organization` or another factually supported type and
  omit unknown fields.
- **Consequences:** Rich-result scope may be smaller but remains accurate.
- **Reconsider when:** Public contact/service/licensing facts are confirmed.

## ADR-016 â€” System font and text-only temporary brand assets

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

## ADR-017 â€” Temporary production URL remains non-indexable

- **Status:** Accepted
- **Context:** The site is live at a temporary `vercel.app` production alias
  before the canonical GoDaddy cutover.
- **Decision:** Default `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED` to `false`, emit
  noindex metadata, and disallow crawling until the canonical domain is ready.
- **Consequences:** Temporary testing does not compete with the current canonical
  website; Lighthouse SEO is intentionally reduced during this state.
- **Reconsider when:** Immediately before the approved domain cutover, set the
  value to `true`, redeploy, and verify canonical/robots behavior.

## ADR-018 â€” In-process rate limiting is defense in depth

- **Status:** Accepted
- **Context:** The MVP has no database or durable rate-limit store, and Vercel
  functions may run across multiple instances.
- **Decision:** Use a privacy-hashed configurable in-process window alongside
  validation, timing, and honeypot controls. Treat Turnstile and a Vercel
  Firewall/WAF rule as the production cross-instance protections.
- **Consequences:** The local limiter reduces repeat abuse per warm instance but
  is not represented as globally durable.
- **Reconsider when:** Inquiry volume or abuse justifies a shared store.

## ADR-019 â€” Founder-supplied raster artwork as the temporary production mark

- **Status:** Accepted
- **Context:** The founder supplied transparent raster exports of the approved
  impossible-geometry mark, stacked lockup, and favicon concept. The supplied
  â€œhorizontalâ€ file is visually stacked and is not suitable for a narrow header.
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

## ADR-020 â€” Canonical www domain with Vercel-owned hostname redirect

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

## ADR-021 â€” Simulator-room-builder-first public positioning

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
  evidence or a material change to the companyâ€™s intended business model.

## ADR-022 â€” Experience-first simulator-room storytelling

- **Status:** Accepted
- **Context:** Simulator-room-builder positioning established the correct category, but construction tasks and equipment relationships still carried too much of the public narrative. Prospects are ultimately creating a place to practice, play, gather, entertain, and enjoy golf throughout the year.
- **Decision:** Sell the experience of a professionally built golf simulator room. Golf and the life around the room lead the story; construction, planning, and technical coordination serve as evidence of how Zarka delivers it. Protect the philosophy: â€œWe don't build golf simulators. We build the spaces where great golf happens.â€ Use technical details to explain why the room plays and feels right, without presenting Zarka as an equipment seller or reducing the offer to an installation checklist.
- **Consequences:** Homepage hierarchy, service descriptions, simulator-page copy, contact language, metadata, and social imagery must emphasize the finished experience while preserving truthful scope boundaries. Project imagery remains founder-owned only, and missing photography remains an intentional editorial state rather than fabricated proof.
- **Reconsider when:** Only through an explicit founder-approved positioning change supported by customer evidence.

## ADR-023 â€” Golf Simulator Construction Specialist scope

- **Status:** Accepted
- **Context:** Premium residential and commercial prospects need a precise understanding of Zarka's present role. Broad phrases such as â€œcomplete roomâ€ can unintentionally imply general-contracting, permit, architectural, engineering, equipment-dealer, or complete-facility responsibility.
- **Decision:** Position Zarka Construction as a **Golf Simulator Construction Specialist focused on creating premium simulator environments while accurately representing its present capabilities**. Public scope may include room evaluation, simulator and construction planning, simulator-environment framing, impact-screen structures and custom layered screens, curtains, wall and ceiling protection, turf and hitting surfaces, finish carpentry, trim, finish detailing, room preparation, and coordination with qualified trades where required. Every project has a defined written scope. Do not imply equipment sales, manufacturer or dealer relationships, architectural or engineering services, permit authority, licensed-general-contractor status, complete commercial-facility construction, or responsibility outside that scope.
- **Consequences:** Residential and commercial settings remain welcome, but commercial language describes simulator environments within facilities rather than complete facility construction. Confidence comes from specificity, careful planning, craftsmanship, honest boundaries, and professional communication.
- **Reconsider when:** Founder-verified licenses, services, partnerships, or operating responsibilities materially change.


## ADR-024 â€” Supabase consultation system of record

- **Status:** Accepted
- **Decision:** Persist validated simulator consultations in Supabase Postgres
  and optional images in private Supabase Storage. Resend runs after persistence
  and is notification only. Use pending 24-hour sessions, generated one-object
  signed direct uploads, server verification, transactional finalization, and
  bounded abandoned-session cleanup.
- **Consequences:** Durable storage failure cannot report success. Email failure
  preserves the consultation and is visible to the founder. Privacy disclosures
  now include Supabase and private photographs.

## ADR-025 â€” Founder magic-link access plus server allowlist

- **Status:** Superseded by ADR-028
- **Decision:** Use Supabase magic-link Auth for a pre-created founder user and
  check `ADMIN_ALLOWED_EMAILS` server-side on every admin route and mutation.
- **Retained:** No public registration/customer login, the server allowlist, and
  the narrow private dashboard boundary remain accepted. Routine magic-link
  login is replaced by password login; email links remain recovery/setup only.

## ADR-026 â€” Response-bound Supabase auth cookies

- **Status:** Accepted
- **Context:** The PKCE callback exchanged a valid email-link code through a
  generic Server Component cookie helper and then created a separate redirect.
  Cookie-write failures were swallowed, so the redirect to `/admin` could arrive
  without a server-readable session and immediately return to `/admin/login`.
- **Decision:** Route Handlers that establish or clear authentication explicitly
  bind the `@supabase/ssr` cookie adapter to the response returned to the browser.
  Preserve Supabase cookie options, use host-only cookies without a hard-coded
  Domain, verify the authoritative user and server allowlist, and expose only
  fixed, non-sensitive errors.
- **Consequences:** Password sign-in, recovery, Preview, and Production sessions
  remain server-readable and isolated by hostname. Unauthorized users and
  sign-out clear cookies on the actual response.

## ADR-027 â€” Stable origin for Preview email callbacks

- **Status:** Accepted
- **Context:** Commit-specific Vercel Preview hostnames change after every
  deployment. PKCE verifier cookies cannot move between a commit host and a
  stable branch host.
- **Decision:** Use one stable branch origin for Preview password-recovery and
  legacy/setup callbacks. Redirect `/admin/forgot-password` to that origin before
  requesting recovery, configure it with `ADMIN_AUTH_ORIGIN`, and allow its exact
  `/auth/recovery` and `/auth/callback` URLs in Supabase. Password login itself
  does not require an email callback.
- **Consequences:** Recovery begins and ends on the host that owns the verifier
  cookie. Production remains request-origin based.

## ADR-028 â€” Founder password authentication with recovery-only email links

- **Status:** Accepted
- **Context:** Routine magic-link access created cross-host PKCE friction and
  required the founder to use email for every session. The existing pre-created
  founder Auth account can use Supabase-managed password credentials without a
  custom credential store or database migration.
- **Decision:** Use `signInWithPassword` for normal founder login. Keep
  `ADMIN_ALLOWED_EMAILS` as an independent server-side authorization check after
  Supabase identifies the user. Provide authenticated `/admin/set-password` and
  PKCE email recovery through `/admin/forgot-password`, `/auth/recovery`, and
  `/admin/reset-password`. Require 14 characters plus uppercase, lowercase,
  number, and symbol. Expose no signup or customer login.
- **Consequences:** Supabase remains responsible for credential hashing and
  verification. Passwords never enter application storage, logs, analytics,
  environment variables, or documentation. Recovery requires a verified
  allowlisted session plus a short-lived HttpOnly marker, and signs out after a
  successful reset. Same-origin checks, bounded rate limiting, generic errors,
  host-only cookies, and response-bound SSR writes reduce abuse and leakage.
- **Reconsider when:** The founder explicitly adopts phishing-resistant MFA or a
  managed identity provider and a separately reviewed migration plan exists.

## ADR-029 â€” Resend SMTP for Supabase Auth recovery delivery

- **Status:** Accepted
- **Context:** Supabase's built-in demonstration mailer imposed a restrictive
  recovery-email limit during founder password setup.
- **Decision:** Keep Supabase Auth responsible for recovery-token generation,
  PKCE exchange, sessions, and password updates, while using the native Resend
  SMTP integration to deliver Auth recovery messages from the verified
  `zarkaconstruction.com` domain.
- **Consequences:** Auth delivery is observable in Resend and is no longer bound
  to the built-in demonstration mailer. Supabase, Resend, and application abuse
  limits remain active. No SMTP credential enters application code or Vercel
  application variables.

## ADR-030 â€” Operating-system North Star and canonical master roadmap

- **Status:** Accepted
- **Context:** The project now includes a production website, durable
  consultations, private photos, founder authentication, and an operational
  dashboard. Overlapping historical phase numbers no longer provide a coherent
  long-term business sequence.
- **Decision:** Adopt `docs/VISION.md` as the governing philosophy and
  `docs/MASTER_ROADMAP.md` as the canonical future-feature roadmap. Reset the
  roadmap so the existing live system is Phase 0 and Projects/Inside the Build
  is Phase 1. Apply this mandatory North Star: â€œEvery feature must either help a
  customer make a confident hiring decision or help Zarka Construction deliver
  a better project. If it does neither, it does not belong.â€
- **Consequences:** Old phase labels become historical implementation context.
  Every future phase requires business-success evidence and exit criteria, not
  merely deployed software. Strategy or sequencing changes require founder
  approval and an ADR.

## ADR-031 â€” Public-first, approval-gated project publishing

- **Status:** Accepted
- **Context:** Active projects can create meaningful trust before completion,
  but project records, original media, customer information, and field notes are
  private operations.
- **Decision:** Treat active-project storytelling as the editorial default while
  retaining private-by-default data. A project may become public only after
  construction begins, rights and consent are confirmed, and the founder
  activates it. Every Inside the Build update begins privately and requires
  founder approval. Public content uses an explicit publication representation,
  never direct access to operational records.
- **Consequences:** The system must support draft, approval, publish, correction,
  and unpublish. Exact addresses, customer contact data, internal notes, costs,
  contracts, private schedules, and unapproved identities remain private.

## ADR-032 â€” Native founder controls instead of a general CMS

- **Status:** Accepted
- **Context:** Future homepage, SEO, availability, featured-project, messaging,
  and brand changes need founder ownership without introducing unrestricted
  publishing complexity.
- **Decision:** Add only bounded, validated site controls inside the existing
  founder dashboard when repeated operating use justifies them. Do not adopt a
  general-purpose CMS by default.
- **Consequences:** Public settings remain constrained by truth, brand,
  publication, preview, and rollback rules. A separate CMS may be reconsidered
  only when measured publishing volume and a defined owner prove the native
  controls insufficient.

## ADR-033 — Project source of truth and separate lifecycle dimensions

- **Status:** Accepted
- **Decision:** Store operational projects, updates, and original media privately. Keep operational status, project stage, public Build status, and publication status independent. Public pages use filtered server reads and only approved public media copies.
- **Consequences:** Nothing publishes automatically. Exact addresses, internal scope, notes, consultation data, and private originals cannot enter the public projection. Customer-facing UI says Builds; database and code retain projects.

## ADR-034 — Private originals and approved public media copies

- **Status:** Accepted
- **Decision:** Upload project originals directly to the private `project-media-private` bucket using short-lived signed upload authorization. Publishing requires caption, alt text, approval, and creates a separate object in `project-media-public`. Unpublishing removes that public copy.
- **Consequences:** Public URLs never expose original storage. Founder approval remains reversible. Supported images are JPEG, PNG, and WebP up to 15 MB each, ten per batch.
