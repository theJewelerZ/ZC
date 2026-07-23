# Launch Checklist

An unchecked item remains open. Store sensitive account data and DNS exports in
an approved private location, not the public repository.

## Founder inputs

- [x] Confirm public company name and canonical domain.
- [x] Approve launch services and direct/coordinated delivery distinctions.
- [x] Approve simulator, Why Zarka, ecosystem, and company copy.
- [ ] Confirm service area.
- [x] Confirm public email and phone, or approve omission. Omitted for MVP.
- [x] Confirm licensing and insurance wording, or approve omission. Omitted.
- [ ] Confirm contact recipient, Resend sender, and response owner.
- [x] Supply temporary raster artwork; icon is active with text fallback.
- [ ] Name final copy approver and launch go/no-go owner.

## Repository

- [x] Initialize Git in the intended project root.
- [ ] Create repository in the approved founder-controlled GitHub destination.
- [x] Add focused ignore rules and `.env.example`.
- [ ] Set production branch and appropriate protection/checks. `main` exists;
      remote protection awaits the GitHub destination.
- [x] Pin Node/package manager/dependencies in project files and lockfile.
- [x] Confirm no secrets, private DNS exports, or unapproved assets are tracked.
- [x] Confirm clean install and documented local commands.

## Implementation

- [x] Implement only `/`, `/contact`, `/privacy`, and `/terms`.
- [x] Centralize business facts, services, navigation, project links, and assets.
- [x] Implement accessible header, mobile navigation, skip link, and footer.
- [x] Implement complete homepage sequence with stable anchors.
- [x] Render Bid Desk without a link until configured.
- [x] Provide text fallback for unavailable horizontal/vector logo assets.
- [x] Add deliberate error/not-found and disabled-delivery behavior.
- [x] Remove public TODOs, template copy, dead code, and unused dependencies.

## Brand assets

- [ ] Verify publication rights for the founder-supplied temporary raster files.
- [x] Verify supplied transparent icon and stacked lockup exports.
- [ ] Obtain purpose-built horizontal light/dark variants.
- [x] Verify text fallback at header/mobile sizes.
- [x] Add intrinsic dimensions for configured future production formats.
- [x] Add favicon/touch icons derived from the supplied favicon artwork.
- [x] Add generated 1200×630 brand-only Open Graph image.
- [x] Verify swapping manifest paths can introduce final SVGs without rewrites.

## Content

- [x] Confirm hero, CTA labels, services, simulator, credibility, ecosystem, and
      about copy.
- [x] Verify every factual claim against founder input.
- [x] Confirm CapProof and Precision Impact Screens URLs.
- [x] Confirm no Bid Desk URL is invented.
- [x] Confirm no unapproved photography is present; all geometry is decorative.
- [x] Confirm no address, phone, email, radius, license, insurance, year, count,
      award, certification, warranty, or dealer claim is invented.
- [ ] Review privacy and terms against actual production processing; obtain legal
      review where appropriate.

## Contact form

- [x] Validate required/optional fields and maximum lengths server-side.
- [x] Reject unexpected/invalid service values.
- [x] Verify HTML escaping and plain-text email.
- [ ] Configure verified Resend sender, server-only recipient, and visitor reply-to.
- [ ] Verify Turnstile on server with production hostname configuration.
- [x] Verify honeypot/timing checks and configurable best-effort rate limiting.
- [x] Verify accessible pending, error summary, inline errors, success, and retry.
- [x] Confirm errors/logs contain correlation data but no secrets/message-body PII.
- [ ] Test provider success, rejection, timeout, duplicate action, and abuse paths.
- [ ] Deliver a real production test message and verify reply behavior.
- [x] Confirm truthful fallback when email delivery is unavailable.

## Accessibility

- [x] Automated Lighthouse accessibility scan scores 100.
- [x] One logical `h1`; ordered headings and semantic landmarks.
- [x] Skip link and all controls work by keyboard.
- [x] Mobile menu exposes state and closes on activation or Escape.
- [x] Focus is visible on every interactive element.
- [x] Form labels/errors/status announcements use accessible relationships/live regions.
- [x] Text/UI contrast is verified; color is not the only cue.
- [x] Decorative diagrams are hidden from assistive technology.
- [ ] 200% zoom/reflow and high-contrast mode remain usable.
- [x] Reduced-motion preference is respected.

## Responsive testing

