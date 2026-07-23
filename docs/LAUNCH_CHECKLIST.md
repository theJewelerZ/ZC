# Launch Checklist

An unchecked item remains open. Store sensitive account data and DNS exports in
an approved private location, not the public repository.

## Founder inputs

- [ ] Confirm public company name and canonical domain.
- [ ] Approve launch services and direct/coordinated delivery distinctions.
- [ ] Approve simulator, Why Zarka, ecosystem, and company copy.
- [ ] Confirm service area.
- [ ] Confirm public email and phone, or approve omission.
- [ ] Confirm licensing and insurance wording, or approve omission.
- [ ] Confirm contact recipient, Resend sender, and response owner.
- [ ] Approve temporary raster logo or text fallback.
- [ ] Name final copy approver and launch go/no-go owner.

## Repository

- [ ] Initialize Git in the intended project root.
- [ ] Create repository in the approved founder-controlled GitHub destination.
- [ ] Add focused ignore rules and `.env.example`.
- [ ] Set production branch and appropriate protection/checks.
- [ ] Pin Node/package manager/dependencies in project files and lockfile.
- [ ] Confirm no secrets, private DNS exports, or unapproved assets are tracked.
- [ ] Confirm clean install and documented local commands.

## Implementation

- [ ] Implement only `/`, `/contact`, `/privacy`, and `/terms`.
- [ ] Centralize business facts, services, navigation, project links, and assets.
- [ ] Implement accessible header, mobile navigation, skip link, and footer.
- [ ] Implement complete homepage sequence with stable anchors.
- [ ] Render Bid Desk without a link until configured.
- [ ] Provide text fallback for missing logo assets.
- [ ] Add deliberate loading/error/not-found behavior where applicable.
- [ ] Remove public TODOs, template copy, dead code, and unused dependencies.

## Brand assets

- [ ] Verify temporary asset usage rights and source.
- [ ] Export transparent light/dark icon and horizontal variants.
- [ ] Verify mark fidelity at header/mobile sizes.
- [ ] Add intrinsic dimensions and optimized production formats.
- [ ] Add favicon/touch/app icons.
- [ ] Add approved 1200×630 Open Graph image.
- [ ] Verify swapping manifest paths can introduce final SVGs without rewrites.

## Content

- [ ] Confirm hero, CTA labels, services, simulator, credibility, ecosystem, and
      about copy.
- [ ] Verify every factual claim against founder input.
- [ ] Confirm CapProof and Precision Impact Screens URLs.
- [ ] Confirm no Bid Desk URL is invented.
- [ ] Confirm images have rights, meaningful alt text, and accurate captions.
- [ ] Confirm no address, phone, email, radius, license, insurance, year, count,
      award, certification, warranty, or dealer claim is invented.
- [ ] Review privacy and terms against actual production processing; obtain legal
      review where appropriate.

## Contact form

- [ ] Validate required/optional fields and maximum lengths server-side.
- [ ] Reject unexpected/invalid service values.
- [ ] Verify HTML escaping and plain-text email.
- [ ] Configure verified Resend sender, server-only recipient, and visitor reply-to.
- [ ] Verify Turnstile on server with production hostname configuration.
- [ ] Verify honeypot/timing checks and configurable rate limiting.
- [ ] Verify accessible pending, error summary, inline errors, success, and retry.
- [ ] Confirm errors/logs contain correlation data but no secrets/message-body PII.
- [ ] Test provider success, rejection, timeout, duplicate action, and abuse paths.
- [ ] Deliver a real production test message and verify reply behavior.
- [ ] Confirm truthful fallback when email delivery is unavailable.

## Accessibility

- [ ] Automated accessibility scan has no critical/serious unresolved issue.
- [ ] One logical `h1`; ordered headings and semantic landmarks.
- [ ] Skip link and all controls work by keyboard.
- [ ] Mobile menu exposes state, closes predictably, and manages focus.
- [ ] Focus is visible on every interactive element.
- [ ] Form labels/errors/status announcements work with a screen reader.
- [ ] Text/UI contrast is verified; color is not the only cue.
- [ ] Images have purposeful alt text or empty alt when decorative.
- [ ] 200% zoom/reflow and high-contrast mode remain usable.
- [ ] Reduced-motion preference is respected.

## Responsive testing

- [ ] No horizontal overflow at 320px.
- [ ] Test representative small/large phones, tablet, laptop, and wide desktop.
- [ ] Touch targets and menu are usable.
- [ ] Hero/CTA remain clear without excessive first-screen height.
- [ ] Cards, form, footer, long text, and validation messages reflow.
- [ ] Anchor targets are not obscured by the header.
- [ ] Test current Chromium, Firefox, and WebKit/Safari where available.

## SEO

- [ ] Unique title/description and apex self-canonical on every route.
- [ ] `www` canonical handling matches Vercel redirect.
- [ ] Open Graph image/data and icons render correctly.
- [ ] Sitemap contains the four canonical routes.
- [ ] Robots allows production and does not expose private routes.
- [ ] JSON-LD uses a factually supported type and no invented fields.
- [ ] Preview and `vercel.app` URLs do not become competing indexed properties.
- [ ] Internal/external links and status codes are verified.

## Vercel deployment

- [ ] Import repository into the approved account/team.
- [ ] Confirm production branch, runtime, install, and build settings.
- [ ] Configure separate Preview/Production environment variables.
- [ ] Deploy and smoke-test the temporary production `vercel.app` URL.
- [ ] Record the known-good deployment/commit for rollback.
- [ ] Add both apex and `www` to the project.
- [ ] Set apex primary and `www` redirect.
- [ ] Capture exact DNS values shown by Vercel.

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

- [ ] Apex serves the approved Vercel deployment over valid HTTPS.
- [ ] `www` redirects once to apex and preserves path/query.
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

