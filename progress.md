# Progress

**Current phase:** Phase 0 complete — entering Phase 1 Projects and Inside the Build

**Roadmap maturity:** 1/10

**Canonical production URL:** <https://www.zarkaconstruction.com>

**Repository:** <https://github.com/theJewelerZ/ZC>

**Branch:** `main`

**Last updated:** August 5, 2026

## Production status

Production is live and operational. The public website, durable consultation
system, private optional room-photo intake, Resend notifications, Turnstile,
founder authentication, and founder consultation dashboard are operating.

Founder authentication was verified in Production:

- password sign-in succeeds;
- the session persists across tabs and refresh;
- sign-out clears the shared browser session;
- password recovery is delivered through Resend SMTP;
- the founder allowlist remains authoritative.

DNS, nameservers, GoDaddy products, production email DNS, Supabase data,
consultation records, and Storage objects are outside this documentation change.

## Current business state

- Brand position: Golf Simulator Construction Specialist.
- Business stage: transitioning from marketing website to operational platform.
- Active projects: two; names intentionally omitted from the public repository.
- Project management: planned.
- Inside the Build: planned.
- Field Mode: planned.
- Portfolio: not yet populated.

## Canonical strategy completed

- Created the operating-system Vision and North Star.
- Established the business flywheel from discovery through future referral.
- Reset roadmap numbering so the current live system is Phase 0.
- Defined the project as the future operational source for updates, media,
  completion, case studies, portfolio, and marketing derivatives.
- Classified every roadmap feature as build now, later, much later, or never.
- Added business-success measures and explicit exit criteria to every phase.
- Established public-first active-project storytelling with private operational
  records and founder approval for every published update.
- Established future site controls as bounded founder-dashboard capabilities,
  not a general CMS.
- Established the permanent AI rule: AI may draft; founder approves.

## Decisions

- [Vision](docs/VISION.md) defines the project philosophy and identity boundaries.
- [Master roadmap](docs/MASTER_ROADMAP.md) is the canonical future-feature
  planning reference.
- [Roadmap](docs/ROADMAP.md) is the concise status/index view.
- Phase 1 is the only `Build now` product phase, but requires a separate
  implementation brief and founder authorization before code or migrations.
- Two current active projects must be documented without publishing their names
  in repository documentation.

## Blockers

No blocker exists for the roadmap documentation.

Before Phase 1 implementation, resolve the consent/media-rights process, public
project naming and location rules, project lifecycle vocabulary, private/public
media boundary, retention, backup/recovery, and additive schema/RLS plan.

## Immediate next action

Prepare the decision-complete Phase 1 Projects and Inside the Build implementation
brief. Do not write Phase 1 production code or migrations until that brief,
privacy/publication rules, data architecture, rollback plan, and founder approval
are complete.

## Next recommended implementation prompt

Read `docs/VISION.md`, `docs/MASTER_ROADMAP.md`, `docs/PRODUCT_BRIEF.md`,
`docs/DECISIONS.md`, and the existing Supabase/security documentation. Plan
Phase 1 Projects and Inside the Build only. Resolve project lifecycle, consent,
media rights, publication states, private/public storage, RLS, rollback, and
success evidence before proposing implementation. Do not implement Field Mode,
site controls, portfolio expansion, integrations, customer accounts, or later
roadmap phases.
