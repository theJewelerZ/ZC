# SEO and Analytics

## Canonical strategy

- Production origin: `https://www.zarkaconstruction.com`
- Every indexable route declares an absolute self-canonical URL.
- Vercel permanently redirects `zarkaconstruction.com` to
  `www.zarkaconstruction.com` with path and query preserved.
- Application code must not implement the hostname redirect; Vercel project
  domain settings are the single source of truth.
- Preview and `vercel.app` deployments must not compete in search; use Vercel
  deployment controls and noindex where appropriate.
- Normalize absolute metadata and generated files to the `www` origin.
- Avoid duplicate trailing-slash variants according to the chosen Next.js
  policy.

Implementation status (July 23, 2026):
`NEXT_PUBLIC_SEARCH_INDEXING_ENABLED=true` is set only in Vercel Production.
The canonical deployment emits `index, follow`; `robots.txt` allows `/` and
names the `www` sitemap. Preview and local environments leave the variable
absent or false so non-canonical builds remain non-indexable. Public metadata,
sitemap URLs, robots host/sitemap values, Open Graph URLs, and structured data
contain no temporary Vercel origin.

## Page metadata

Create unique, factual titles and descriptions:

- `/`: company positioning, Michigan, construction/specialty installation, and
  simulator construction without keyword stuffing.
- `/contact`: consultation purpose and company name.
- `/privacy`: privacy notice and company name.
- `/terms`: website terms and company name.

Use one metadata helper that composes title, description, canonical, social
image, and index policy. Do not put unconfirmed city, radius, license, or
“general contractor” claims into metadata.

## Open Graph and icons

- Provide site name, canonical URL, title, description, image, image dimensions,
  meaningful alt text, locale, and website type.
- Use a 1200×630 approved social image with safe text margins and restrained
  orange. Create a brand-only fallback if project photography is unavailable.
- Provide SVG favicon when final vector is available; for MVP provide
  transparent 32×32/16×16 favicon, 180×180 Apple touch icon, and suitable
  192×192/512×512 application icons from reviewed artwork.
- Do not crop a full brand-board screenshot into social/icon assets.

## Sitemap and robots

- Generate `sitemap.xml` from the four public routes with canonical absolute URLs.
- Include defensible `lastModified` values only when the framework can source
  them accurately; do not emit fabricated change frequencies or priorities.
- `robots.txt` allows public pages and links to the sitemap.
- Exclude/noindex previews, internal diagnostics, and any future private routes.
- Test generated responses in the deployed environment.

## Structured data

Begin with `Organization` or the most conservative factually supported local
business type. Consider `HomeAndConstructionBusiness` only after confirming
public business contact/service data. Use `GeneralContractor` only if that
business and licensing description is explicitly approved.

Potential properties:

- legal/display name
- canonical URL
- approved logo URL
- approved description
- confirmed public telephone/email
- confirmed service area
- confirmed social/related profile URLs

Omit unknown properties. Do not invent a postal address, opening hours,
coordinates, price range, ratings, review counts, founding year, license, or
service radius. Validate JSON-LD syntax and compare it with visible content.

## Local discovery

- Confirm consistent name, address (if public), and phone before publishing NAP.
- Define real service-area language based on actual operating boundaries.
- Align final categories/descriptions with the Google Business Profile.
- Create local/service pages only when each has useful unique content and the
  company actually serves the area.
- Gather project images, service descriptions, and reviews through permissioned
  processes; never backfill fictional proof.
- After launch, verify ownership and canonical property behavior in Search
  Console without removing the existing Google verification TXT record.

## Analytics recommendation

Vercel Analytics is implemented for the MVP because it fits the hosting stack and avoids a
large client analytics dependency. Confirm current data-processing, retention,
cookie, and consent behavior before enabling it and reflect actual practice in
the privacy page. Add another product only when a defined reporting need cannot
be met.

Analytics configuration must:

- avoid names, email, phone, description, exact address/location, tokens, or
  provider correlation IDs;
- use stable event names and small categorical properties;
- exclude development and unintended preview traffic;
- be verified in production;
- have a named owner for periodic review.

The integration is loaded only in Vercel deployments and is disabled when
`NEXT_PUBLIC_ANALYTICS_ENABLED=false`.

## Events

| Event | When | Allowed properties |
| --- | --- | --- |
| `consultation_cta_click` | Primary CTA activation | `placement` |
| `planning_process_click` | Room-planning CTA activation | `placement` |
| `contact_form_start` | First meaningful form interaction | `source` |
| `contact_form_submit` | Valid client attempt reaches server | `service_category` |
| `contact_form_success` | Email provider accepts submission | `service_category` |
| `contact_form_error` | Submission fails | broad `error_class` only |

Do not track raw field values. Prevent duplicate success events on refresh or
client re-render.

## Conversion reporting

Primary conversion: `contact_form_success`. Keep provider acceptance distinct
from qualified lead and eventual customer; qualification/outcome may be reviewed
manually until a privacy-reviewed lead system exists.

Monitor:

- CTA-to-start and start-to-success progression
- broad service category mix
- provider/form error trend
- room-planning CTA engagement and review-method selection
- Core Web Vitals and route errors

Do not establish performance targets until enough baseline traffic exists.

## Privacy

The privacy page must name the categories of data actually collected through
the form and the processors actually enabled: Vercel, Resend, Turnstile, and
analytics. Document purpose, broad retention/contact practice, security limits,
and how to make a privacy request using a confirmed channel.

Turnstile and analytics scripts may involve third-party processing. Verify their
current terms and configuration at implementation time. If tracking expands,
perform a new consent/privacy review before deployment.

## Search Console

After stable cutover:

1. Use or create the appropriate Domain property with founder-controlled access.
2. Preserve existing Google site-verification DNS.
3. Submit `https://www.zarkaconstruction.com/sitemap.xml`.
4. Inspect all four canonical routes and request indexing where appropriate.
5. Monitor coverage, Core Web Vitals, structured-data issues, security/manual
   actions, and branded/non-branded queries.
6. Keep access assigned to founder-controlled accounts, not only an agency or
   individual developer.

## Simulator-room-builder SEO direction

Use “Golf Simulator Room Builder” as the primary category phrase and support it
with natural language about custom residential and commercial simulator rooms,
room feasibility, geometry, construction, protection, turf, lighting, and
finish integration. Do not publish product catalogs, equipment-sales language,
unconfirmed geography, or thin keyword variants.

Precision Impact Screens has no metadata, structured-data, sitemap, analytics,
link, or SEO role. CapProof and Bid Desk are not SEO topics. Preview deployments
remain noindex until founder approval and production promotion.

## Private consultation routes

/admin and /auth are excluded in robots, carry noindex/noarchive metadata or
headers, and never appear in the sitemap. API routes are also disallowed. Do not
track consultation IDs, contact data, descriptions, dimensions, filenames,
captions, photo content, status, or notes.

contact_form_success now means the consultation was durably completed in
Supabase. Notification acceptance is recorded operationally in the database and
is not sent as a PII-bearing analytics event.

## Phase 3 analytics boundary

Mission Control displays only reliable operational metrics derived from Supabase: consultations received, completed consultation records, active/upcoming/published Builds, candidate photos, and published updates. The installed Vercel Analytics component remains appropriate for public aggregate analytics, but its data is not queried or mirrored into the private dashboard. No customer PII or private project data is added to analytics events.
