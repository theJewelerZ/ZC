# Founder Dashboard

The private route is /admin; /admin/login offers a magic link only for a
pre-created Supabase Auth user. shouldCreateUser is false, preventing website
login attempts from registering accounts. There are no customer accounts.

Every page, signed-photo request, and mutation validates the Supabase session
server-side and then checks normalized email membership in ADMIN_ALLOWED_EMAILS.
Only then does a separate service client query data. Unauthorized authenticated
users are rejected exactly like anonymous visitors.

Admin routes are dynamic, no-store, noindex, excluded from robots, and carry
private cache headers. Consultation data is not sent to Vercel Analytics.

The list is newest first and includes received date, customer, location, project
type, review preference, status, photo count, email, and optional phone. It has a
status filter and simple name/email/location search.

The detail view displays submitted fields, timestamps, notification state,
click-to-call/mail, consultation ID, captions, and five-minute signed photo
views. The founder may update only constrained status and private notes. There
are no charts, pipeline board, scoring, deletion controls, automations, employee
roles, or CRM widgets.

## Magic-link session transport

The browser requests the magic link with an exact-origin redirect to
/auth/callback. The callback exchanges the one-time PKCE code and writes every
Supabase session cookie directly onto the same NextResponse that redirects to
/admin. It then verifies the authoritative Supabase user and the server-only
email allowlist. Cookies remain host-scoped: no shared hard-coded Domain is used,
so protected Preview and production hosts authenticate independently.

Missing configuration, incomplete links, expired/used links, and unauthorized
accounts return distinct non-sensitive messages at /admin/login. Unauthorized
sessions are signed out and their auth cookies cleared. Sign-out is a POST route
that likewise clears cookies on its actual 303 redirect response.

## Stable Preview authentication origin

Preview login is pinned to the stable Git branch URL rather than a commit URL:

`https://zarka-construction-git-phase-9e8031-matthews-projects-7e2a9d39.vercel.app`

`ADMIN_AUTH_ORIGIN` provides the branch-scoped server override. When it is absent,
Vercel Preview uses `VERCEL_BRANCH_URL`; Production remains on the request's
production origin. `/admin/login` redirects from a commit-specific Preview host
to the stable branch host before creating the PKCE verifier. The email callback
therefore returns to the host that owns the verifier cookie.

The public site exposes one discreet `Founder Login` utility link in the footer
and mobile navigation. It does not expose data or create customer accounts.

## Privacy-safe diagnostics

Authentication logs contain stage names, the callback hostname, and a bounded
reason category only. They never contain email addresses, authorization codes,
tokens, cookie values, magic-link URLs, or service credentials. Failure messages
distinguish callback-host mismatch, missing PKCE verifier, expired/used link,
unauthorized email, missing configuration, and missing session-cookie writes.
