# Decision Log

Statuses:

- **Accepted:** established by the founder’s project brief or required to keep
  the launch safe.
- **Proposed:** recommended architecture awaiting implementation validation or
  founder acceptance.
- **Superseded:** retained for history with a link to the replacement.

## ADR-001 — Next.js and Vercel

- **Status:** Proposed
- **Context:** The site needs rapid delivery, static/server-rendered marketing
  pages, one secure server-side form, strong performance, and easy deployment.
- **Decision:** Use stable Next.js App Router with TypeScript and Tailwind,
  hosted on Vercel.
- **Consequences:** One deployment platform covers pages and the contact server
  boundary; framework/runtime choices must remain compatible and pinned.
- **Reconsider when:** An approved platform constraint or operating requirement
  cannot be met without disproportionate complexity.

## ADR-002 — Canonical apex domain

- **Status:** Accepted
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

- **Status:** Proposed
- **Context:** The MVP needs reliable inquiries without a CRM/database.
- **Decision:** Use one Next.js server boundary, strict schema validation,
  Resend, Turnstile, honeypot/timing signals, and lightweight rate limiting.
- **Consequences:** Requires verified sender/recipient and production testing;
  the privacy page must reflect processors.
- **Reconsider when:** Delivery/operations require durable queueing or a CRM.

## ADR-014 — Privacy-conscious first-party measurement

- **Status:** Proposed
- **Context:** Launch needs basic conversion and performance feedback.
- **Decision:** Use Vercel Analytics initially with small, PII-free custom events.
- **Consequences:** Reporting remains intentionally limited; implementation and
  privacy behavior must be verified against current product terms.
- **Reconsider when:** A defined reporting question requires another tool.

## ADR-015 — Conservative structured-data type

- **Status:** Proposed
- **Context:** Local-business details and general-contractor language are not
  confirmed.
- **Decision:** Start with `Organization` or another factually supported type and
  omit unknown fields.
- **Consequences:** Rich-result scope may be smaller but remains accurate.
- **Reconsider when:** Public contact/service/licensing facts are confirmed.

