# Technical Architecture

## Architecture goals

Build the smallest reliable marketing system that is fast, accessible,
configuration-driven, and straightforward to deploy. Preserve clear seams for
portfolio content, final logo assets, and optional lead persistence without
installing those future systems now.

## Framework and version policy

- Next.js App Router, React, and TypeScript in strict mode
- Tailwind CSS for tokens and responsive layout
- shadcn/ui only for an accessible primitive that would otherwise be
  error-prone; do not install the full catalog
- Node.js version supported by the selected stable Next.js release and Vercel
- npm unless the implementation owner explicitly selects another package
  manager before initialization

At implementation time, use mutually compatible current stable releases, pin
the resolved tree in the lockfile, and record the Node engine. Avoid release
candidates and canary versions. Run framework upgrade checks before accepting
generated defaults.

## Rendering strategy

- Statically render `/`, `/privacy`, and `/terms`.
- Prefer a static `/contact` shell with a server action or a thin POST route for
  submission.
- Keep client components limited to the mobile menu, form interactivity,
  Turnstile widget, and narrowly scoped analytics.
- Use Server Components for page structure, configured content, metadata, and
  JSON-LD.
- Do not add runtime data fetching for business copy or ecosystem cards.
- Use Next.js image and font pipelines where they improve performance; never
  upscale temporary logo artwork.

## Proposed structure

```text
app/
  api/contact/route.ts       # only if a route handler is chosen
  contact/page.tsx
  privacy/page.tsx
  terms/page.tsx
  layout.tsx
  page.tsx
  robots.ts
  sitemap.ts
components/
  layout/                    # header, mobile navigation, footer, container
  sections/                  # hero, services, simulator, why, work, ecosystem
  contact/                   # form, field, status/fallback
  ui/                        # small project-owned primitives
config/
  business.ts
  navigation.ts
  projects.ts
  assets.ts
lib/
  contact/                   # schema, delivery, anti-spam, rate limit
  analytics.ts
  metadata.ts
  structured-data.ts
public/
  brand/
  images/
styles/
tests/
```

This is a guide, not permission to create wrappers with no reuse. Co-locate
tests with code if the selected test tooling benefits.

## Reusable component boundaries

- `SiteHeader`, `MobileNavigation`, `SiteFooter`, and `Container`
- `SectionHeading` only if it expresses a repeated hierarchy, not merely CSS
- `PrimaryLink`/`SecondaryLink` or a small button-variant utility
- `ServiceCard`, `ProjectCard`, and `CapabilityItem` driven by typed data
- Dedicated homepage section components that own semantics and layout
- `ContactForm` with server-owned validation and accessible response handling
- `BrandMark` consuming an asset variant and always retaining a text fallback
- `ExternalLink` that consistently exposes external behavior

Prefer semantic HTML and normal links over generalized “design system”
abstractions.

## Configuration

### Business configuration

Create a typed server-safe configuration object containing:

- Legal/display business name
- Canonical origin
- approved tagline
- optional public email and phone
- optional service-area label
- navigation and legal paths
- logo asset variants
- social links, omitted when unknown

Do not expose form recipient addresses through public configuration unless they
are intentionally published.

### Services

Each service contains a stable slug, title, description, display order, and
delivery classification:

- `direct`
- `coordinated`
- `software`
- `future`

Only currently approved public entries render. The classification should guide
copy and review; do not necessarily show the raw enum to visitors.

### Related projects

```ts
type RelatedProject = {
  slug: "capproof" | "bid-desk" | "precision-impact-screens";
  name: string;
  category: string;
  description: string;
  href: string | null;
  status?: string;
};
```

CapProof and Precision Impact Screens receive their confirmed HTTPS URLs. Bid
Desk has `href: null`; its card must remain valid and non-interactive. Rendering
and tracking must derive from this same object.

## Asset strategy

Store public asset paths in a typed manifest with `light`, `dark`, `icon`, and
`social` roles. `BrandMark` accepts role/size rather than importing a specific
file. Temporary PNG/WebP assets and final SVGs use the same public interface.
Provide a CSS/text fallback and fixed intrinsic dimensions to avoid layout
shift. Keep original brand-board/reference material outside served production
assets unless publication rights and purpose are approved.

## Contact form

### Transport

The implemented boundary is `POST /api/contact`. This single JSON route keeps
Turnstile verification, same-origin enforcement, schema tests, request sizing,
and provider failure behavior explicit. A second server action is not present.

Flow:

```text
Browser fields + Turnstile token
→ same-origin server boundary
→ content-type/body-size check
→ server schema validation
→ honeypot and timing checks
→ Turnstile server verification
→ rate-limit decision
→ Resend request
→ structured result and accessible UI state
```

### Validation

