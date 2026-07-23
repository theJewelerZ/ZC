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
- Custom domains: not added
- GoDaddy/DNS changes: none
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

- Canonical site URL is the apex HTTPS URL in Production.
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
3. Set `zarkaconstruction.com` as the primary production domain.
4. Configure `www` as a permanent redirect to the apex in Vercel.
5. Capture the exact ownership-verification and DNS records Vercel displays.

Vercel’s documented general-purpose values are commonly an apex A record of
`76.76.21.21` and a `www` CNAME of `cname.vercel-dns-0.com`. Project-specific
targets may differ; **use the exact Vercel project instructions at cutover**.
Do not point DNS based only on this document.

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

Public observation on July 22, 2026 found:

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

Create a private cutover table:

| Host/type | Before | Purpose | Planned action | After | Verified |
| --- | --- | --- | --- | --- | --- |
| `@` A | Confirm in GoDaddy | Current website | Replace website values only | Exact Vercel value | |
| `www` CNAME | Confirm in GoDaddy | Current website | Replace | Exact Vercel value | |
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

- Apex returns the exact intended Vercel configuration.
- `www` resolves and redirects once to the apex with path/query preserved.
- Both hosts present valid certificates and no mixed content.
- Apex is the canonical URL in headers, metadata, sitemap, JSON-LD, and social
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
