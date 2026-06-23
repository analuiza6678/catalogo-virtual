create extension if not exists "uuid-ossp";

create table public.stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  banner_url text,
  description text not null default '',
  whatsapp_number text not null,
  whatsapp_default_message text,
  primary_color text not null default '#047857',
  address text,
  business_hours text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug),
  unique(id, store_id)
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid,
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
  stock integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(store_id, slug),
  foreign key (category_id, store_id) references public.categories(id, store_id) on delete set null (category_id)
);

create table public.product_events (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references public.stores(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'whatsapp_click', 'share')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stores_updated_at before update on public.stores
for each row execute function public.set_updated_at();

create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.create_owner_store()
returns trigger
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.stores) then
    raise exception 'Esta loja ja possui um proprietario.';
  end if;

  insert into public.stores (
    owner_id,
    name,
    slug,
    description,
    whatsapp_number,
    whatsapp_default_message,
    primary_color
  ) values (
    new.id,
    'Maison Catalogo',
    'maison-catalogo',
    'Curadoria feminina premium com atendimento humano pelo WhatsApp.',
    '5599999999999',
    'Ola! Tenho interesse no produto {product}. Preco: {price}. Link: {link}. Pode me passar mais informacoes?',
    '#C8A96A'
  );

  return new;
end;
$$ language plpgsql;

drop trigger if exists create_owner_store_after_signup on auth.users;
create trigger create_owner_store_after_signup
after insert on auth.users
for each row execute function public.create_owner_store();

alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_events enable row level security;

create policy "Public stores are readable" on public.stores
for select using (true);

create policy "Owners manage their stores" on public.stores
for all using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Public categories are readable" on public.categories
for select using (true);

create policy "Owners manage their categories" on public.categories
for all using (
  exists (select 1 from public.stores s where s.id = categories.store_id and s.owner_id = auth.uid())
)
with check (
  exists (select 1 from public.stores s where s.id = categories.store_id and s.owner_id = auth.uid())
);

create policy "Public products are readable" on public.products
for select using (true);

create policy "Owners manage their products" on public.products
for all using (
  exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = auth.uid())
)
with check (
  exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = auth.uid())
);

create policy "Owners read product events" on public.product_events
for select using (
  exists (select 1 from public.stores s where s.id = product_events.store_id and s.owner_id = auth.uid())
);

create policy "Anyone inserts product events" on public.product_events
for insert with check (true);

insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'catalog-images';

create policy "Public catalog images" on storage.objects
for select using (bucket_id = 'catalog-images');

create policy "Owners upload catalog images" on storage.objects
for insert with check (
  bucket_id = 'catalog-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Owners update catalog images" on storage.objects
for update using (
  bucket_id = 'catalog-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'catalog-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Owners delete catalog images" on storage.objects
for delete using (
  bucket_id = 'catalog-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
