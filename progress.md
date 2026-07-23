# Progress

**Current phase:** Phase 1.5 — Production Readiness

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Deployment target:** Vercel project `zarka-construction`

**Latest verified deployment:** `dpl_9UMjS4azHyuaw3MPutdinqrPnPv5`

**Last updated:** July 23, 2026

## Current production status

The Phase 1 marketing site is live on the canonical `www` domain. Search
indexing is enabled only in Vercel Production. The apex redirect, HTTPS,
canonical metadata, public routes, generated SEO files, security headers, brand
assets, responsive layout, and accessibility checks pass.

Contact infrastructure and all required server-only Vercel environment
variables are configured. A real production request reached the endpoint but
Resend rejected delivery because `zarkaconstruction.com` is not a verified
sender domain in the configured Resend account. The endpoint returned an honest
502 response and did not claim delivery. Resend reports only `capproof.com` as a
verified domain. Do not substitute that unrelated sender; verify the Zarka
sender domain before enabling public reliance on the form.

## Phase 1.5 work completed

- Reviewed every public route and removed internal MVP, placeholder, and
  pre-cutover wording from capability, privacy, and terms content.
- Preserved the approved positioning, CTA hierarchy, service scope, and brand
  system without adding sections, routes, claims, or Phase 2 functionality.
- Improved Resend email output with clear contact/project grouping, submission
  timestamp, escaped HTML formatting, and a readable plain-text fallback.
- Added automated verification of recipient, configured sender, visitor
  `reply_to`, HTML/text payloads, provider rejection, disabled delivery, request
  size limits, and production indexing behavior.
- Hardened `POST /api/contact` to reject unsupported content types and oversized
  bodies even when `Content-Length` is absent.
- Configured existing non-empty Resend and rate-limit values in Vercel
  Production without exposing or committing secrets.
- Enabled `NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true` only in Vercel Production.
- Corrected the contact layout at the 768px tablet breakpoint.
- Added responsive image `sizes` so the small header mark no longer downloads a
  desktop-scale raster. Lighthouse image-delivery waste dropped from about
  103 KiB to zero.
- Made no GoDaddy DNS, nameserver, MX, TXT, email-record, or product changes.

## Verification

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm test`: 20 tests pass across seven files
- Production build with indexing enabled: pass
- Public `/`, `/contact`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`,
  Open Graph image, favicon, and Apple icon: HTTP 200
- `robots.txt`: allows `/` and names the canonical `www` sitemap
- Metadata: `index, follow`, canonical `www`, Open Graph/Twitter data present,
  factual Organization JSON-LD present, and no temporary Vercel URL in public
  HTML
- Security headers: CSP, HSTS, `DENY` frame policy, MIME sniffing protection,
  strict referrer policy, and restricted permissions policy present
- Responsive review: 320, 375, 390, 414, 768, 1024, 1280, 1440, and 1920 CSS
  pixels; no page-level horizontal overflow
- Accessibility: Lighthouse 100; semantic landmarks, heading hierarchy, labels,
  live error/status behavior, keyboard focus, skip link, mobile navigation, and
  decorative-image treatment reviewed
- Final Lighthouse mobile:
  - Performance: 98
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
  - FCP: 0.9 s
  - LCP: 2.4 s
  - TBT: 10 ms
  - CLS: 0
- Real production contact test:
  - Endpoint and validation path: reached
  - Result: honest HTTP 502; message not accepted by Resend
  - Cause: configured `zarkaconstruction.com` sender domain is not verified
  - No visitor-facing false success and no sensitive log output

## Working fallbacks

- The header uses the approved raster icon with the text-based ZARKA /
  CONSTRUCTION lockup until purpose-built horizontal vector artwork is supplied.
- Abstract structural presentation remains in place until approved project
  photography is available.
- Turnstile is inactive because its two credentials remain empty/unconfigured.
  Honeypot, timing checks, server validation, same-origin enforcement, request
  size limits, and best-effort rate limiting remain active.
- Public phone, email, service area, licensing, insurance, testimonials, and
  unsupported business facts remain omitted.

## Launch blockers and remaining readiness items

1. Add and verify `zarkaconstruction.com` in the configured Resend account,
   preserving all unrelated DNS and email records.
2. Repeat a real production form submission and verify inbox receipt plus
   visitor reply-to after Resend reports the sender domain verified.
3. Configure production Turnstile site/secret keys for the canonical hostname,
   then verify success and rejection paths.
4. Verify approved analytics events in the Vercel dashboard without PII.
5. Complete the 200% zoom/high-contrast and Firefox/WebKit smoke tests where
   those environments are available.
6. Obtain legal review of the starter privacy notice and website terms if the
   founder requires it.
7. Configure founder-controlled Search Console and submit the sitemap.

## Phase 2 remains deferred

Portfolio content, a CMS, Supabase, authentication, dashboards, a blog,
uploads, scheduling, customer portals, AI features, and product integrations
remain outside Phase 1.5.

## Immediate next action

Verify the `zarkaconstruction.com` sender domain in Resend, then redeploy only if
Vercel environment values change and repeat the real form delivery/reply-to
test. Do not modify unrelated GoDaddy DNS records or cancel any GoDaddy product.
