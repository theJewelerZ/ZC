# Progress

**Current phase:** Phase 1 — Professional Launch MVP implemented; temporary
production verification in progress

**Canonical domain:** <https://zarkaconstruction.com>

**Temporary production URL:** <https://zarka-construction.vercel.app>

**Deployment target:** Vercel project `zarka-construction`

**Last updated:** July 23, 2026

## Work completed

- Initialized Git on `main` and created logical planning, foundation, marketing,
  contact, legal/SEO, and accessibility commits.
- Implemented Next.js 16 App Router, React 19, strict TypeScript, Tailwind 4,
  ESLint, Vitest, and a locked npm dependency tree.
- Built `/`, `/contact`, `/privacy`, `/terms`, generated sitemap/robots,
  generated favicon/touch/Open Graph assets, and a branded 404.
- Built the complete responsive homepage with brand shell, hero, six services,
  prominent simulator section, Why Zarka, capabilities, ecosystem, credibility,
  contact CTA, and footer.
- Implemented typed business/services/project/asset configuration. Unknown
  phone, email, area, licensing, insurance, social, and logo paths remain null.
- Implemented the text logo fallback; no raster/vector logo or photography was
  fabricated.
- Implemented `POST /api/contact` with strict validation, same-origin and body
  checks, honeypot/timing checks, privacy-hashed best-effort rate limiting,
  optional Turnstile, escaped HTML/plain-text Resend delivery, visitor reply-to,
  correlation IDs, PII-minimized logs, and honest disabled/failure states.
- Added Vercel Analytics and PII-free CTA/form/ecosystem event preparation.
- Added factual `Organization` JSON-LD, per-route canonical metadata, social
  metadata, and deliberate noindex/robots control for temporary production.
- Deployed and smoke-tested <https://zarka-construction.vercel.app>. All public
  routes return expected status codes; the disabled contact API returns 503
  rather than pretending delivery.
- Verified both confirmed external ecosystem URLs respond over HTTPS.
- Made no GoDaddy, production-domain, nameserver, email-DNS, or product changes.

## Verification

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm test`: 12 tests pass across four files
- `npm run build`: pass; all marketing/legal routes statically rendered and
  `/api/contact` dynamic
- `npm audit --json`: zero known vulnerabilities
- Internal route, anchor, canonical metadata, sitemap, robots, 404, disabled
  delivery, and external-link review: pass
- Headless Chrome desktop, narrow, and contact-page visual review: pass
- Lighthouse mobile:
  - Performance: 100
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 66 while noindex is intentionally enabled; `is-crawlable` is the
    expected deduction until canonical-domain cutover
  - FCP: 0.8 s, LCP: 1.7 s, CLS: 0, TBT: 10 ms in the local production audit

## Temporary fallbacks

- Typeset ZARKA / CONSTRUCTION wordmark and text icon replace missing approved
  logo exports.
- Generated brand-only favicon, touch icon, and Open Graph image replace missing
  production artwork.
- Abstract structural geometry replaces unavailable approved project photography.
- Contact submission is visibly disabled because no recipient/sender/API key is
  configured; no visitor data is sent or stored.
- Turnstile is inactive; honeypot, timing, validation, and best-effort rate
  limiting remain active at the API boundary.
- Search indexing is disabled for the temporary Vercel production URL.

## Production configuration still required

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for production
  cross-instance form abuse protection
- Confirmed public contact/privacy-request method
- Confirmed service area, if it should be published
- Final approved logo assets and optional project photography
- Founder-controlled GitHub repository destination and branch protection
- GoDaddy access plus authoritative DNS/product inventory
- Named launch copy and canonical-domain go/no-go approver

## Immediate next action

Configure and verify the three Resend variables and the two Turnstile variables
in the Vercel Production environment, redeploy, and submit a real inquiry through
the temporary production URL. Do not add the custom domain until delivery,
reply-to, abuse protection, privacy contact wording, and founder copy approval
pass.

## Remaining canonical-domain sequence

1. Complete the authoritative GoDaddy DNS/product inventory and mail test.
2. Configure/verify Resend sender DNS without modifying unrelated records.
3. Configure Turnstile for the temporary alias and future canonical hosts.
4. Replace the privacy/terms contact-method TODO through confirmed business config.
5. Run a real form delivery/reply test and final founder review.
6. Set `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true` and redeploy only at the
   approved cutover.
7. Add apex and `www` to Vercel and capture exact project-specific DNS targets.
8. Change only the confirmed apex/`www` website records in GoDaddy, then perform
   the documented cutover, mail, SSL, redirect, analytics, and rollback checks.

## Next recommended prompt

> Complete the Zarka Construction production-contact configuration and
> canonical-domain readiness review. Read `AGENTS.md`, `progress.md`,
> `docs/OPEN_QUESTIONS.md`, `docs/LAUNCH_CHECKLIST.md`, and
> `docs/DEPLOYMENT_AND_DOMAIN_CUTOVER.md`. Configure only founder-supplied
> Resend, contact-recipient, public contact, and Turnstile values in Vercel;
> never place secrets in the repository. Redeploy and verify real contact
> delivery, visitor reply-to, Turnstile, analytics, all routes, and privacy
> wording through the temporary production URL. Inventory GoDaddy DNS and
> products without changing them. Stop before any DNS or cancellation action
> and report the exact cutover targets, rollback values, and remaining go/no-go
> conditions.
