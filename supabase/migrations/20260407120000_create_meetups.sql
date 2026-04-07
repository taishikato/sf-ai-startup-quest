-- Meetup listings with RLS: public read published only; writes via service role only.

create table if not exists public.meetups (
  id bigint generated always as identity primary key,
  slug text not null,
  city text not null,
  title text not null,
  description text not null,
  venue_name text not null,
  location_label text not null,
  latitude double precision not null,
  longitude double precision not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  organizer_name text not null,
  event_url text not null,
  contact_email text,
  status text not null default 'published',
  payload_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint meetups_city_slug_key unique (city, slug),
  constraint meetups_city_check check (
    city in ('sf', 'toronto', 'ny', 'london', 'vancouver', 'tokyo')
  ),
  constraint meetups_status_check check (
    status in ('published', 'cancelled', 'hidden')
  ),
  constraint meetups_latitude_check check (latitude between -90 and 90),
  constraint meetups_longitude_check check (longitude between -180 and 180),
  constraint meetups_title_len check (char_length(title) between 1 and 200),
  constraint meetups_description_len check (char_length(description) between 1 and 5000),
  constraint meetups_venue_name_len check (char_length(venue_name) between 1 and 200),
  constraint meetups_location_label_len check (char_length(location_label) between 1 and 300),
  constraint meetups_organizer_name_len check (char_length(organizer_name) between 1 and 120),
  constraint meetups_event_url_len check (char_length(event_url) between 1 and 2000),
  constraint meetups_contact_email_len check (
    contact_email is null or char_length(contact_email) between 1 and 255
  ),
  constraint meetups_ends_after_starts check (
    ends_at is null or ends_at > starts_at
  )
);

create index if not exists meetups_city_status_starts_at_idx
  on public.meetups (city, status, starts_at);

drop trigger if exists set_meetups_updated_at on public.meetups;

create trigger set_meetups_updated_at
before update on public.meetups
for each row
execute function public.set_updated_at();

alter table public.meetups enable row level security;

drop policy if exists "Published meetups are publicly readable" on public.meetups;

create policy "Published meetups are publicly readable"
on public.meetups
for select
to anon, authenticated
using (status = 'published');

revoke insert, update, delete on public.meetups from anon, authenticated;
grant select on public.meetups to anon, authenticated;

-- Rate limiting and abuse tracking (service role only; no public access)
create table if not exists public.meetup_submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  payload_hash text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists meetup_submission_attempts_ip_created_idx
  on public.meetup_submission_attempts (ip_hash, created_at desc);

create index if not exists meetup_submission_attempts_payload_created_idx
  on public.meetup_submission_attempts (payload_hash, created_at desc);

alter table public.meetup_submission_attempts enable row level security;

revoke all on public.meetup_submission_attempts from anon, authenticated;
