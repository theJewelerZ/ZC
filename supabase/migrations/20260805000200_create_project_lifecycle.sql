begin;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  consultation_id uuid references public.consultations(id) on delete set null,
  internal_name text not null check (char_length(trim(internal_name)) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 120),
  public_title text not null check (char_length(trim(public_title)) between 2 and 160),
  public_summary text check (public_summary is null or char_length(public_summary) <= 600),
  public_location text check (public_location is null or char_length(public_location) <= 120),
  private_address text,
  internal_scope text,
  internal_notes text,
  operational_status text not null default 'planning'
    check (operational_status in ('planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived')),
  publication_status text not null default 'private'
    check (publication_status in ('private', 'draft', 'published', 'unpublished')),
  project_stage text not null default 'planning'
    check (project_stage in ('consultation', 'planning', 'preparation', 'framing', 'protection', 'finish_work', 'technology_coordination', 'final_details', 'complete')),
  public_build_status text not null default 'upcoming'
    check (public_build_status in ('upcoming', 'current', 'completed')),
  featured_on_homepage boolean not null default false,
  started_on date,
  completed_on date,
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  check (completed_on is null or started_on is null or completed_on >= started_on),
  check (publication_status <> 'published' or (public_summary is not null and char_length(trim(public_summary)) >= 20)),
  unique (consultation_id)
);

create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  occurred_on date not null default current_date,
  title text not null check (char_length(trim(title)) between 2 and 160),
  body text not null check (char_length(trim(body)) between 10 and 5000),
  project_stage text not null default 'planning'
    check (project_stage in ('consultation', 'planning', 'preparation', 'framing', 'protection', 'finish_work', 'technology_coordination', 'final_details', 'complete')),
  publication_status text not null default 'private'
    check (publication_status in ('private', 'draft', 'published', 'unpublished')),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid
);

create table public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  update_id uuid references public.project_updates(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  private_storage_path text not null unique check (char_length(private_storage_path) between 10 and 500),
  public_storage_path text unique,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 15728640),
  caption text check (caption is null or char_length(caption) <= 300),
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  upload_state text not null default 'pending' check (upload_state in ('pending', 'complete', 'failed')),
  upload_expires_at timestamptz,
  sort_order integer not null default 0 check (sort_order >= 0),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  check (
    visibility <> 'public'
    or (
      upload_state = 'complete'
      and approval_status = 'approved'
      and public_storage_path is not null
      and caption is not null and char_length(trim(caption)) > 0
      and alt_text is not null and char_length(trim(alt_text)) > 0
    )
  )
);

create index projects_publication_idx on public.projects (publication_status, public_build_status, published_at desc);
create index projects_operational_idx on public.projects (operational_status, updated_at desc);
create index project_updates_project_idx on public.project_updates (project_id, occurred_on desc, created_at desc);
create index project_updates_public_idx on public.project_updates (project_id, publication_status, occurred_on desc);
create index project_photos_project_idx on public.project_photos (project_id, visibility, sort_order, created_at);
create index project_photos_pending_idx on public.project_photos (upload_expires_at) where upload_state = 'pending';

create or replace function public.set_project_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_project_updated_at();
create trigger project_updates_set_updated_at before update on public.project_updates
for each row execute function public.set_project_updated_at();
create trigger project_photos_set_updated_at before update on public.project_photos
for each row execute function public.set_project_updated_at();

alter table public.projects enable row level security;
alter table public.projects force row level security;
alter table public.project_updates enable row level security;
alter table public.project_updates force row level security;
alter table public.project_photos enable row level security;
alter table public.project_photos force row level security;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.project_updates from anon, authenticated;
revoke all on table public.project_photos from anon, authenticated;
revoke all on function public.set_project_updated_at() from public, anon, authenticated;

create policy projects_deny_direct_access on public.projects for all to anon, authenticated using (false) with check (false);
create policy project_updates_deny_direct_access on public.project_updates for all to anon, authenticated using (false) with check (false);
create policy project_photos_deny_direct_access on public.project_photos for all to anon, authenticated using (false) with check (false);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media-private', 'project-media-private', false, 15728640, array['image/jpeg', 'image/png', 'image/webp']),
  ('project-media-public', 'project-media-public', true, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy project_public_media_read on storage.objects
for select to anon, authenticated
using (bucket_id = 'project-media-public');

commit;
