-- ============================================================
-- JUZ LEGAL — Production patch (chạy trên DB đã có sẵn)
-- Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Profile mới luôn là user (không đọc role từ metadata đăng ký)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    'user'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();

  return new;
end;
$$;

-- 2. User không thể tự đổi role thành admin
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    public.is_admin()
    or role = (
      select p.role from public.profiles p where p.id = auth.uid()
    )
  );

-- 3. Đảm bảo admin@juzlegal.vn có quyền admin
update public.profiles
set
  role = 'admin',
  full_name = coalesce(full_name, 'Quản trị viên'),
  updated_at = now()
where id in (
  select id from auth.users where lower(email) = 'admin@juzlegal.vn'
);
