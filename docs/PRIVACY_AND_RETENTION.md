# Privacy and Retention Operations

Consultations may contain contact details, general project location, simulator
and room context, approximate dimensions, free text, referral information, and
up to ten optional photographs/captions. Customers are warned not to upload
private documents or people without permission.

Supabase processes durable records, private photos, and founder authentication;
Vercel hosts the application; Resend sends notifications; Cloudflare performs
abuse checks when configured; Vercel Analytics receives only PII-free events.

Incomplete upload sessions expire after 24 hours and are cleaned in bounded
batches. Completed inquiries are retained according to legitimate inquiry,
business, project, and legal needs; the company does not promise zero retention
by third-party processors or a fixed automatic deletion date.

Correction/deletion requests require reasonable identity verification and may
be limited by legitimate legal or business obligations. Operational logs,
screenshots, analytics, documentation, and public issue trackers must not contain
consultation content, credentials, file contents, or signed URLs.

## Field captures

Field capture notes, project stages, timestamps, original files, filenames, and candidate classifications are private operational records. They are available only through founder-authorized server paths. Public repositories do not read capture sessions. Originals remain in the private project-media bucket; publication creates a separate approved copy. Expired incomplete sessions are marked failed and their pending objects are removed during bounded cleanup. Retention follows project, business, legal, and documentation needs.