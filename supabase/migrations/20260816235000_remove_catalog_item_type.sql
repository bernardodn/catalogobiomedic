alter table public.catalog_items drop column if exists type;
drop index if exists public.catalog_items_type_idx;

drop trigger if exists catalog_items_set_search on public.catalog_items;
drop function if exists private.set_catalog_search_document();
drop function if exists private.catalog_search_document(text, public.catalog_item_type, text, text, text[]);
create or replace function private.catalog_search_document(
  item_name text, category_name text, description text, item_keywords text[]
) returns text language sql immutable set search_path = '' as $$
  select private.normalize_catalog_text(concat_ws(' ', item_name, category_name, description, array_to_string(item_keywords, ' ')))
$$;
create or replace function private.set_catalog_search_document()
returns trigger language plpgsql security definer set search_path = '' as $$
declare category_name text;
begin
  select name into category_name from public.categories where id = new.category_id;
  new.search_document = private.catalog_search_document(new.name, category_name, new.short_description, new.keywords);
  return new;
end;
$$;
create trigger catalog_items_set_search before insert or update of name, category_id, short_description, keywords
on public.catalog_items for each row execute function private.set_catalog_search_document();

drop function if exists public.search_catalog_items(text, public.catalog_item_type, uuid, text, integer, integer, boolean);
drop type if exists public.catalog_item_type;

create or replace function public.search_catalog_items(
  p_query text default '',
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
  category_id uuid,
  short_description text,
  keywords text[],
  image_path text,
  active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with filtered as (
    select item.*,
      count(*) over () as total_count
    from public.catalog_items item
    where (p_include_inactive or item.active)
      and (p_category_id is null or item.category_id = p_category_id)
      and (
        nullif(trim(p_query), '') is null
        or item.search_document like '%' || lower(trim(p_query)) || '%'
      )
  )
  select id, name, slug, category_id, short_description, keywords, image_path,
    active, created_at, updated_at, total_count
  from filtered
  order by
    case when p_sort = 'recent' then created_at end desc,
    case when p_sort = 'name-desc' then name end desc,
    case when p_sort <> 'recent' and p_sort <> 'name-desc' then name end asc
  offset greatest(p_offset, 0)
  limit greatest(p_limit, 1);
$$;

revoke execute on function public.search_catalog_items(text, uuid, text, integer, integer, boolean) from public;
grant execute on function public.search_catalog_items(text, uuid, text, integer, integer, boolean) to anon, authenticated;