- [x] No horizontal overflow at the 320px CSS breakpoint.
- [x] Review narrow/mobile, tablet CSS breakpoints, 1440px desktop, and large layout.
- [x] Touch targets and menu are usable.
- [x] Hero/CTA remain clear without excessive first-screen height.
- [x] Cards, form, footer, long text, and validation messages reflow.
- [x] Anchor targets are not obscured by the header.
- [ ] Test current Chromium, Firefox, and WebKit/Safari where available.

## SEO

- [x] Unique title/description and `www` self-canonical on every route.
- [x] Delegate apex-to-`www` redirect exclusively to Vercel; no application
      hostname redirect remains.
- [x] Open Graph image/data and icons render correctly.
- [x] Sitemap contains the four canonical routes.
- [ ] Robots allows canonical production. It intentionally disallows the
      temporary Vercel URL until cutover.
- [x] JSON-LD uses `Organization` and no invented fields.
- [x] Temporary `vercel.app` production is noindex/disallowed.
- [x] Internal/external links and status codes are verified.

## Vercel deployment

- [ ] Import repository into the approved account/team.
- [x] Confirm production branch, runtime, install, and build settings.
- [x] Configure known non-secret Production environment values; secrets remain unset.
- [x] Deploy and smoke-test <https://zarka-construction.vercel.app>.
- [x] Record the known-good deployment and commits for rollback.
- [x] Add and verify both apex and `www` on the project.
- [x] Configure `www` to serve production and apex to redirect once to `www`.
- [x] Capture exact Vercel-verified website DNS values.

## GoDaddy DNS inventory

- [ ] Confirm registrar, nameservers, products, renewal dates, and account owner.
- [ ] Export/capture all DNS names, types, values, priorities, TTLs, and purposes.
- [ ] Identify apex/`www` records serving the old website.
- [ ] Identify all MX, SPF, DKIM, DMARC, verification, CAA, SRV, NS, and subdomains.
- [ ] Confirm domain email provider and run pre-change send/receive test.
- [ ] Create private before/after/rollback table.
- [ ] Assign cutover and rollback operators.
- [ ] Reduce only website-record TTL in advance if useful.

## Domain cutover

- [ ] Reconfirm Vercel production/domain health immediately before change.
- [ ] Replace only confirmed apex website A record values.
- [ ] Replace only confirmed `www` website CNAME value.
- [ ] Add only Vercel-requested ownership verification.
- [ ] Preserve nameservers and all unrelated DNS records.
- [ ] Timestamp and capture every DNS change.
- [ ] Observe propagation from independent resolvers/networks.
- [ ] Keep the GoDaddy website subscription active.

## Production smoke test

- [ ] `www` serves the approved Vercel deployment over valid HTTPS.
- [ ] Apex redirects once to `www` and preserves path/query.
- [ ] All routes, sitemap, robots, 404, assets, metadata, and external links work.
- [ ] Mobile, desktop, keyboard, and screen-reader smoke tests pass.
- [ ] Contact form delivers to the intended inbox and reply-to works.
- [ ] Analytics receives approved events with no PII.
- [ ] Domain email sends and receives; SPF/MX/verification services remain healthy.
- [ ] Vercel domain/runtime logs show no material error.
- [ ] Go/no-go owner records launch acceptance or triggers rollback.

## GoDaddy website cancellation

- [ ] Wait until apex, `www`, HTTPS, form, analytics, mail, and propagation pass.
- [ ] Identify the exact unwanted product and whether it bundles another service.
- [ ] Obtain explicit founder authorization for the billing action.
- [ ] Cancel only the replaced Website Builder/website-hosting product.
- [ ] Keep registration, wanted protection/privacy, GoDaddy DNS, and active email.
- [ ] Save cancellation confirmation and renewal impact.
- [ ] Recheck website, DNS, and email after cancellation.

## Post-launch monitoring

- [ ] Repeat route/SSL/form/mail/log checks during the first hour.
- [ ] Recheck from another network/resolver the same day.
- [ ] Monitor propagation and dependent services for 24–48 hours.
- [ ] Review form delivery/spam and Core Web Vitals during the first week.
- [ ] Configure founder-controlled Search Console and submit sitemap.
- [ ] Preserve existing Google verification record.
- [ ] Review indexing, structured-data reports, broken links, and Vercel billing.
- [ ] Update `progress.md`, decisions, open questions, and roadmap priorities.
