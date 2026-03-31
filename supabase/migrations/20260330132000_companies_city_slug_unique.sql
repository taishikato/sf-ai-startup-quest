-- Allow the same company slug in different cities (e.g. Modal in SF and NY).
-- Must run before seed upserts that use on conflict (city, slug).
alter table public.companies
drop constraint if exists companies_slug_key;

alter table public.companies
add constraint companies_city_slug_key unique (city, slug);
