# Zarka Field PWA Installation

The existing web application is installable as **Zarka Field** and launches at
`/field`. It reuses the approved Zarka icon, navy background and approved brand colors.

## iPhone

1. Open `https://www.zarkaconstruction.com/field` in Safari.
2. Sign in with the founder account.
3. Tap **Share**.
4. Tap **Add to Home Screen**.
5. Confirm **Add**.

## Android

1. Open `https://www.zarkaconstruction.com/field` in Chrome.
2. Sign in with the founder account.
3. Open Chrome's menu.
4. Tap **Install app** or **Add to Home screen**.
5. Confirm installation.

The installed app uses the same host-scoped Supabase session. If that session
expires, it returns to founder sign-in and then back to `/field`.

## Cache policy

Phase 2 registers no service worker. Private project data and authenticated
responses are never cached for offline access. The manifest and HTTPS provide
the install surface; offline project writes remain deferred.
