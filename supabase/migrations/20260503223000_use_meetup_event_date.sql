drop view if exists public.published_upcoming_meetups;

alter table public.meetups
  add column if not exists event_date date;

update public.meetups
set event_date = case city
  when 'sf' then (starts_at at time zone 'America/Los_Angeles')::date
  when 'toronto' then (starts_at at time zone 'America/Toronto')::date
  when 'ny' then (starts_at at time zone 'America/New_York')::date
  when 'london' then (starts_at at time zone 'Europe/London')::date
  when 'vancouver' then (starts_at at time zone 'America/Vancouver')::date
  when 'tokyo' then (starts_at at time zone 'Asia/Tokyo')::date
  else starts_at::date
end
where event_date is null;

alter table public.meetups
  alter column event_date set not null;

alter table public.meetups
  drop constraint if exists meetups_ends_after_starts;

drop index if exists public.meetups_city_status_starts_at_idx;

alter table public.meetups
  drop column if exists starts_at,
  drop column if exists ends_at;

create index if not exists meetups_city_status_event_date_idx
  on public.meetups (city, status, event_date);

create or replace view public.published_upcoming_meetups
with (security_barrier = true)
as
select
  slug,
  city,
  title,
  description,
  venue_name,
  location_label,
  latitude,
  longitude,
  event_date,
  organizer_name,
  event_url,
  status
from public.meetups
where
  status = 'published'
  and event_date >= case city
    when 'sf' then (now() at time zone 'America/Los_Angeles')::date
    when 'toronto' then (now() at time zone 'America/Toronto')::date
    when 'ny' then (now() at time zone 'America/New_York')::date
    when 'london' then (now() at time zone 'Europe/London')::date
    when 'vancouver' then (now() at time zone 'America/Vancouver')::date
    when 'tokyo' then (now() at time zone 'Asia/Tokyo')::date
    else current_date
  end;

revoke select on public.meetups from anon, authenticated;
revoke all on public.published_upcoming_meetups from anon, authenticated;
grant select on public.published_upcoming_meetups to anon, authenticated;
