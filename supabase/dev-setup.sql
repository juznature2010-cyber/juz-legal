-- DEV: Tự xác nhận email khi đăng ký (test chạy luôn, không cần mở mail)
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end;
$$;

drop trigger if exists auto_confirm_user_trigger on auth.users;
create trigger auto_confirm_user_trigger
  before insert on auth.users
  for each row
  execute function public.auto_confirm_user();

-- Tạo / cập nhật admin (đổi mật khẩu tại đây nếu cần)
create extension if not exists pgcrypto;

do $$
declare
  admin_id uuid;
  admin_email text := 'admin@juzlegal.vn';
  admin_password text := 'Huyen12345@123';
begin
  select id into admin_id from auth.users where email = admin_email;

  if admin_id is null then
    admin_id := gen_random_uuid();
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"role":"admin","full_name":"Quản trị viên"}'::jsonb,
      now(),
      now()
    );
  else
    update auth.users
    set
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin","full_name":"Quản trị viên"}'::jsonb,
      updated_at = now()
    where id = admin_id;
  end if;

  insert into public.profiles (id, full_name, phone, role)
  values (admin_id, 'Quản trị viên', null, 'admin')
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = 'admin',
    updated_at = now();
end;
$$;
