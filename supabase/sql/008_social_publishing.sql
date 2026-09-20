-- Phase 6: photo card + Facebook publishing. Additive. Safe to re-run.
-- Does not alter public articles rows or existing research/article columns.

alter table public.desk_stories add column if not exists card_ratio text;
alter table public.desk_stories add column if not exists card_generated_at timestamptz;
alter table public.desk_stories add column if not exists facebook_status text;
alter table public.desk_stories add column if not exists facebook_published_at timestamptz;
alter table public.desk_stories add column if not exists facebook_error text;
alter table public.desk_stories add column if not exists facebook_page_name text;

insert into public.desk_settings (key, value)
values
  ('card_template', '{"brand":"KhelaTV","ratio":"4:5","accent":"#1F6B45","background":"#F4F1EA","text":"#121814","logoUrl":"/logo.svg"}'::jsonb)
on conflict (key) do nothing;

notify pgrst, 'reload schema';
