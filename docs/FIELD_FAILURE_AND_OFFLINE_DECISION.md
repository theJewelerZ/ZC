# Field Failure and Offline Decision

## Current decision

Field Mode is online-first. Offline synchronization and background upload queues
are explicitly deferred because conflict resolution, stale authorization,
private-data persistence, and duplicate writes add risk before field evidence
shows they are necessary.

## Failure evidence to record

For each real field session, record without customer data:

- connection type and general jobsite conditions;
- number of attempted and failed uploads;
- whether a retry succeeded;
- whether authorization expired;
- whether the browser/app was closed mid-capture;
- time required to complete the session;
- whether the founder fell back to the camera roll.

## Reconsider offline support when

- multiple real projects show repeatable connectivity failures;
- retry cannot make capture dependable;
- abandoned sessions or lost selections materially disrupt documentation; and
- the operational value exceeds the security, synchronization, and support
  cost.

The next decision should prefer the smallest intervention: draft retention or a
bounded upload queue before full offline synchronization.
