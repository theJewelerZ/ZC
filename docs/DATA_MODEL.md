# Consultation Data Model

The consultations table stores contact, room context, review preference, status,
private notes, consent, lifecycle, and notification state. submission_state is
constrained to pending, complete, or failed. Lead status is constrained to new,
reviewing, contacted, site_visit, proposal, won, lost, or archived.

The consultation_photos table stores verified metadata only: consultation
foreign key, private storage path, normalized original filename, MIME type, byte
size, optional caption, and sort order. The foreign key uses cascading metadata
cleanup. Image binaries remain in Storage.

Pending-only indexes support expiration cleanup. Status/created indexes support
the newest-first dashboard. A trigger updates updated_at.

RLS is enabled and forced on both public-schema tables. Privileges are revoked
from anon and authenticated; no permissive public policy exists. Public creation
and founder access run through authorized server boundaries. The service
credential is isolated in a non-SSR server client.

The finalize_consultation function locks and validates the pending row, inserts
verified photo metadata, and completes the consultation in one transaction.
Execute is granted only to service_role.

Metadata cascade does not itself delete Storage objects. Application cleanup
removes private objects first, then the pending/database row. Record deletion is
not exposed in the founder dashboard.
