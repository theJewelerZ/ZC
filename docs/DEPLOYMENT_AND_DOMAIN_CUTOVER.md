# Deployment and Domain Cutover

## Safety principles

Domain registration, DNS hosting, GoDaddy website hosting/Website Builder,
email, SSL, verification records, and Vercel project hosting are separate
services. Migrating the website does not require transferring the domain,
changing nameservers, moving email, or canceling every GoDaddy product.

**Do not cancel the GoDaddy website product until the Vercel deployment,
`zarkaconstruction.com`, `www.zarkaconstruction.com`, HTTPS, redirect, contact
delivery, analytics, and preserved DNS services have all been verified.**

## 1. Repository and GitHub

1. Initialize Git only after reviewing the project root.
2. Add `.gitignore`, `.env.example`, license/ownership decision, and documented
   Node/package-manager versions.
3. Create the repository in the founder-approved GitHub account/organization.
4. Use `main` as the production branch and short-lived feature branches.
5. Require passing build/checks before merging when repository plan permits.
6. Keep deployments traceable to a commit; never commit Vercel/Resend/Turnstile
   secrets or a GoDaddy zone export containing sensitive account context.

## 2. Vercel project

Implementation record, July 23, 2026:

- Vercel scope: `matthews-projects-7e2a9d39`
- Project: `zarka-construction`
- Temporary production alias:
  <https://zarka-construction.vercel.app>
- Deployment status: Ready and smoke-tested
- Custom domains: `zarkaconstruction.com` and
  `www.zarkaconstruction.com` are added and verified
- Canonical host: `https://www.zarkaconstruction.com`
- Vercel domain redirect: apex permanently redirects to `www` with status 308;
  `www` serves the application directly
- Verified website DNS: apex A `216.150.1.1`; `www` CNAME
  `1bdf9ac95a8504d1.vercel-dns-016.com`
- Contact delivery/Turnstile secrets: not configured
- Search indexing: explicitly disabled until canonical-domain cutover

1. Import the GitHub repository into the confirmed Vercel personal/team scope.
2. Confirm framework, root directory, install, build, Node runtime, and
   production branch.
3. Configure Preview and Production environment values separately.
4. Restrict production secrets to Production unless previews truly need them.
5. Add the Resend sender domain and Turnstile preview/production hostnames.
6. Deploy preview(s), merge the approved commit, and verify the generated
   production `vercel.app` URL before adding/changing domain records.
7. Record the known-good deployment URL/commit for application rollback.

## 3. Environment variables

Use the names defined in `TECHNICAL_ARCHITECTURE.md`. Verify:

- Canonical site URL is `https://www.zarkaconstruction.com` in Production.
- Resend key belongs to the intended account and verified sender domain.
- Contact recipient is correct and server-only.
- Turnstile keys match allowed production and preview hostnames.
- Rate-limit credentials/namespaces are isolated by environment.
- Analytics is enabled intentionally and reflected in privacy copy.

Rotate any secret that appears in source, screenshots, logs, or chat.

## 4. Temporary URL acceptance

Before DNS changes, test the Vercel production URL:

- `/`, `/contact`, `/privacy`, `/terms`, sitemap, and robots
- Content, facts, logo fallback/assets, and external links
- Mobile menu, anchors, keyboard, focus, zoom, reduced motion
- Image/font performance and production headers
- One real contact submission through Turnstile to the intended inbox
- Reply-to behavior and plain-text/HTML email
- Provider failure behavior using a safe test or preview configuration
- Analytics events without PII
- Runtime/build logs and known-good rollback deployment

Do not cut over with a failing form if the consultation form is presented as
available.

## 5. Add custom domains in Vercel

1. Add `zarkaconstruction.com` to the project.
2. Add `www.zarkaconstruction.com` explicitly.
3. Configure `www.zarkaconstruction.com` to serve the production deployment.
4. Configure `zarkaconstruction.com` as a permanent redirect to `www` in
   Vercel.
5. Capture the exact ownership-verification and DNS records Vercel displays.

Current project-specific values verified by Vercel are apex A `216.150.1.1` and
`www` CNAME `1bdf9ac95a8504d1.vercel-dns-016.com`. Do not substitute generic
Vercel targets or alter these records unless Vercel explicitly supplies new
project-specific values and a separate DNS change is authorized.