- Normalize whitespace and email case where safe.
- Reject unexpected fields and enforce conservative maximum lengths.
- Required: name, email, location, service, timeline, description, Turnstile.
- Optional: phone and referral source.
- Validate service against configured values, not arbitrary strings.
- Do not trust client validation or Turnstile success without server verification.
- Escape/encode submitted content in HTML email; include a plain-text part.
- Never place visitor input in the email subject without sanitizing it.

### Email

- Resend sender uses a domain/address verified in the selected Resend account.
- Recipient comes from a server-only environment variable.
- `reply-to` is the validated visitor email; do not spoof the `from` address.
- Include submission time, general location, requested service, timeline,
  description, optional phone/referral, and a generated correlation ID.
- Do not log the full description, phone, or email in routine logs.
- Treat provider acceptance as submission success; monitor later bounces through
  the provider dashboard or a future webhook.

### Abuse prevention and rate limiting

- Cloudflare Turnstile invisible/managed mode, verified server-side.
- Hidden honeypot and minimum-fill-time signal as low-friction secondary checks.
- Rate limit by a SHA-256 privacy-reduced request fingerprint, not permanent raw
  IP storage. The MVP uses a configurable five-request/15-minute in-process
  window as best-effort defense in depth.
- Serverless instances do not share this memory. Turnstile and a Vercel
  Firewall/WAF rate rule are the production cross-instance controls; a durable
  limiter may replace the local layer when operating volume justifies it.
- Return a generic retry response for limits; do not expose detection rules.

### Failure behavior

- Validation errors remain inline and focus moves to an error summary.
- Turnstile or rate-limit failures are distinguishable to logs but use safe,
  useful visitor copy.
- Resend failure returns a retryable state and a correlation ID.
- If a confirmed public email exists, display it as the fallback; otherwise say
  the message was not delivered and ask the visitor to retry later.
- Never silently discard, queue, or claim receipt without a durable system.

## Analytics and diagnostics

- Vercel Analytics is implemented and loaded only on Vercel when
  `NEXT_PUBLIC_ANALYTICS_ENABLED` is not `false`. Enable Speed Insights only if its runtime and
  privacy tradeoffs are accepted.
- Track CTA, form state, successful conversion, and ecosystem link events
  defined in `SEO_AND_ANALYTICS.md`.
- Never attach message text, name, email, phone, exact location, or Turnstile
  token to analytics.
- Emit structured server logs with event name, correlation ID, broad failure
  class, and provider status. Avoid secrets and PII.
- Add an error-reporting provider only when an owner and privacy configuration
  are accepted.

## Accessibility

- Target WCAG 2.2 AA behavior.
- Semantic landmarks, one logical `h1`, ordered headings, descriptive links,
  persistent labels, keyboard-visible focus, skip link, and 44px-ish touch
  targets.
- Mobile menu, external links, form errors, pending state, and submission result
  must work with keyboard and screen readers.
- Respect reduced motion; do not rely on animation.
- Test 200% zoom/reflow, Windows high contrast, and common screen widths.
- Use image alt text based on purpose, not keyword stuffing.

## Performance

- Establish budgets during implementation: no avoidable client hydration, no
  large animation dependency, optimized responsive images, and minimal font
  files/weights.
- Reserve image dimensions and keep the hero’s LCP asset appropriately sized
  and prioritized only when it is truly the LCP element.
- Avoid third-party embeds, map widgets, and autoplay media.
- Check Core Web Vitals on mobile production, not only local Lighthouse.
- Cache immutable public assets with content-stable names.

## Security

- Keep secrets server-only and validate environment variables at startup/build
  where appropriate.
- Use same-origin submission, strict input limits, secure headers, escaped email
  templates, and `rel` protections for new tabs.
- Define a practical Content Security Policy compatible with Turnstile, Vercel,
  Resend flow, and analytics; begin in report-only if needed and tighten before
  enforcing.
- Do not expose source maps, verbose provider errors, secret values, or DNS
  account information to visitors.
- Keep dependencies minimal and review install scripts and advisories.

## Environment variables

Proposed names; confirm against the implemented libraries:

```text
NEXT_PUBLIC_SITE_URL=https://zarkaconstruction.com
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=false
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_RECIPIENT_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
CONTACT_RATE_LIMIT_SECRET=
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=900000
```

Use separate Preview and Production values. `.env.example` contains names and
safe descriptions only.

## Future paths

### Supabase

If durable leads become an accepted requirement, add a server-only repository
interface and a minimal table with generated ID, timestamps, normalized fields,
delivery status, and least-privilege Row Level Security. Insert only after
validation/abuse checks and define retention, access, deletion, and retry policy.
Do not add Supabase merely as an email backup in Phase 1.

### Portfolio content

Start with typed local content and optimized local images. Move to MDX or a CMS
only when non-developers must publish regularly, approval workflow is clear,
and migration value exceeds operational cost. Preserve stable project slugs and
separate content data from layout components.
