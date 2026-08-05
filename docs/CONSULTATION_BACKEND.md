# Consultation Backend

## Boundary

Supabase Postgres is the system of record for simulator consultation requests.
Resend is a notification channel. The system is limited to secure lead intake,
optional private room photographs, and founder review. It is not a CRM,
estimator, project manager, customer portal, proposal system, or scheduler.

## Durable workflow

1. POST /api/consultations/start validates the existing simulator form,
   honeypot/timing signal, rate limit, Turnstile, and photo descriptors.
2. A server-only service client creates a pending consultation that expires in
   24 hours and stores only a hash of the one-time submission token.
3. The server issues one-object signed upload authorizations for generated paths.
4. The browser uploads directly to the private consultation-photos bucket.
5. POST /api/consultations/finalize revalidates the session, stored sizes,
   declared MIME types, captions, expected paths, and image signatures.
6. A security-definer function granted only to service_role atomically inserts
   photo metadata and changes the consultation to complete.
7. Founder and customer emails are attempted. Their aggregate result is recorded
   as sent, partial, or failed; email failure never removes a stored lead.

POST /api/consultations/cancel removes successfully uploaded objects and the
pending row after a failed/cancelled client flow. Start requests also perform a
bounded best-effort cleanup of expired pending records and folders.

## Upload policy

- Maximum 10 files
- JPEG, PNG, and WebP only
- 15 MiB per file; 75 MiB combined
- Generated UUID filenames below consultations/{id}/
- Private bucket, no public URL/list/read policy
- Client checks plus server descriptor/object/signature verification
- Original filename retained only as normalized metadata
- Optional captions limited to 240 characters
- Five-minute signed read URLs created only after founder authorization
- HEIC/HEIF deferred until reliable browser and verification support exists

Durable database failure returns no success. Upload or verification failure
leaves a retryable pending record which is cancelled by the client or expires.
If persistence succeeds but Resend fails, the response honestly confirms storage
and the dashboard shows the notification state. Logs contain IDs, counts, event
names, and broad error classes—not PII, tokens, signed URLs, or secrets.
