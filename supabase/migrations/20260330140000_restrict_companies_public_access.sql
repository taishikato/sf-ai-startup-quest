alter table public.companies enable row level security;

drop policy if exists "Companies are publicly readable" on public.companies;

revoke select on public.companies from anon, authenticated;
