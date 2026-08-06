begin;

alter table public.projects
  add column publication_permission_status text not null default 'not_recorded'
    check (publication_permission_status in ('not_recorded', 'granted', 'withdrawn')),
  add column publication_permission_method text
    check (publication_permission_method is null or publication_permission_method in ('written', 'contract', 'email', 'other')),
  add column publication_permission_recorded_at timestamptz,
  add column publication_permission_withdrawn_at timestamptz,
  add column publication_permission_reference text
    check (publication_permission_reference is null or char_length(publication_permission_reference) <= 500),
  add column publication_permission_notes text
    check (publication_permission_notes is null or char_length(publication_permission_notes) <= 2000),
  add column planned_start_on date,
  add column planned_completion_on date,
  add column actual_started_on date,
  add column actual_completed_on date,
  add column public_starting_point text
    check (public_starting_point is null or char_length(public_starting_point) <= 3000),
  add column public_zarka_role text
    check (public_zarka_role is null or char_length(public_zarka_role) <= 3000),
  add column public_outcome text
    check (public_outcome is null or char_length(public_outcome) <= 3000),
  add column public_planning_takeaways text
    check (public_planning_takeaways is null or char_length(public_planning_takeaways) <= 3000),
  add column cover_photo_id uuid references public.project_photos(id) on delete set null,
  add column social_photo_id uuid references public.project_photos(id) on delete set null,
  add constraint projects_permission_state_valid check (
    (publication_permission_status = 'not_recorded'
      and publication_permission_method is null
      and publication_permission_recorded_at is null
      and publication_permission_withdrawn_at is null)
    or
    (publication_permission_status = 'granted'
      and publication_permission_method is not null
      and publication_permission_recorded_at is not null
      and publication_permission_withdrawn_at is null)
    or
    (publication_permission_status = 'withdrawn'
      and publication_permission_recorded_at is not null
      and publication_permission_withdrawn_at is not null)
  ),
  add constraint projects_planned_dates_valid check (
    planned_completion_on is null or planned_start_on is null or planned_completion_on >= planned_start_on
  ),
  add constraint projects_actual_dates_valid check (
    actual_completed_on is null or actual_started_on is null or actual_completed_on >= actual_started_on
  );

update public.projects
set
  planned_start_on = started_on,
  planned_completion_on = completed_on
where planned_start_on is null and planned_completion_on is null;

-- The founder confirmed that this existing public Build has written publication
-- permission. This records the business decision without storing the document.
update public.projects
set
  publication_permission_status = 'granted',
  publication_permission_method = 'written',
  publication_permission_recorded_at = now(),
  publication_permission_notes = 'Founder confirmed written publication permission before the editorial journal migration.'
where slug = 'albatross-golf-mason'
  and publication_permission_status = 'not_recorded';

alter table public.project_photos
  add column public_mime_type text
    check (public_mime_type is null or public_mime_type = 'image/jpeg'),
  add column public_byte_size bigint
    check (public_byte_size is null or public_byte_size > 0),
  add column public_width integer
    check (public_width is null or public_width > 0),
  add column public_height integer
    check (public_height is null or public_height > 0),
  add column public_generated_at timestamptz;

alter table public.consultations
  add column source_project_id uuid references public.projects(id) on delete set null;

create index consultations_source_project_idx
  on public.consultations (source_project_id)
  where source_project_id is not null;

create or replace function public.validate_project_editorial_photo()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  selected_photo_id uuid;
  selected_photo public.project_photos%rowtype;
begin
  foreach selected_photo_id in array array[new.cover_photo_id, new.social_photo_id]
  loop
    if selected_photo_id is null then
      continue;
    end if;

    select * into selected_photo
    from public.project_photos
    where id = selected_photo_id;

    if selected_photo.id is null
      or selected_photo.project_id <> new.id
      or selected_photo.visibility <> 'public'
      or selected_photo.approval_status <> 'approved'
      or selected_photo.upload_state <> 'complete'
      or selected_photo.public_storage_path is null
      or selected_photo.public_generated_at is null
    then
      raise exception 'Selected editorial photo must be a sanitized published photo from the same project.';
    end if;
  end loop;

  return new;
end;
$$;

create trigger projects_validate_editorial_photo
before insert or update of cover_photo_id, social_photo_id on public.projects
for each row execute function public.validate_project_editorial_photo();

create or replace function public.clear_invalid_project_editorial_photo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.visibility <> 'public'
    or new.approval_status <> 'approved'
    or new.upload_state <> 'complete'
    or new.public_storage_path is null
    or new.public_generated_at is null
  then
    update public.projects
    set
      cover_photo_id = case when cover_photo_id = new.id then null else cover_photo_id end,
      social_photo_id = case when social_photo_id = new.id then null else social_photo_id end
    where cover_photo_id = new.id or social_photo_id = new.id;
  end if;

  return new;
end;
$$;

create trigger project_photos_clear_invalid_editorial_photo
after update of visibility, approval_status, upload_state, public_storage_path, public_generated_at
on public.project_photos
for each row execute function public.clear_invalid_project_editorial_photo();

revoke all on function public.validate_project_editorial_photo() from public, anon, authenticated;
revoke all on function public.clear_invalid_project_editorial_photo() from public, anon, authenticated;

commit;
