# Open Questions

## Launch blocking for simulator-first production promotion

| Question | Safe preview behavior |
| --- | --- |
| Does the founder approve the simulator-room-builder homepage and dedicated page copy? | Keep the work on the protected feature-branch preview; do not promote |
| Does the founder approve “Golf Simulator Room Builder” as the primary category phrase everywhere? | Use it in preview according to the accepted strategy ADR |
| Are both on-site consultation and guided remote room review operationally available now? | Present both as preferred review approaches without promising geography or timing |
| What service-area language, if any, can be published? | Omit service area and geography |
| Are any licensing or insurance statements approved for publication? | Omit both |

## Temporary placeholder acceptable

| Question | Current behavior |
| --- | --- |
| Which founder-owned simulator photographs have publication rights? | All configured project image sources remain `null` |
| Which project may be published first, and when has construction actually begun? | Do not publish the secured upcoming project before work begins |
| What titles, broad locations, scope details, and alt text are approved for each project? | Render no project claim or location |
| Should a public phone or email appear? | Omit both; continue protected form delivery |
| Is a founder name, portrait, or expanded biography approved? | Use company-level credibility only |
| Are any equipment, manufacturer, dealer, certification, or warranty relationships approved? | Claim none |

## Post-launch

| Question | Gate before implementation |
| --- | --- |
| Should contact scheduling be added? | Operating owner, calendar rules, privacy review, and failure fallback |
| Should photographs be exchanged through a secure workflow? | Consent, retention, access, deletion, security, and operational ownership |
| Should leads be stored outside email? | Accepted database requirement, retention policy, least privilege, and explicit approval |
| Should project content move to a CMS? | Repeated publishing need, content owner, review workflow, and migration value |
| Should residential or commercial simulator routes split? | Distinct approved content and demonstrated search/customer need |

## Fixed constraints

- No public Precision Impact Screens reference.
- No public Bid Desk reference or software-product card.
- CapProof is limited to documentation-process context.
- No CMS, Supabase, database, authentication, portal, dashboard, uploads,
  configurator, estimator, store, catalog, or equipment sales without explicit
  future approval.

## Phase 3 launch-blocking founder inputs

- **Launch blocking:** Exact founder email(s) for ADMIN_ALLOWED_EMAILS.
- **Launch blocking:** Create/invite the matching Supabase Auth user.
- **Launch blocking:** Add the protected preview /auth/callback URL in Supabase.
- **Launch blocking:** Confirm Preview Turnstile behavior/domain or accept the
  documented protected-preview fallback for review.
- **Launch blocking:** Complete real no-photo and photo submissions and verify
  founder/customer inbox delivery and dashboard visibility.
- **Temporary placeholder acceptable:** No fixed completed-inquiry deletion
  schedule; use the documented business/legal-need retention statement pending
  formal legal review.
- **Post-launch:** Scheduled cleanup may replace submission-triggered bounded
  cleanup if traffic is insufficient. This is not a CRM or automation backlog.
