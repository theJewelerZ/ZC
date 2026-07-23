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

- Phase 1 routes: `/`, `/contact`, `/privacy`, `/terms`.
- Prefer Server Components/static rendering; add client code only for required
  interaction.
- Keep dependencies small. No CMS, authentication, CRM, portal, scheduling,
  uploads, AI chat, online estimating, or Supabase without explicit approval.
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
