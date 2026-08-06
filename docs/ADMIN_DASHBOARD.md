# Founder Dashboard

The private route is `/admin`. Routine access uses Supabase email-and-password
Auth for a pre-created founder user. The application exposes no signup action,
automatic user creation, customer account, or public dashboard.

Every private page, signed-photo request, and mutation validates the Supabase
session server-side with `auth.getUser()` and then checks normalized email
membership in `ADMIN_ALLOWED_EMAILS`. Only then does the separate server-only
service client query consultation data. A valid Supabase account outside the
allowlist is signed out and denied.

Admin routes are dynamic, no-store, noindex, excluded from robots, and carry
private cache headers. Consultation data and authentication values are not sent
to Vercel Analytics.

## Password sign-in

`/admin/login` sends email and password in a same-origin JSON POST to
`/api/admin/auth/login`. The Route Handler creates a request-scoped Supabase SSR
client, calls `signInWithPassword`, verifies the authoritative user, checks
`ADMIN_ALLOWED_EMAILS`, and attaches every resulting session cookie to the
actual JSON response. The browser navigates to `/admin` only after that complete
server sequence succeeds.

Credential errors are deliberately generic. Email addresses, passwords, auth
tokens, cookie values, and provider error details are never logged. The endpoint
has a conservative in-process rate limit and remains subject to Supabase Auth
provider limits. Cookies are host-scoped, Secure where appropriate, and do not
use a hard-coded Domain.

## Initial password setup

`/admin/set-password` is accessible only to an already authenticated,
allowlisted founder. It calls Supabase `updateUser({ password })`; passwords are
never written to application tables, environment files, analytics, logs, or
documentation.

The application requires at least 14 characters with uppercase, lowercase, a
number, and a symbol. The founder should use a password manager to generate and
store a unique credential. The dashboard includes a restrained **Set password**
control. The application does not inspect password hashes or claim to detect
whether the Auth account already has a password.

If there is no usable authenticated session, the Forgot Password flow is the
safe first-password setup path for the existing Auth user.

## Password recovery

1. `/admin/forgot-password` collects an email and always uses a generic response.
2. A same-origin, rate-limited preflight runs before the browser calls Supabase
   `resetPasswordForEmail` with `shouldCreateUser` unavailable/not applicable.
3. The browser owns the PKCE verifier cookie and requests an exact
   `/auth/recovery` redirect on the same stable host.
4. `/auth/recovery` exchanges the one-time code on a response-bound SSR client,
   verifies the user and allowlist, and creates a ten-minute HttpOnly recovery
   marker.
5. `/admin/reset-password` requires both the allowlisted Supabase session and
   that recovery marker.
6. A successful reset uses Supabase `updateUser`, clears the marker, signs out
   the recovery session, and returns to routine password login.

Codes are short-lived and single-use through Supabase. Missing verifier,
expired/used link, missing marker, host mismatch, configuration failure, and
unauthorized email produce bounded founder-facing messages without exposing
secrets. No `next` or return URL from a request is honored.

## Dashboard scope

The list is newest first and includes received date, customer, location, project
type, review preference, status, photo count, email, and optional phone. The
detail view includes submitted fields, notification state, signed private
photos, status, and private notes. There are no charts, pipeline board, scoring,
deletion controls, automations, employee roles, or CRM widgets.

## Session behavior

The request proxy refreshes valid SSR sessions and forwards any refreshed
cookies on its returned response. Server Components use a read-only cookie
client. Route Handlers that establish, update, or clear authentication explicitly
attach Supabase cookies to their actual response. Sign-out is a POST and clears
cookies on its 303 redirect.

The public footer and mobile navigation retain one discreet `Founder Login`
link. It exposes no dashboard data and creates no customer account.
