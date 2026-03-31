-- Modal SF office: verified by Modal team (see GitHub issue #16).
insert into public.companies (
  slug,
  name,
  website,
  short_description,
  category,
  location_label,
  city,
  latitude,
  longitude,
  founded,
  logo_url,
  map_sprite,
  source_url
)
values (
  'modal',
  'Modal',
  'https://modal.com',
  'Serverless cloud platform for running AI and data workloads on GPUs.',
  'Infra',
  '375 Alabama St, San Francisco',
  'sf',
  37.7651442,
  -122.4143487,
  2021,
  null,
  'default',
  'https://github.com/taishikato/sf-ai-startup-quest/issues/16'
)
on conflict (city, slug) do update set
  name = excluded.name,
  website = excluded.website,
  short_description = excluded.short_description,
  category = excluded.category,
  location_label = excluded.location_label,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  founded = excluded.founded,
  logo_url = excluded.logo_url,
  map_sprite = excluded.map_sprite,
  source_url = excluded.source_url;
