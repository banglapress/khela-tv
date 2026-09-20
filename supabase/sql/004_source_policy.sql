-- KhelaTV source policy: sports specialist + international feeds.
-- Does not delete desk_stories or public articles.

alter table public.news_sources add column if not exists source_kind text not null default 'other';
alter table public.news_sources add column if not exists discovery_mode text not null default 'rss';

update public.news_sources
set source_kind = 'international',
    discovery_mode = 'rss',
    updated_at = now()
where name ilike 'BBC Sport%';

insert into public.news_sources (
  name, homepage_url, rss_url, category_slug, active, trust_level, priority, notes, source_kind, discovery_mode
)
select
  'BBC Sport Athletics',
  'https://www.bbc.com/sport/athletics',
  'https://feeds.bbci.co.uk/sport/athletics/rss.xml',
  'athletics',
  true,
  5,
  45,
  'Verified BBC Sport athletics RSS.',
  'international',
  'rss'
where not exists (
  select 1 from public.news_sources s where s.name = 'BBC Sport Athletics'
);
