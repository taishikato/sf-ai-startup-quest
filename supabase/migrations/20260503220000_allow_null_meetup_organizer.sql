alter table public.meetups
  alter column organizer_name drop not null;

alter table public.meetups
  drop constraint if exists meetups_organizer_name_len;

alter table public.meetups
  add constraint meetups_organizer_name_len check (
    organizer_name is null
    or char_length(organizer_name) between 1 and 120
  );