Vercel project domain settings are the single source of truth for the
apex-to-`www` redirect. Do not duplicate or reverse this hostname redirect in
`next.config.ts`, `vercel.json`, middleware, or route handlers.

## 6. Authoritative GoDaddy inventory

Access to the GoDaddy DNS dashboard is a launch gate. Export the zone if
available and record screenshots/tables containing name, type, value, priority,
TTL, and purpose for every entry:

- SOA and NS
- All apex and subdomain A/AAAA records
- CNAME/ALIAS records, including `www`
- MX records and priority
- TXT records: SPF, DKIM selectors, DMARC, Google/service verification
- CAA and SRV records
- Delegated NS records and all known subdomains
- GoDaddy forwarding, parking, Website Builder connections, and Dynamic DNS

Pre-cutover public observation on July 22, 2026 found:

- GoDaddy nameservers `ns51.domaincontrol.com` and `ns52.domaincontrol.com`
- Apex A records `76.223.105.230` and `13.248.243.5`
- `www` CNAME to `zarkaconstruction.com`
- Google Workspace-style MX records:
  `aspmx.l.google.com`, `alt1.aspmx.l.google.com`,
  `alt2.aspmx.l.google.com`, `alt3.aspmx.l.google.com`,
  `alt4.aspmx.l.google.com`
- Apex SPF delegating to
  `dc-aa8e722993._spfm.zarkaconstruction.com`, which includes
  `_spf.google.com`
- A Google site-verification TXT record
- No public `_dmarc`, `google._domainkey`, or `default._domainkey` TXT result

This public check is incomplete and is not authority to delete or recreate
records. Unknown DKIM selectors and non-public service configuration may exist.

Current website records supplied and verified on July 23, 2026:

- Apex A `216.150.1.1`
- `www` CNAME `1bdf9ac95a8504d1.vercel-dns-016.com`

These current values do not replace the requirement to preserve the complete
authoritative MX/TXT/service inventory. No DNS change is required for the
redirect-loop application fix.

Create a private cutover table:

| Host/type | Before | Purpose | Planned action | After | Verified |
| --- | --- | --- | --- | --- | --- |
| `@` A | Prior value retained in cutover record | Vercel website | No change for redirect-loop fix | `216.150.1.1` | Vercel verified |
| `www` CNAME | Prior value retained in cutover record | Vercel website | No change for redirect-loop fix | `1bdf9ac95a8504d1.vercel-dns-016.com` | Vercel verified |
| MX/TXT/etc. | Export all | Mail/services | Preserve | Unchanged | |

If practical, reduce only the website-record TTL 24–48 hours before cutover.
Do not alter mail/service TTLs merely for the website launch.

## 7. DNS change procedure

1. Confirm the latest Vercel deployment and domain assignment are healthy.
2. Confirm GoDaddy access, authoritative export, rollback operator, and prior
   website values.
3. Confirm email send/receive immediately before the change.
4. Remove/replace only conflicting apex website A records with Vercel’s exact
   apex target. Do not add an apex CNAME.
5. Replace only the `www` website CNAME with Vercel’s exact target.
6. Add a Vercel ownership TXT only if Vercel requests it; preserve unrelated TXT.
7. Do not change GoDaddy nameservers. Do not delete MX, SPF, DKIM, DMARC, CAA,
   SRV, verification, or unrelated subdomain records.
8. Timestamp and capture each before/after value.

DNS propagation varies with cached TTLs and can take hours; some documentation
allows up to 24–48 hours for broad propagation. Mixed results during this window
do not justify deleting unrelated records.

## 8. Verification

Check from at least two independent resolvers/networks where possible:

- Apex redirects once to `https://www.zarkaconstruction.com` with path/query
  preserved.
- `www` serves the intended Vercel production deployment directly.
- Both hosts present valid certificates and no mixed content.
- `www` is the canonical URL in metadata, sitemap, robots, JSON-LD, and social
  metadata.
- All four routes return expected status/content; nonexistent paths behave
  intentionally.
