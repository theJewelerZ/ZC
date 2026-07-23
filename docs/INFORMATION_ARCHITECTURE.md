# Information Architecture

## MVP sitemap

```text
/
├── #services
├── #simulator-construction
├── #why-zarka
├── #work
├── #field-built-tools
├── #about
└── #contact-cta
/contact
/privacy
/terms
```

The homepage is the main narrative. Legal and contact pages are first-class,
indexable routes. Hash targets use stable IDs and account for the sticky header.

## Homepage sequence

1. **Header** — brand, concise navigation, consultation CTA.
2. **Hero** — positioning, approved statement, primary and secondary CTA.
3. **Core services** — honest service categories and delivery boundaries.
4. **Indoor golf simulator construction** — prominent specialty explanation.
5. **Why Zarka Construction** — field experience, precision, communication,
   and integrated thinking without unsupported statistics.
6. **Selected capabilities or project work** — capability-led presentation
   until approved portfolio assets exist.
7. **Tools and businesses built from field experience** — CapProof, Bid Desk,
   and Precision Impact Screens in one coherent narrative.
8. **Founder and company credibility** — concise, factual company context.
9. **Contact CTA** — one decisive route into consultation.
10. **Footer** — navigation, business identity, external projects, legal links.

## Navigation behavior

### Desktop header

- Logo links to `/`.
- Primary items: Services, Simulator Construction, Work, Field-Built Tools,
  About, Contact.
- Homepage section links use `/#section-id` so they work from every route.
- “Request a Consultation” is the only button treatment.
- Header may become compact/sticky after scroll; it must not obscure anchors or
  keyboard focus.

### Mobile header

- Brand and menu button remain visible.
- Menu uses a native button with `aria-expanded`, `aria-controls`, descriptive
  label, logical focus behavior, Escape close, and adequate hit targets.
- Navigation order matches desktop. The CTA appears once in the menu.
- Prevent background interaction while a modal-style menu is open, or use an
  inline expanding panel that avoids modal complexity.
- Close after route/anchor activation and restore focus appropriately.

## Footer

Four conceptual groups, collapsed responsively:

1. Brand statement and text/logo fallback.
2. Primary navigation and consultation link.
3. Related businesses with clear external treatment; omit Bid Desk link until
   configured.
4. Privacy, terms, copyright year, and confirmed contact details only.

Do not publish a placeholder phone number, street address, or email. A labeled
service region may appear only after founder confirmation.

## External project links

- Store URLs and statuses in typed configuration.
- CapProof: external, confirmed.
- Precision Impact Screens: external, confirmed.
- Bid Desk: URL `null`; show an accurate status label or non-linked card.
- External links visually include an external-link icon and accessible context.
- If opening a new tab, use `rel="noopener noreferrer"` and announce the
  behavior; same-tab navigation is acceptable and often simpler on mobile.
- Track the project slug and link placement without sending form or visitor PII.

## Visitor flows

### Primary conversion

```text
Referral/search → hero or relevant section → Request a Consultation
→ /contact → validated submission → accessible confirmation
```

The path must work without visiting the portfolio or ecosystem cards. If email
delivery is unavailable, the page gives a truthful retry/fallback message using
only confirmed business contact information.

### Simulator inquiry

```text
Landing → simulator section → scope considerations/capabilities
→ consultation CTA with simulator preselected where practical → /contact
```

### Ecosystem exploration

```text
Landing → field-built tools context → project card
→ confirmed external site
```

This remains secondary: ecosystem cards follow core credibility and simulator
content, and do not use the orange primary-button treatment.

### Contractor or partner

```text
Landing → services/why/about → consultation/contact
```

Contact service options should include a neutral project/business inquiry option
without creating a separate partner funnel.

## Future expansion

Potential routes, added only with sufficient approved content:

- `/work` and `/work/[project]`
- `/services` and focused service pages
- `/indoor-golf-simulators`
- `/about`
- `/service-areas/[area]` when real operating boundaries and unique content exist
- `/insights` only after an editorial owner and publishing process exist

Future routes must preserve existing section links or add redirects. Do not
create thin SEO pages, a CMS, or dynamic project routes in Phase 1.

