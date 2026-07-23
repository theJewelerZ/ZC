# Progress

**Current phase:** Phase 0 — Foundation and Decisions  
**Canonical domain:** <https://zarkaconstruction.com>  
**Deployment target:** Vercel  
**Last updated:** July 22, 2026

## Work completed

- Established the canonical product, brand, information architecture, content,
  technical architecture, implementation, roadmap, SEO, deployment/cutover,
  decision, question, checklist, and asset baseline.
- Documented a small Phase 1 MVP with four routes and no application build yet.
- Defined configuration-driven business data, project links, and logo assets.
- Defined a server-validated Resend/Turnstile contact architecture with truthful
  failure behavior and no default database.
- Recorded public DNS observations and a record-level GoDaddy-to-Vercel cutover
  with rollback and explicit product-cancellation gates.

## Decisions made

- Canonical origin is the apex domain; `www` redirects to it.
- Keep GoDaddy as registrar and DNS host during initial launch.
- Change only website DNS records; do not change nameservers.
- Vercel/Next.js/Tailwind is the proposed delivery stack.
- Landing-page-first architecture; no CMS, authentication, or Supabase in MVP.
- Related project URLs and logo assets are configuration-driven.
- Bid Desk remains unlinked until its public URL is confirmed.
- Unsupported business claims are omitted.
- Signal Orange remains a controlled accent.

See `docs/DECISIONS.md` for status and consequences.

## Current blockers

- Founder-controlled GitHub and Vercel destinations/access
- GoDaddy DNS/Products access and complete authoritative zone inventory
- Confirmation of domain email provider/records and send/receive owner
- Contact recipient, verified Resend sender, and public fallback decision
- Approved launch services, delivery modes, service area, and copy
- Phone/email display, licensing, and insurance wording or explicit omission
- Temporary logo exports or approval of the text fallback
- Named final go/no-go approver

## Immediate next action

Founder reviews `docs/OPEN_QUESTIONS.md`, supplies the account/operational
launch gates through secure channels, and approves copy/service boundaries.
Then a coding agent begins Phase 1 without changing DNS.

## Next recommended implementation prompt

> Implement Phase 1 of the Zarka Construction Website from the canonical
> planning baseline in `C:\Users\mattz\ZC`. Read `AGENTS.md`, `README.md`,
> `progress.md`, and every file in `docs/` before editing. Initialize the
> approved Next.js/TypeScript/Tailwind application and build only the documented
> MVP routes and homepage sections. Use configuration-driven business details,
> ecosystem links, and logo assets; never invent missing claims or contact
> facts. Implement the server-validated Resend contact flow, Turnstile
> protection, accessible responsive UI, metadata, analytics, privacy and terms
> pages, and production verification described in the plans. Do not change DNS,
> cancel GoDaddy products, or begin post-MVP features. Run the documented
> quality checks, update relevant documentation and `progress.md`, and report
> unresolved launch gates.