- Contact form delivers from production; reply-to works; logs show no secrets.
- Analytics receives approved production events without PII.
- Google/business email sends and receives; SPF is unchanged; existing
  verification-dependent services remain healthy.
- Mobile, desktop, external links, sitemap, robots, and performance pass a
  production smoke check.

Do not regard a single local browser result as full propagation verification.

### Redirect-loop incident and resolution

On July 23, 2026, authenticated Vercel project-domain configuration showed:

- `zarkaconstruction.com` → `www.zarkaconstruction.com`, status 308
- `www.zarkaconstruction.com` → no Vercel redirect

At the same time, `next.config.ts` contained a host-conditioned permanent
redirect from `www.zarkaconstruction.com` back to
`https://zarkaconstruction.com/:path*`. The opposing redirects produced an
alternating 308 loop. The application rule was removed, canonical configuration
was changed to `https://www.zarkaconstruction.com`, and Vercel remained the only
hostname redirect owner. DNS, nameservers, MX, TXT, and email-related settings
were not changed.

Post-fix production verification for deployment
`dpl_3j2Fevd5RN5hQbgZ4As93AiFS2D8`:

| Request | Redirect result | Final response |
| --- | --- | --- |
| `http://zarkaconstruction.com` | HTTP→HTTPS apex, then apex→`www` | `https://www.zarkaconstruction.com/`, 200 |
| `https://zarkaconstruction.com` | apex→`www` | `https://www.zarkaconstruction.com/`, 200 |
| `http://www.zarkaconstruction.com` | HTTP→HTTPS `www` | `https://www.zarkaconstruction.com/`, 200 |
| `https://www.zarkaconstruction.com` | no redirect | `https://www.zarkaconstruction.com/`, 200 |

An apex `/contact?source=redirect-test` request retained both path and query at
the final canonical `www` URL. Canonical/Open Graph metadata, all four sitemap
entries, and robots host/sitemap output use `www`. Existing noindex/disallow
behavior remains enabled pending a separate indexing decision.

## 9. Rollback

Trigger rollback if Vercel cannot serve stable HTTPS, critical routes fail, the
form cannot provide an honest contact path, or mail/external DNS services are
disrupted and cannot be corrected quickly.

1. Stop further DNS/product changes and record the failure.
2. If code/config caused the issue, promote the last known-good Vercel
   deployment and retest before touching DNS.
3. If domain routing caused the issue, restore the exact prior apex A records
   and `www` CNAME from the authoritative cutover table.
4. Do not “restore” or modify MX/TXT records unless an audited accidental change
   occurred; restore exact before-values only.
5. Verify the prior website, apex/`www`, email send/receive, and dependent
   services as caches expire.
6. Keep the GoDaddy website subscription active and document the incident before
   another attempt.

The observed July 22 values are leads for comparison, not substitutes for the
cutover-day GoDaddy export.

## 10. GoDaddy products after launch

Review the GoDaddy Products and Renewals/Billing screens with product IDs and
renewal dates. Product names vary. After the success gate:

- **May be canceled:** only the confirmed paid Website Builder/Websites +
  Marketing or website-hosting product that served the replaced site, after
  confirming it does not bundle required email or another service.
- **Must remain:** domain registration, domain privacy/protection the founder
  wants, and GoDaddy DNS/nameserver service while GoDaddy remains DNS host.
- **Must remain if active:** Google Workspace, Microsoft 365, GoDaddy email, or
  any other mail/security/verification service tied to the domain.
- **Do not purchase/retain duplicate SSL solely for Vercel:** Vercel provisions
  HTTPS for the project domains. Confirm that canceling a GoDaddy SSL product
  does not affect another hosted service before cancellation.

Cancellation is a separate, explicit founder-authorized billing action. Save
confirmation and verify the domain and email again afterward.

## 11. Monitoring

- First hour: routes, certificates, redirect, form, logs, mail, analytics.
- Same day: repeat from another network/resolver; monitor inquiries and errors.
- Next 24–48 hours: propagation, Vercel domain status, mail, performance, form
  delivery, and external verification services.
- First week: Search Console setup/indexing, Core Web Vitals, broken links,
  contact quality/spam, provider delivery status, and unexpected GoDaddy billing.
