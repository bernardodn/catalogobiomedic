create schema if not exists extensions;
create schema if not exists private;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

create type public.app_role as enum ('admin');
create type public.catalog_item_type as enum ('active', 'product');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role public.app_role not null default 'admin',
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index categories_name_normalized_key on public.categories (lower(name));

create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique,
  type public.catalog_item_type not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  short_description text not null check (char_length(trim(short_description)) between 1 and 320),
  keywords text[] not null default '{}',
  search_document text not null default '',
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_items_keywords_limit check (cardinality(keywords) <= 20)
);

create index catalog_items_category_id_idx on public.catalog_items (category_id);
create index catalog_items_active_idx on public.catalog_items (active);
create index catalog_items_type_idx on public.catalog_items (type);
create index catalog_items_name_idx on public.catalog_items (name);
create index catalog_items_created_at_idx on public.catalog_items (created_at desc);
create index catalog_items_public_name_idx on public.catalog_items (name, id) where active = true;
create index catalog_items_public_category_name_idx on public.catalog_items (category_id, name) where active = true;
create index catalog_items_search_document_idx on public.catalog_items using gin (search_document extensions.gin_trgm_ops);

create or replace function private.normalize_catalog_text(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select lower(extensions.unaccent('extensions.unaccent', coalesce(value, '')))
$$;

create or replace function private.catalog_search_document(
  item_name text,
  item_type public.catalog_item_type,
  category_name text,
  description text,
  item_keywords text[]
)
returns text
language sql
immutable
set search_path = ''
as $$
  select private.normalize_catalog_text(
    concat_ws(' ', item_name, item_type::text, category_name, description, array_to_string(item_keywords, ' '))
  )
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.set_catalog_search_document()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  category_name text;
begin
  select name into category_name from public.categories where id = new.category_id;
  new.search_document = private.catalog_search_document(
    new.name, new.type, category_name, new.short_description, new.keywords
  );
  return new;
end;
$$;

create or replace function private.refresh_category_catalog_search()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.name is distinct from old.name then
    update public.catalog_items
    set search_document = private.catalog_search_document(
      name, type, new.name, short_description, keywords
    )
    where category_id = new.id;
  end if;
  return new;
end;
$$;

create trigger categories_set_updated_at before update on public.categories
for each row execute function private.set_updated_at();
create trigger catalog_items_set_updated_at before update on public.catalog_items
for each row execute function private.set_updated_at();
create trigger catalog_items_set_search before insert or update of name, type, category_id, short_description, keywords
on public.catalog_items for each row execute function private.set_catalog_search_document();
create trigger categories_refresh_catalog_search after update of name on public.categories
for each row execute function private.refresh_category_catalog_search();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'::public.app_role
  )
$$;

revoke all on schema private from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.catalog_items enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated using (id = (select auth.uid()));

create policy categories_public_select on public.categories
for select to anon, authenticated using (true);
create policy categories_admin_insert on public.categories
for insert to authenticated with check ((select private.is_admin()));
create policy categories_admin_update on public.categories
for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_admin_delete on public.categories
for delete to authenticated using ((select private.is_admin()));

create policy catalog_items_anon_active_select on public.catalog_items
for select to anon using (active = true);
create policy catalog_items_authenticated_active_select on public.catalog_items
for select to authenticated using (active = true);
create policy catalog_items_admin_select on public.catalog_items
for select to authenticated using ((select private.is_admin()));
create policy catalog_items_admin_insert on public.catalog_items
for insert to authenticated with check ((select private.is_admin()));
create policy catalog_items_admin_update on public.catalog_items
for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy catalog_items_admin_delete on public.catalog_items
for delete to authenticated using ((select private.is_admin()));

grant select on public.categories, public.catalog_items to anon;
grant select on public.profiles, public.categories, public.catalog_items to authenticated;
grant insert, update, delete on public.categories, public.catalog_items to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-images', 'catalog-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy catalog_images_public_select on storage.objects
for select to anon, authenticated using (bucket_id = 'catalog-images');
create policy catalog_images_admin_insert on storage.objects
for insert to authenticated with check (bucket_id = 'catalog-images' and (select private.is_admin()));
create policy catalog_images_admin_update on storage.objects
for update to authenticated using (bucket_id = 'catalog-images' and (select private.is_admin()))
with check (bucket_id = 'catalog-images' and (select private.is_admin()));
create policy catalog_images_admin_delete on storage.objects
for delete to authenticated using (bucket_id = 'catalog-images' and (select private.is_admin()));

create or replace function public.search_catalog_items(
  p_query text default '',
  p_type public.catalog_item_type default null,
  p_category_id uuid default null,
  p_sort text default 'name-asc',
  p_offset integer default 0,
  p_limit integer default 24,
  p_include_inactive boolean default false
)
returns table (
  id uuid,
  name text,
  slug text,
  type public.catalog_item_type,
  category_id uuid,
  short_description text,
  keywords text[],
  image_path text,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
language plpgsql
security invoker
set search_path = 'public', 'extensions', 'private'
as $$
declare
  normalized_query text := lower(extensions.unaccent('extensions.unaccent', coalesce(p_query, '')));
  safe_limit integer := least(greatest(coalesce(p_limit, 24), 1), 100);
  safe_offset integer := greatest(coalesce(p_offset, 0), 0);
begin
  if p_sort not in ('name-asc', 'name-desc', 'recent') then
    raise exception 'Invalid catalog sort';
  end if;
  if p_include_inactive and not private.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
  select
    item.id, item.name, item.slug, item.type, item.category_id,
    item.short_description, item.keywords, item.image_path, item.active,
    item.created_at, item.updated_at, count(*) over() as total_count
  from public.catalog_items item
  where (p_include_inactive or item.active = true)
    and (p_type is null or item.type = p_type)
    and (p_category_id is null or item.category_id = p_category_id)
    and (normalized_query = '' or item.search_document like '%' || normalized_query || '%')
  order by
    case when p_sort = 'name-asc' then item.name end asc,
    case when p_sort = 'name-desc' then item.name end desc,
    case when p_sort = 'recent' then item.created_at end desc,
    item.id asc
  offset safe_offset limit safe_limit;
end;
$$;

revoke execute on function public.search_catalog_items(text, public.catalog_item_type, uuid, text, integer, integer, boolean) from public;
grant execute on function public.search_catalog_items(text, public.catalog_item_type, uuid, text, integer, integer, boolean) to anon, authenticated;
