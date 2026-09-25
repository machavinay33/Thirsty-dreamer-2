-- =====================================================================
-- Thirsty Dreamer — initial schema, RLS, storage, and placeholder seed
-- Run this whole file once in Supabase → SQL Editor.
-- =====================================================================

-- ---------- Helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 200),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null,
  excerpt text,
  body_markdown text not null,
  cover_image_url text,
  video_url text,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  social_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 200),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  event_type text,
  venue text,
  city text,
  event_date date,
  description text,
  image_url text,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'upcoming', 'past')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_type text not null default 'video' check (media_type in ('video', 'image')),
  storage_path text not null,
  poster_path text,
  category text not null,          -- gallery slot key, e.g. 'behind-the-bar', 'hero', 'about'
  alt_text text,
  captions text,                   -- transcript / captions text
  sort_order integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('speaking', 'brand_collaboration', 'event', 'consultation', 'contact')),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text check (char_length(company) <= 160),
  city text check (char_length(city) <= 120),
  budget_range text check (char_length(budget_range) <= 120),
  event_date date,
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'in_review', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.secret_diner_waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  city text not null check (char_length(city) between 1 and 120),
  dietary_restrictions text check (char_length(dietary_restrictions) <= 500),
  note text check (char_length(note) <= 1000),
  consent boolean not null check (consent = true),
  created_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profiles', 'posts', 'events', 'media_assets'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- Indexes ----------
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists events_status_date_idx on public.events (status, event_date);
create index if not exists events_featured_idx on public.events (featured) where featured;
create index if not exists media_category_status_idx on public.media_assets (category, status, sort_order);
create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index if not exists inquiries_type_idx on public.inquiries (inquiry_type);
create index if not exists inquiries_email_idx on public.inquiries (email);
create index if not exists waitlist_created_idx on public.secret_diner_waitlist (created_at desc);
create index if not exists waitlist_email_idx on public.secret_diner_waitlist (email);

-- ---------- Role helper functions (security definer, fixed search_path) ----------
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.media_assets enable row level security;
alter table public.inquiries enable row level security;
alter table public.secret_diner_waitlist enable row level security;

-- profiles: staff read their own row; admins manage everything
drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());
drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert on public.profiles for insert to authenticated
  with check (public.is_admin());
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles for delete to authenticated
  using (public.is_admin());

-- posts
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts for select to anon, authenticated
  using (status = 'published');
drop policy if exists posts_staff_all on public.posts;
create policy posts_staff_all on public.posts for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- events (drafts stay private)
drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events for select to anon, authenticated
  using (status in ('upcoming', 'past'));
drop policy if exists events_staff_all on public.events;
create policy events_staff_all on public.events for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- media_assets
drop policy if exists media_public_read on public.media_assets;
create policy media_public_read on public.media_assets for select to anon, authenticated
  using (status = 'published');
drop policy if exists media_staff_all on public.media_assets;
create policy media_staff_all on public.media_assets for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- inquiries: public may INSERT only; staff read/update; admin delete
revoke all on public.inquiries from anon;
revoke all on public.secret_diner_waitlist from anon;
grant insert on public.inquiries to anon;
grant insert on public.secret_diner_waitlist to anon;

drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries for insert to anon, authenticated
  with check (status = 'new');
drop policy if exists inquiries_staff_read on public.inquiries;
create policy inquiries_staff_read on public.inquiries for select to authenticated
  using (public.is_staff());
drop policy if exists inquiries_staff_update on public.inquiries;
create policy inquiries_staff_update on public.inquiries for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
drop policy if exists inquiries_admin_delete on public.inquiries;
create policy inquiries_admin_delete on public.inquiries for delete to authenticated
  using (public.is_admin());

drop policy if exists waitlist_public_insert on public.secret_diner_waitlist;
create policy waitlist_public_insert on public.secret_diner_waitlist for insert to anon, authenticated
  with check (consent = true);
drop policy if exists waitlist_staff_read on public.secret_diner_waitlist;
create policy waitlist_staff_read on public.secret_diner_waitlist for select to authenticated
  using (public.is_staff());
drop policy if exists waitlist_admin_delete on public.secret_diner_waitlist;
create policy waitlist_admin_delete on public.secret_diner_waitlist for delete to authenticated
  using (public.is_admin());

-- ---------- Storage: public-read bucket "media" ----------
-- Public bucket = object URLs are readable by anyone; listing/upload/delete require staff.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists media_staff_select on storage.objects;
create policy media_staff_select on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_staff());
drop policy if exists media_staff_insert on storage.objects;
create policy media_staff_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());
drop policy if exists media_staff_update on storage.objects;
create policy media_staff_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
drop policy if exists media_staff_delete on storage.objects;
create policy media_staff_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());

-- ---------- Placeholder journal entries (edit or delete from Admin → Posts) ----------
insert into public.posts (title, slug, category, excerpt, body_markdown, author_name, status, published_at)
values
  ('Sustain Yourself First to Be Sustainable', 'sustain-yourself-first-to-be-sustainable', 'Sustainability',
   'Placeholder excerpt — edit this entry in Admin → Posts.',
   E'*This is a placeholder entry.* Replace it from **Admin → Posts**.', 'Massimo Zitti', 'published', now()),
  ('From a Dream to Reality', 'from-a-dream-to-reality', 'Founder Story',
   'Placeholder excerpt — edit this entry in Admin → Posts.',
   E'*This is a placeholder entry.* Replace it from **Admin → Posts**.', 'Massimo Zitti', 'published', now() - interval '1 minute'),
  ('Why Fermentation Is a Way of Thinking', 'why-fermentation-is-a-way-of-thinking', 'Fermentation',
   'Placeholder excerpt — edit this entry in Admin → Posts.',
   E'*This is a placeholder entry.* Replace it from **Admin → Posts**.', 'Massimo Zitti', 'published', now() - interval '2 minutes'),
  ('The Future of Hospitality Is Human', 'the-future-of-hospitality-is-human', 'Hospitality',
   'Placeholder excerpt — edit this entry in Admin → Posts.',
   E'*This is a placeholder entry.* Replace it from **Admin → Posts**.', 'Massimo Zitti', 'published', now() - interval '3 minutes')
on conflict (slug) do nothing;

-- ---------- FIRST ADMIN ----------
-- 1) Create the user in Supabase → Authentication → Users → Add user (email + password, auto-confirm).
-- 2) Then run this (replace the email) in the SQL Editor:
--
-- insert into public.profiles (id, full_name, role)
-- select id, 'Massimo Zitti', 'admin' from auth.users where email = 'you@example.com'
-- on conflict (id) do update set role = 'admin';
