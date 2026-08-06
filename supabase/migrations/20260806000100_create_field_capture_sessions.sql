begin;

create table public.field_capture_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz,
  client_submission_id uuid not null unique,
  session_state text not null default 'pending'
    check (session_state in ('pending', 'complete', 'partial', 'failed')),
  project_stage text not null
    check (project_stage in ('consultation', 'planning', 'preparation', 'framing', 'protection', 'finish_work', 'technology_coordination', 'final_details', 'complete')),
  field_note text check (field_note is null or char_length(field_note) <= 1000),
  expected_photo_count integer not null default 0
    check (expected_photo_count between 0 and 20),
  completed_photo_count integer not null default 0
    check (completed_photo_count between 0 and 20),
  failed_photo_count integer not null default 0
    check (failed_photo_count between 0 and 20),
  captured_by uuid,
  check (
    (session_state = 'pending' and expires_at is not null and completed_at is null)
    or
    (session_state in ('complete', 'partial') and expires_at is null and completed_at is not null)
    or
    (session_state = 'failed')
  )
);

alter table public.project_photos
  add column capture_session_id uuid references public.field_capture_sessions(id) on delete set null,
  add column publication_candidate boolean not null default false;

alter table public.project_photos
  add constraint project_photos_candidate_is_private check (
    not publication_candidate
    or (visibility = 'private' and approval_status = 'pending')
  );

create index field_capture_sessions_project_created_idx
  on public.field_capture_sessions (project_id, created_at desc);
create index field_capture_sessions_pending_expiration_idx
  on public.field_capture_sessions (expires_at)
  where session_state = 'pending';
create index project_photos_capture_session_idx
  on public.project_photos (capture_session_id, sort_order, created_at);
create index project_photos_candidate_idx
  on public.project_photos (project_id, publication_candidate, created_at desc)
  where publication_candidate = true;

create trigger field_capture_sessions_set_updated_at
before update on public.field_capture_sessions
for each row execute function public.set_project_updated_at();

alter table public.field_capture_sessions enable row level security;
alter table public.field_capture_sessions force row level security;
revoke all on table public.field_capture_sessions from anon, authenticated;
create policy field_capture_sessions_deny_direct_access
  on public.field_capture_sessions for all to anon, authenticated
  using (false) with check (false);

commit;
