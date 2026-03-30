alter table public.companies
add column if not exists city text;

update public.companies
set city = case
  when location_label like '%Mountain View' then 'Mountain View'
  else 'San Francisco'
end
where city is null;

alter table public.companies
alter column city set not null;

create index if not exists companies_city_idx
  on public.companies (city);
