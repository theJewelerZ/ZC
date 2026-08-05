# Launch Checklist

An unchecked item remains open. Store sensitive account data and DNS exports in
an approved private location, not the public repository.

## Founder inputs

- [x] Confirm public company name and canonical domain.
- [x] Approve launch services and direct/coordinated delivery distinctions.
- [x] Approve the original Phase 1 simulator, credibility, and company copy.
- [ ] Confirm service area.
- [x] Confirm public email and phone, or approve omission. Omitted for MVP.
- [x] Confirm licensing and insurance wording, or approve omission. Omitted.
- [ ] Confirm the long-term response owner. Recipient and sender values are
      configured privately in Vercel Production.
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
- [x] Remove public software-product cards from the simulator-first experience.
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

- [x] Confirm hero, CTA labels, simulator solutions, planning, credibility, and
      about copy.
- [x] Verify every factual claim against founder input.
- [x] Confirm Precision Impact Screens has no public link or reference.
- [x] Confirm Bid Desk is not named publicly.
- [x] Confirm no unapproved photography is present; all geometry is decorative.
- [x] Confirm no address, phone, email, radius, license, insurance, year, count,
      award, certification, warranty, or dealer claim is invented.
- [ ] Review privacy and terms against actual production processing; obtain legal
      review where appropriate.

## Contact form

- [x] Validate required/optional fields and maximum lengths server-side.
- [x] Reject unexpected/invalid service values.
- [x] Verify HTML escaping and plain-text email.
- [x] Verify the configured `zarkaconstruction.com` sender domain, DKIM, and SPF
      records in Resend. Server-only recipient/sender values and visitor
      reply-to are implemented.
- [x] Verify Turnstile on server with production hostname configuration.
- [x] Verify honeypot/timing checks and configurable best-effort rate limiting.
- [x] Verify accessible pending, error summary, inline errors, success, and retry.
- [x] Confirm errors/logs contain correlation data but no secrets/message-body PII.
- [ ] Test provider success, timeout, duplicate action, and production abuse
      paths. Automated rejection/disabled/validation coverage passes.
- [ ] Confirm inbox receipt and manually verify reply behavior. The July 23
      production submission returned HTTP 200; Resend accepted it and Vercel
      logged `contact_delivery_accepted` with a provider ID.
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
- [x] Robots allows canonical production and references the canonical `www`
      sitemap; Preview and local builds remain non-indexable.
- [x] JSON-LD uses `Organization` and no invented fields.
- [x] Temporary `vercel.app` production is noindex/disallowed.
- [x] Internal/external links and status codes are verified.

## Vercel deployment

- [x] Link and deploy the project in the active Vercel account/team.
- [x] Confirm production branch, runtime, install, and build settings.
- [x] Configure Production indexing, analytics, Resend, and rate-limit
      environment values without exposing secrets.
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

- [x] `www` serves the approved Vercel deployment over valid HTTPS.
- [x] Apex redirects once to `www` and preserves path/query.
- [x] All routes, sitemap, robots, 404, assets, metadata, and external links work.
- [ ] Mobile, desktop, and keyboard smoke tests pass; complete a manual
      screen-reader pass.
- [x] Contact form delivers to the intended inbox and reply-to works.
- [ ] Analytics receives approved events with no PII.
- [ ] Domain email sends and receives; SPF/MX/verification services remain healthy.
- [x] Vercel production logs confirm contact-provider acceptance without
      logging contact details or secrets.
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
- [x] Update `progress.md`, README, and this launch checklist for Phase 1.5.

## Phase 2 simulator construction route

- [x] Add `/simulator-construction` without redesigning the homepage.
- [x] Cover room feasibility, player clearances, construction, enclosure,
      protection, turf, projection, lighting, technology, and maintenance access.
- [x] Distinguish Zarka room construction from technology manufacturing/sales.
- [x] Add null-safe, configuration-driven image slots; publish no fake photography.
- [x] Link from homepage, primary navigation, footer, sitemap, and canonical metadata.
- [x] Preselect Indoor golf simulator construction through the existing contact flow.
- [x] Add factual Service and FAQ structured data matching visible content.
- [x] Verify lint, strict TypeScript, tests, production build, route markup,
      responsive captures, and Lighthouse.
- [ ] Replace schematic image slots only after real photography, usage rights,
      crops, and final alt text are approved.

## Phase 2 simulator-room-builder repositioning

### Strategy and content

- [x] Lead with “Golf Simulator Room Builder.”
- [x] Use the approved hero headline and positioning sentence.
- [x] Shift homepage emphasis to approximately 80% simulator-room content.
- [x] Organize services around complete simulator solutions, not trades.
- [x] Explain dimensions, geometry, player position, screen, enclosure,
  protection, projection, turf, lighting, and maintenance access.
- [x] Keep construction, carpentry, painting, renovation, and maintenance as
  supporting credibility.
- [x] Remove every public Precision Impact Screens reference and link.
- [x] Remove CapProof and Bid Desk product cards.
- [x] Mention CapProof only as documentation-process context.
- [x] Keep Bid Desk invisible publicly while expressing organized scopes and
  documented assumptions.

### Contact and conversion

- [x] Preselect simulator construction for the primary consultation path.
- [x] Add required on-site consultation or guided remote room review selection.
- [x] Explain that remote reviews need measurements and photographs in follow-up.
- [x] Add no uploads, storage, scheduler, estimator, or configurator.
- [ ] Re-run a production delivery test only after founder approves production
  promotion; do not send a live test from the protected preview unnecessarily.

### Projects and assets

- [x] Keep all simulator project image sources null.
- [x] Use no AI, stock, staged, or fake project photography.
- [x] Keep the secured upcoming project unpublished before construction begins.
- [ ] Add founder-owned photography only after rights, scope context, crop, and
  alt text are approved.

### Verification and release

- [x] Pass lint, TypeScript, 24 tests, and production build.
- [x] Verify all public routes and metadata in protected preview `dpl_6kq4LmyJhrgrh1EABAJ2D8GoVH3Y`.
- [x] Verify no prohibited public product references in rendered output.
- [x] Review 320, 375, 768, 1024, and 1440 layouts.
- [x] Run accessibility and Lighthouse reviews; homepage, simulator, and contact score 100 for accessibility, and the homepage scores 100 in all four Lighthouse categories.
- [ ] Obtain founder approval.
- [ ] Merge and promote only after explicit approval.
- [x] Leave `main`, production, DNS, nameservers, and GoDaddy products unchanged
  during preview work.