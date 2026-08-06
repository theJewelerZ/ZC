# Agent Instructions

## Purpose

Build and maintain the official Zarka Construction LLC website: a professional,
mobile-first construction and specialty-installation front door at
`https://www.zarkaconstruction.com`.

## Start here

Read `README.md`, `progress.md`, and all relevant files in `docs/` before
changing code. Treat them as the canonical product and architecture baseline.
If implementation requires a conflicting choice, update `docs/DECISIONS.md`
with rationale before proceeding.

## Architecture boundaries

- Public routes include `/`, `/simulator-construction`, `/projects`, `/projects/[slug]`, `/contact`, `/privacy`, and `/terms`.
- Private operations include `/admin` and founder-only `/field`; both require server authorization, no-store, and noindex.
- Prefer Server Components/static rendering; add client code only for required
  interaction.
- Keep dependencies small. Supabase Auth, consultation/project persistence, private media, and Field Mode are approved. No CMS, customer accounts, CRM, portal, scheduling, AI chat, online estimating, offline synchronization, or native app without explicit approval.
- Business facts, services, navigation, related projects, and asset paths are
  typed configuration—not scattered literals.
- Bid Desk has no link until a confirmed URL is supplied.
- Components should express real reuse/semantics; avoid speculative abstraction.

## Naming and style

- TypeScript identifiers: `camelCase`; components/types: `PascalCase`;
  constants only when truly immutable: `UPPER_SNAKE_CASE`.
- Routes, asset names, slugs, CSS variables, and analytics events use lowercase
  kebab-case except the documented snake_case analytics event names.
- Use semantic HTML, clear module names, and small focused functions.
- Preserve exact public brand spelling: Zarka Construction LLC where legal name
  is appropriate; Zarka Construction in normal marketing copy.

## Quality and truth

- Never invent address, phone, email, radius, license, insurance, years, staff,
  customers, reviews, awards, memberships, certifications, warranties, dealer
  status, metrics, projects, testimonials, or partner relationships.
- Omit unresolved public values; do not render TODO strings.
- Distinguish Zarka-performed services, coordinated trade work, software, and
  future offerings.
- Target WCAG 2.2 AA, excellent mobile behavior, strong Core Web Vitals, strict
  server validation, safe error handling, and PII-minimized logging/analytics.
- Test keyboard, focus, mobile menu, form errors/status, 200% zoom, reduced
  motion, contrast, responsive overflow, links, metadata, and production build.

## Brand

- Exact tokens: Navy `#0B1F33`, Orange `#F26A21`, Structural White `#F7F9FB`,
  Steel Gray `#66717D`, Carbon `#121820`.
- Navy dominates; Orange is a controlled CTA/structural accent.
- Do not fabricate a font or claim the concept logo is a verified SVG.
- Logo variants must remain replaceable through an asset manifest and text
  fallback. Do not trace or crop a brand-board screenshot as the final logo.
- Avoid generic contractor icons, fake textures, neon/glass effects, oversized
  orange backgrounds, and gratuitous animation.

## Documentation

Update the relevant brief/architecture/decision/checklist when behavior, scope,
providers, environment variables, public content, or deployment procedures
change. Keep `progress.md` current at every meaningful handoff: phase, completed
work, decisions, blockers, immediate next action, and next prompt.

## Deployment safeguards

- Never commit secrets or private DNS/account exports.
- Deploy and test at the Vercel URL before custom-domain changes.
- Do not change DNS unless explicitly authorized for the cutover.
- Keep GoDaddy as registrar/DNS host during initial launch; do not change
  nameservers.
- Inventory and preserve all MX, TXT, CNAME, SPF, DKIM, DMARC, CAA, SRV,
  verification, email, and unrelated subdomain records.
- Change only confirmed apex/`www` website records using exact Vercel values.
- Verify apex, `www`, HTTPS, redirects, form, analytics, email, and rollback.
- Never cancel a GoDaddy product without explicit authorization. The unwanted
  website product can be canceled only after the complete production success
  gate; retain domain registration, DNS, and active email services.


## Phase 3 consultation boundaries

Supabase consultation persistence, private optional room-photo uploads, and the
founder-only /admin review surface are explicitly approved on
phase-3/consultation-dashboard. Supabase is the system of record; Resend is a
notification channel. Do not expand this into a CRM, customer account, portal,
estimate, proposal, invoice, scheduler, employee-role system, or cross-product
integration. Keep all consultation reads and mutations server-authorized, keep
the service credential out of browser/SSR clients, preserve forced RLS/private
Storage, and never place PII in analytics or routine logs.

## Field Mode boundaries

- Field Mode is online-first and founder-only. Never cache authenticated data publicly.
- Field photos and notes are private by default. Candidate is not published.
- Only full admin review may approve and publish a separate public media copy.
- Reuse signed private-upload validation; never accept arbitrary storage paths.
- Do not add offline queues, background sync, crew accounts, analytics, or Site Controls during Phase 2.

## Phase 3 boundaries

- Mission Control is action-first and derived from bounded existing-data queries.
- Do not fabricate attention items, health state, page views, or conversion metrics.
- Keep private pages server-authorized, dynamic, no-store, and noindex.
- Configuration health may expose availability only, never values or raw provider errors.
- Premium refinement means restraint, clarity, precision, consistency, and speed.
- Site Controls, CMS capabilities, CRM pipelines, customer accounts, and speculative analytics remain out of scope.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
