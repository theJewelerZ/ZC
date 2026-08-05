begin;

create extension if not exists pgcrypto with schema extensions;

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz,
  submission_state text not null default 'pending'
    check (submission_state in ('pending', 'complete', 'failed')),
  submission_token_hash text,
  upload_manifest jsonb not null default '[]'::jsonb
    check (jsonb_typeof(upload_manifest) = 'array'),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 254),
  phone text,
  project_location text not null check (char_length(project_location) between 2 and 120),
  project_setting text not null check (char_length(project_setting) between 2 and 80),
  space_type text,
  review_preference text not null check (char_length(review_preference) between 2 and 80),
  room_width text,
  room_depth text,
  ceiling_height text,
  handedness text,
  simulator_system text,
  desired_timeline text,
  project_description text not null check (char_length(project_description) between 20 and 2000),
  referral_source text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'site_visit', 'proposal', 'won', 'lost', 'archived')),
  internal_notes text,
  privacy_consent_at timestamptz not null,
  source text not null default 'website' check (char_length(source) between 2 and 40),
  notification_status text
    check (notification_status is null or notification_status in ('pending', 'sent', 'partial', 'failed')),
  notification_error text,
  check (
    (submission_state = 'pending' and expires_at is not null and submission_token_hash is not null and completed_at is null)
    or
    (submission_state = 'complete' and expires_at is null and submission_token_hash is null and completed_at is not null)
    or
    (submission_state = 'failed')
  )
);

create table public.consultation_photos (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  created_at timestamptz not null default now(),
  storage_path text not null unique check (char_length(storage_path) between 10 and 500),
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 15728640),
  caption text check (caption is null or char_length(caption) <= 240),
  sort_order integer not null check (sort_order between 0 and 9),
  unique (consultation_id, sort_order)
);

create index consultations_created_at_idx on public.consultations (created_at desc);
create index consultations_status_created_at_idx on public.consultations (status, created_at desc);
create index consultations_pending_expiration_idx on public.consultations (expires_at)
  where submission_state = 'pending';
create index consultation_photos_consultation_idx
  on public.consultation_photos (consultation_id, sort_order);

create or replace function public.set_consultation_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_consultation_updated_at();

create or replace function public.finalize_consultation(
  target_consultation_id uuid,
  expected_token_hash text,
  photo_rows jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.consultations;
  photo jsonb;
begin
  select * into target
  from public.consultations
  where id = target_consultation_id
  for update;

  if target.id is null
    or target.submission_state <> 'pending'
    or target.expires_at <= now()
    or target.submission_token_hash <> expected_token_hash then
    return false;
  end if;

  if jsonb_typeof(photo_rows) <> 'array' or jsonb_array_length(photo_rows) > 10 then
    return false;
  end if;

  for photo in select * from jsonb_array_elements(photo_rows)
  loop
    insert into public.consultation_photos (
      consultation_id, storage_path, original_filename, mime_type,
      byte_size, caption, sort_order
    ) values (
      target_consultation_id, photo->>'storage_path',
      photo->>'original_filename', photo->>'mime_type',
      (photo->>'byte_size')::bigint, nullif(photo->>'caption', ''),
      (photo->>'sort_order')::integer
    );
  end loop;

  update public.consultations
  set submission_state = 'complete',
      completed_at = now(),
      expires_at = null,
      submission_token_hash = null,
      upload_manifest = '[]'::jsonb,
      notification_status = 'pending',
      notification_error = null
  where id = target_consultation_id;

  return true;
end;
$$;

alter table public.consultations enable row level security;
alter table public.consultations force row level security;
alter table public.consultation_photos enable row level security;
alter table public.consultation_photos force row level security;

revoke all on table public.consultations from anon, authenticated;
revoke all on table public.consultation_photos from anon, authenticated;
revoke all on function public.set_consultation_updated_at() from public, anon, authenticated;
revoke all on function public.finalize_consultation(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.finalize_consultation(uuid, text, jsonb) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'consultation-photos', 'consultation-photos', false, 15728640,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

commit;
