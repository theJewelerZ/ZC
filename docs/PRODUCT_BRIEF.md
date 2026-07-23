# Product Brief

## Business context

Zarka Construction LLC is entering a new stage: one professional website must
represent practical construction capability, specialty installation expertise,
indoor golf simulator construction, and a related group of tools and businesses
that grew from field experience.

The website must make these activities feel connected. CapProof, Bid Desk, and
Precision Impact Screens are evidence that real project problems led to focused
solutions—not an unrelated directory of ventures.

## Target audiences and visitor needs

| Audience | Primary need | Evidence the site should provide |
| --- | --- | --- |
| Property owners and project customers | Determine fit, credibility, and how to start | Clear capabilities, service boundaries, local context, direct consultation path |
| Indoor golf simulator customers | Understand the room-construction problem beyond equipment | Planning and build considerations, finished-room integration, specialty experience |
| Contractors and trade partners | Understand how Zarka can support delivery | Honest capability categories, project support, specialty installation, reliable contact |
| Vendors and manufacturers | Evaluate professional alignment | Disciplined brand, clear business focus, relevant ecosystem links |
| Technology and business partners | Understand why the software products exist | Field-derived narrative connecting documentation, estimating, and execution |
| Referrals and existing contacts | Quickly validate the company and share it | Mobile clarity, canonical domain, credible copy, dependable contact experience |

## Goals

### Immediate

1. Establish a credible official presence at `zarkaconstruction.com`.
2. Explain what Zarka Construction does in one scan.
3. Generate qualified project and business inquiries.
4. Give simulator construction prominent, concrete treatment.
5. Introduce related businesses without diluting the core company.
6. Replace the existing GoDaddy-hosted website safely.

### Long term

- Publish selected project work and deeper service content.
- Improve lead qualification without making the first interaction burdensome.
- Connect field documentation, bid workflow, and specialty product offerings
  where those integrations create clear customer value.
- Become the professional front door to a broader construction-intelligence
  platform while retaining a credible construction-company identity.

## Conversion actions

- **Primary:** Request a Consultation, leading to `/contact` or the contact form.
- **Secondary:** Explore Our Work, leading to selected capabilities/project work
  on the homepage until a portfolio route exists.
- **Supporting:** External visits to CapProof and Precision Impact Screens.
  These are measured exploration events, not competing primary CTAs.

Avoid placing multiple equal-weight CTAs in one section.

## Positioning

**Working position:** Zarka Construction is a Michigan-based construction and
specialty installation company combining decades of hands-on field experience
with modern project documentation, estimating, and construction technology.

**Approved brand statement:** Built with precision. Delivered with integrity.

### Differentiators

- Decisions are grounded in hands-on construction and installation experience.
- Simulator rooms are approached as integrated built environments, not merely
  equipment purchases.
- Project documentation, estimating, communication, and execution are treated
  as connected parts of delivery.
- Related tools and businesses address problems encountered in the field.
- The brand can speak to craft and technical systems without adopting generic
  contractor imagery or startup hype.

These are positioning themes, not permission to make unverified claims about
licenses, years, capacity, performance, or customers.

## Digital ecosystem

Section framing: **Tools and businesses built from field experience.**

- **CapProof** — field evidence capture, documentation, client reporting, and
  project proof. Confirmed URL: <https://capproof.com>.
- **Bid Desk** — construction opportunity review, estimating, and bid workflow.
  The public URL is unconfirmed and must remain absent/configured as `null`.
- **Precision Impact Screens** — impact screens, enclosures, simulator-room
  construction, installation, and related products. Confirmed URL:
  <https://precisionimpactscreens.com>.

Each product remains externally distinct. The Zarka site explains the common
field origin and links outward with clear external-link labels.

## Non-goals for the MVP

- Customer accounts, portals, authentication, dashboards, or online estimating
- A CMS, CRM, database-backed lead pipeline, or live product integration
- Scheduling, payments, e-commerce, uploads, AI chat, or automated quoting
- Comprehensive portfolio or long-form service-area SEO pages
- Claims about licensing, insurance, dealer status, warranties, certifications,
  manufacturer approval, staffing, or full trade coverage without evidence
- A logo redesign or an unverified vector trace

## MVP success criteria

- All four required routes are usable at the canonical domain.
- A mobile visitor can understand the company, simulator specialty, and next
  action without opening navigation.
- Contact submissions are validated, protected from basic abuse, delivered, and
  tested from production with accessible success/error feedback.
- CapProof and Precision Impact Screens links are correct; Bid Desk has no
  fabricated URL.
- Page structure, contrast, keyboard behavior, labels, focus states, and motion
  preferences meet a high accessibility standard.
- Images and fonts do not compromise Core Web Vitals.
- Apex and `www` resolve predictably, HTTPS works, and the apex redirects once
  to the canonical `www` host.
- Existing mail and verification DNS records remain intact.

## Post-launch signals

Measure trends, not vanity totals:

- `consultation_cta_click` by placement
- `contact_form_start`, `contact_form_submit`, `contact_form_success`, and
  `contact_form_error`
- Qualified inquiries and valid delivery rate, reviewed manually
- `ecosystem_link_click` by project
- Engagement with the simulator and capabilities sections
- Search impressions, branded queries, indexed pages, and crawl issues after
  Search Console setup
- Core Web Vitals, production error rate, and form abuse/rejection rate

No metric target should be invented before a baseline and operating capacity
are known.
