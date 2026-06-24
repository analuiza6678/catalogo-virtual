begin;

create extension if not exists "uuid-ossp";

create table if not exists public.stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  logo_url text,
  banner_url text,
  description text not null default '',
  whatsapp_number text not null,
  whatsapp_default_message text,
  primary_color text not null default '#31523F',
  address text,
  business_hours text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug)
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  short_description text not null default '',
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  compare_price numeric(12,2) check (compare_price is null or compare_price >= 0),
  image_url text not null,
  gallery_urls text[] not null default '{}',
  sku text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_promotion boolean not null default false,
  is_new boolean not null default false,
  material text,
  color text,
  size text,
  notes text,
  tags text[] not null default '{}',
  whatsapp_message text,
  stock integer check (stock is null or stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug)
);

create table if not exists public.product_events (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references public.stores(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'whatsapp_click', 'share')),
  created_at timestamptz not null default now()
);

create unique index if not exists stores_owner_id_key on public.stores(owner_id);
create unique index if not exists stores_slug_key on public.stores(slug);
create unique index if not exists categories_store_slug_key on public.categories(store_id, slug);
create unique index if not exists products_store_slug_key on public.products(store_id, slug);
create index if not exists categories_store_id_idx on public.categories(store_id);
create index if not exists products_store_id_idx on public.products(store_id);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_store_created_at_idx on public.products(store_id, created_at desc);
create index if not exists product_events_store_id_idx on public.product_events(store_id);
create index if not exists product_events_product_id_idx on public.product_events(product_id);

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

drop trigger if exists stores_updated_at on public.stores;
create trigger stores_updated_at before update on public.stores
for each row execute function public.set_updated_at();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.create_owner_store()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_store_id uuid;
begin
  perform pg_advisory_xact_lock(7302026);

  if exists (select 1 from public.stores) then
    return new;
  end if;

  insert into public.stores (
    owner_id, name, slug, description, whatsapp_number,
    whatsapp_default_message, primary_color
  ) values (
    new.id,
    'Maison Catalogo',
    'maison-catalogo',
    'Curadoria feminina premium com atendimento humano pelo WhatsApp.',
    '5599999999999',
    'Ola! Tenho interesse no produto {product}. Preco: {price}. Link: {link}. Pode me passar mais informacoes?',
    '#31523F'
  ) returning id into new_store_id;

  insert into public.categories (store_id, name, slug)
  values
    (new_store_id, 'Bolsas', 'bolsas'),
    (new_store_id, 'Colares', 'colares'),
    (new_store_id, 'Brincos', 'brincos'),
    (new_store_id, 'Pulseiras', 'pulseiras'),
    (new_store_id, 'Aneis', 'aneis'),
    (new_store_id, 'Oculos', 'oculos'),
    (new_store_id, 'Relogios', 'relogios'),
    (new_store_id, 'Kits', 'kits'),
    (new_store_id, 'Presentes', 'presentes')
  on conflict (store_id, slug) do nothing;

  return new;
end;
$$;

drop trigger if exists create_owner_store_after_signup on auth.users;
create trigger create_owner_store_after_signup
after insert on auth.users
for each row execute function public.create_owner_store();

alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_events enable row level security;

drop policy if exists "Public stores are readable" on public.stores;
create policy "Public stores are readable" on public.stores
for select to anon, authenticated using (true);

drop policy if exists "Owners manage their stores" on public.stores;
create policy "Owners manage their stores" on public.stores
for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Public categories are readable" on public.categories;
create policy "Public categories are readable" on public.categories
for select to anon, authenticated using (true);

drop policy if exists "Owners manage their categories" on public.categories;
create policy "Owners manage their categories" on public.categories
for all to authenticated
using (exists (
  select 1 from public.stores s
  where s.id = categories.store_id and s.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.stores s
  where s.id = categories.store_id and s.owner_id = (select auth.uid())
));

drop policy if exists "Public products are readable" on public.products;
create policy "Public products are readable" on public.products
for select to anon, authenticated using (true);

drop policy if exists "Owners manage their products" on public.products;
create policy "Owners manage their products" on public.products
for all to authenticated
using (exists (
  select 1 from public.stores s
  where s.id = products.store_id and s.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.stores s
  where s.id = products.store_id and s.owner_id = (select auth.uid())
));

drop policy if exists "Owners read product events" on public.product_events;
create policy "Owners read product events" on public.product_events
for select to authenticated
using (exists (
  select 1 from public.stores s
  where s.id = product_events.store_id and s.owner_id = (select auth.uid())
));

drop policy if exists "Anyone inserts product events" on public.product_events;
create policy "Anyone inserts product events" on public.product_events
for insert to anon, authenticated with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-images', 'catalog-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public catalog images" on storage.objects;
create policy "Public catalog images" on storage.objects
for select to anon, authenticated
using (bucket_id = 'catalog-images');

drop policy if exists "Owners upload catalog images" on storage.objects;
create policy "Owners upload catalog images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'catalog-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Owners update catalog images" on storage.objects;
create policy "Owners update catalog images" on storage.objects
for update to authenticated
using (
  bucket_id = 'catalog-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'catalog-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Owners delete catalog images" on storage.objects;
create policy "Owners delete catalog images" on storage.objects
for delete to authenticated
using (
  bucket_id = 'catalog-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

commit;
