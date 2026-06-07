-- ============================================================
-- JUZ LEGAL — Supabase Schema
-- Chạy toàn bộ file trong: Supabase Dashboard → SQL Editor → Run
-- Project: https://ssnaglboujsbmjnkguhr.supabase.co
-- ============================================================

-- 1. PROFILES (mở rộng auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. LIÊN HỆ từ form website
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  service_label text,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

-- 3. ĐẶT LỊCH tư vấn
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  service_slug text not null,
  lawyer_slug text,
  booking_date date not null,
  booking_time time not null,
  mode text not null check (mode in ('online', 'office')),
  client_name text not null,
  client_phone text not null,
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'done')),
  created_at timestamptz not null default now()
);

-- 4. Hàm kiểm tra admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 5. Tự tạo profile khi đăng ký
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'user');

  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    user_role
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. RLS — PROFILES
alter table public.profiles enable row level security;

drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 7. RLS — CONTACT MESSAGES
alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact" on public.contact_messages;
create policy "Anyone can submit contact"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Users view own contacts" on public.contact_messages;
create policy "Users view own contacts"
  on public.contact_messages for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admin update contacts" on public.contact_messages;
create policy "Admin update contacts"
  on public.contact_messages for update
  using (public.is_admin());

-- 8. RLS — BOOKINGS
alter table public.bookings enable row level security;

drop policy if exists "Anyone can create booking" on public.bookings;
create policy "Anyone can create booking"
  on public.bookings for insert
  with check (true);

drop policy if exists "Users view own bookings" on public.bookings;
create policy "Users view own bookings"
  on public.bookings for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admin update bookings" on public.bookings;
create policy "Admin update bookings"
  on public.bookings for update
  using (public.is_admin());

-- 9. Index
create index if not exists idx_contact_messages_created on public.contact_messages (created_at desc);
create index if not exists idx_bookings_created on public.bookings (created_at desc);
create index if not exists idx_bookings_user on public.bookings (user_id);
