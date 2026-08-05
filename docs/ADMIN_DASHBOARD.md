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
