create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by all" on public.profiles for select using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create policy "own roles readable" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);
create policy "admins manage categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.categories (name, slug, sort_order) values
  ('ক্রিকেট','cricket',1),
  ('ফুটবল','football',2),
  ('টেনিস','tennis',3),
  ('অ্যাথলেটিক্স','athletics',4),
  ('বাস্কেটবল','basketball',5),
  ('হকি','hockey',6),
  ('অন্যান্য খেলা','other-sports',7),
  ('বিশ্লেষণ','analysis',8);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  category_slug text not null references public.categories(slug) on update cascade,
  tags text[] not null default '{}',
  image_url text,
  image_caption text,
  author_name text not null default 'নিজস্ব প্রতিবেদক',
  author_id uuid references auth.users(id) on delete set null,
  is_lead boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_category_idx on public.articles (category_slug, published_at desc);
create index articles_status_idx on public.articles (status, published_at desc);

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;
grant all on public.articles to service_role;
alter table public.articles enable row level security;
create policy "published articles public read" on public.articles for select using (status = 'published');
create policy "staff read all articles" on public.articles for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "staff insert articles" on public.articles for insert to authenticated
  with check (public.is_staff(auth.uid()));
create policy "staff update articles" on public.articles for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff delete articles" on public.articles for delete to authenticated
  using (public.is_staff(auth.uid()));

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

-- Fresh KhelaTV databases start with no public articles.
-- Do not copy The Connect production rows into this project.

create policy "staff read news images" on storage.objects for select to authenticated
  using (bucket_id = 'news-images' and public.is_staff(auth.uid()));
create policy "staff upload news images" on storage.objects for insert to authenticated
  with check (bucket_id = 'news-images' and public.is_staff(auth.uid()));
create policy "staff update news images" on storage.objects for update to authenticated
  using (bucket_id = 'news-images' and public.is_staff(auth.uid()));
create policy "staff delete news images" on storage.objects for delete to authenticated
  using (bucket_id = 'news-images' and public.is_staff(auth.uid()));