-- Cursor (Anysphere): SF-based AI code editor; idempotent upsert for all envs.
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
  'cursor',
  'Cursor',
  'https://cursor.com',
  'AI-native code editor from Anysphere with agentic coding, '
    || 'inline LLMs, and tight repo context for day-to-day software work.',
  'Devtools',
  '33 New Montgomery St, San Francisco',
  'sf',
  37.7886,
  -122.4013,
  2022,
  null,
  'default',
  'https://en.wikipedia.org/wiki/Anysphere'
)
on conflict (slug) do update set
  name = excluded.name,
  website = excluded.website,
  short_description = excluded.short_description,
  category = excluded.category,
  location_label = excluded.location_label,
  city = excluded.city,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  founded = excluded.founded,
  logo_url = excluded.logo_url,
  map_sprite = excluded.map_sprite,
  source_url = excluded.source_url;
