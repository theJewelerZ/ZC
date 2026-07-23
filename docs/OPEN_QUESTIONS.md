# Open Questions

This is the founder-input queue. A launch-blocking item can be resolved by
providing the value **or explicitly approving omission** where noted. Never put
the TODO labels themselves on the public site.

## Current implementation resolutions

- Vercel project destination is
  `matthews-projects-7e2a9d39/zarka-construction`.
- Public phone, public email, service-area detail, licensing language, insurance
  language, social links, address, testimonials, and project claims are omitted.
- The text logo fallback and generated brand-only metadata assets are active.
- Bid Desk renders as unlinked “Coming soon.”
- Contact delivery and Turnstile remain disabled pending real values.
- The GitHub destination and GoDaddy access/inventory remain unresolved.

Items below are retained as the canonical founder-input record even where the
safe MVP omission has already been implemented.

## Launch blocking

| Priority | Question / decision | Why it matters | Safe resolution |
| --- | --- | --- | --- |
| 1 | What founder-controlled GitHub account or organization owns the repository? | Required for traceable Vercel deployment and ownership | Name the destination and admins |
| 2 | What Vercel account/team owns production and billing? | Required before project creation/domain assignment | Name the scope and admins |
| 3 | Who has GoDaddy access, including DNS and Products/Billing? | Required for authoritative inventory, cutover, rollback, and later cancellation | Confirm login/MFA operator; do not share password in repo |
| 4 | Export or capture every current GoDaddy DNS record and TTL. What services use them? | Public DNS cannot discover every DKIM selector, verification record, forwarding rule, or inactive dependency | Complete the private before/after inventory |
| 5 | Does the domain currently support email, and who owns/administers it? | Active Google MX/SPF records were observed and mail must be protected | Confirm provider, accounts, DKIM/DMARC, send/receive test owner |
| 6 | What address receives contact-form inquiries? | The form cannot deliver without a real recipient | Configure server-only `CONTACT_TO_EMAIL` |
| 7 | What verified domain/address should Resend send from? | Visitor email cannot safely be used as `from` | Confirm Resend account, DNS verification, `CONTACT_FROM_EMAIL` |
| 8 | What is the official public contact email? | Needed for published contact/failure fallback if desired | Supply it or explicitly omit it from public pages |
| 9 | What is the official phone number, and should it appear? | Prevents invented contact data and defines optional form behavior | Supply and approve format, or explicitly omit |
| 10 | What Michigan service area can be stated publicly? | Affects hero, local SEO, inquiry qualification, and structured data | Approve exact wording; broad “Michigan-based” may remain if accurate |
| 11 | Which services are actively promoted at launch, and which are direct, coordinated, software, or future? | Prevents overstating scope/capacity | Approve the service configuration and descriptions |
| 12 | May the site use “master carpentry” in founder/company copy? | It is a credibility claim requiring confirmation | Approve wording or remove it |
| 13 | What licensing language, if any, is factually and legally appropriate? | Prevents implying full-service GC or licensed-trade coverage | Supply reviewed text or explicitly omit all licensing claims |
| 14 | What insurance language, if any, may be published? | “Insured” must not be assumed | Supply reviewed text or explicitly omit |
| 15 | Is temporary logo artwork available with permission for production use? | Determines raster versus text launch treatment | Provide reviewed exports/source or approve text fallback |
| 16 | Who gives final launch-copy and go/no-go approval? | Required to close factual and operational review | Name owner and approval channel |

## Temporary placeholder acceptable

| Question / asset | MVP behavior until resolved |
| --- | --- |
| What is the Bid Desk public URL and current public status? | `href: null`; render a factual non-linked card and omit unsupported status text |
| Where are the professionally recreated SVG logo files? | Use approved temporary raster variants or text fallback through asset config |
| Which project photographs have rights and approval? | Use capability-led layout, restrained approved imagery, or non-image structure |
| Which simulator projects/photos may be shown? | Use explanatory layout without fictional projects or stock proof |
| Are testimonials approved with attribution/permission? | Omit testimonials |
| What social profiles should be linked? | Omit social links |
| What is the full company/founder biography? | Use only approved concise business context; omit name/history details |
| Which portfolio projects have approved facts? | Use capabilities instead of case studies |
| Is a street address public? | Omit address and address schema |
| Are final favicon and OG assets available? | Use reviewed temporary brand exports; do not use the full brand board |

## Post-launch

| Question | Decision needed before work begins |
| --- | --- |
| Should consultations integrate with a calendar? | Owner, availability policy, provider, privacy, no-show workflow |
| Should the form accept photo uploads? | File limits/types, malware handling, storage, retention, consent, operations |
| Should leads be stored in Supabase? | Purpose, schema, access, RLS, retention/deletion, retry, breach handling |
| Should inquiries create CapProof projects? | Consent, API contract, duplicate/failure handling, ownership |
| Should inquiries create Bid Desk opportunities? | Public/product status, API, data mapping, consent, workflow owner |
| Is a customer portal needed? | User research, authentication/authorization, support, security, data boundaries |
| Is content management needed? | Publishing owner, cadence, approvals, content model, migration case |
| Should budget/preferred-contact fields be added? | Evidence that qualification value exceeds form friction |
| Should a shared ecosystem identity/data layer exist? | Validated cross-product use case, privacy/security/legal review |
