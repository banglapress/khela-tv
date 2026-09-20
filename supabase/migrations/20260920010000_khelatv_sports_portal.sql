-- KhelaTV sports taxonomy on top of the inherited schema.
-- Source seeds live in supabase/sql/012_khelatv_sports_portal.sql (run after 001–011).
-- Safe to re-run. Does not copy The Connect rows.

insert into public.categories (name, slug, sort_order, show_in_nav, nav_order)
values
  ('বাংলাদেশ ক্রিকেট', 'cricket-bangladesh', 11, false, 11),
  ('আন্তর্জাতিক ক্রিকেট', 'cricket-international', 12, false, 12),
  ('আইপিএল', 'ipl', 13, false, 13),
  ('বিপিএল', 'bpl', 14, false, 14),
  ('বাংলাদেশ ফুটবল', 'football-bangladesh', 21, false, 21),
  ('আন্তর্জাতিক ফুটবল', 'football-international', 22, false, 22)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    show_in_nav = excluded.show_in_nav,
    nav_order = excluded.nav_order;

update public.categories
set show_in_nav = true,
    nav_order = sort_order
where slug in ('cricket', 'football', 'tennis', 'athletics', 'basketball', 'hockey', 'other-sports', 'analysis');

update public.categories child
set parent_id = parent.id
from public.categories parent
where parent.slug = 'cricket'
  and child.slug in ('cricket-bangladesh', 'cricket-international', 'ipl', 'bpl');

update public.categories child
set parent_id = parent.id
from public.categories parent
where parent.slug = 'football'
  and child.slug in ('football-bangladesh', 'football-international');
