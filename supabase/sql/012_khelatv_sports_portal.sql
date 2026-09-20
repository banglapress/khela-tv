-- KhelaTV sports taxonomy, placeholder local sources, and card branding.
-- Run AFTER 001–011 on a fresh independent database. Safe to re-run.
-- Does not copy The Connect rows.

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

insert into public.news_sources (
  name, homepage_url, rss_url, category_slug, active, trust_level, priority, notes, source_kind, discovery_mode
)
select * from (values
  ('BBC Sport Athletics', 'https://www.bbc.com/sport/athletics', 'https://feeds.bbci.co.uk/sport/athletics/rss.xml', 'athletics', true, 5, 45,
    'Verified BBC Sport athletics RSS.', 'international', 'rss'),
  ('প্রথম আলো খেলা', 'https://www.prothomalo.com/sports', null, 'cricket', false, 4, 80,
    'বাংলাদেশি স্পোর্টস ফিড। অফিসিয়াল RSS URL নিশ্চিত না হওয়ায় placeholder — পরে rss_url দিন, তারপর active=true করুন।',
    'major_news', 'manual'),
  ('দি ডেইলি স্টার স্পোর্টস', 'https://www.thedailystar.net/sports', null, 'cricket', false, 4, 81,
    'ইংরেজি বাংলাদেশি স্পোর্টস ডেস্ক। নিশ্চিত RSS URL পরে যোগ করুন।',
    'major_news', 'manual'),
  ('টি স্পোর্টস', 'https://www.tsports.com', null, 'football', false, 3, 82,
    'স্থানীয় স্পোর্টস চ্যানেল। ফিড URL নিশ্চিত না।',
    'specialist', 'manual'),
  ('বাংলাদেশ ক্রিকেট বোর্ড', 'https://www.bcb.com.bd', null, 'cricket-bangladesh', false, 5, 83,
    'অফিসিয়াল বোর্ড সাইট। পাবলিক RSS পাওয়া যায়নি।',
    'news_agency', 'manual'),
  ('ESPN Cricinfo', 'https://www.espncricinfo.com', null, 'cricket', false, 5, 84,
    'ক্রিকেট কভারেজ। স্থিতিশীল পাবলিক RSS এই সেটআপে যাচাই হয়নি — URL পরে দিন।',
    'specialist', 'manual')
) as seed(name, homepage_url, rss_url, category_slug, active, trust_level, priority, notes, source_kind, discovery_mode)
where not exists (select 1 from public.news_sources s where s.name = seed.name);

insert into public.desk_settings (key, value)
values
  ('card_template', '{"brand":"KhelaTV","ratio":"4:5","accent":"#1F6B45","background":"#F4F1EA","text":"#121814","logoUrl":"/logo.svg"}'::jsonb),
  ('style_rules', '{"tone":"neutral","language":"bn-BD","desk":"sports","no_fabricated_scores":true,"no_fabricated_names":true,"no_clickbait":true}'::jsonb)
on conflict (key) do update set value = excluded.value;

notify pgrst, 'reload schema';
