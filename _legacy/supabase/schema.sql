-- ---------- DATABASE SCHEMA MASTER ----------

-- Houses
create table if not exists houses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamp default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references houses(id),
  name text not null
);

-- Subcategories
create table if not exists subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null
);

-- Items
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid references subcategories(id),
  name text not null,
  severity int default 1,
  mandatory_note boolean default false
);

-- Reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references houses(id),
  inspector_id uuid,
  created_at timestamp default now(),
  status text default 'open'
);
