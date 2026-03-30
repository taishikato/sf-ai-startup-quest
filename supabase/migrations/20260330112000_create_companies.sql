create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.companies (
  id bigint generated always as identity primary key,
  slug text not null,
  name text not null,
  website text not null,
  short_description text not null,
  category text not null,
  location_label text not null,
  latitude double precision not null,
  longitude double precision not null,
  founded integer not null,
  logo_url text,
  map_sprite text not null default 'default',
  source_url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint companies_slug_key unique (slug),
  constraint companies_category_check check (
    category in (
      'Core Labs',
      'Consumer AI',
      'Devtools',
      'Infra',
      'Agents',
      'Vertical AI'
    )
  ),
  constraint companies_founded_check check (
    founded between 1900 and 2100
  ),
  constraint companies_latitude_check check (
    latitude between -90 and 90
  ),
  constraint companies_longitude_check check (
    longitude between -180 and 180
  ),
  constraint companies_map_sprite_check check (
    map_sprite in ('default', 'boss')
  )
);

create index if not exists companies_category_idx
  on public.companies (category);

create index if not exists companies_name_idx
  on public.companies (name);

drop trigger if exists set_companies_updated_at on public.companies;

create trigger set_companies_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

alter table public.companies enable row level security;

drop policy if exists "Companies are publicly readable" on public.companies;

create policy "Companies are publicly readable"
on public.companies
for select
to anon, authenticated
using (true);

revoke insert, update, delete on public.companies from anon, authenticated;
grant select on public.companies to anon, authenticated;
