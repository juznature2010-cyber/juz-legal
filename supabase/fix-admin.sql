-- Sửa admin user + identity (để đăng nhập được)
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
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_super_admin
    ) values (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"admin","full_name":"Quản trị viên"}'::jsonb,
      now(),
      now(),
      false
    );
  else
    update auth.users
    set
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin","full_name":"Quản trị viên"}'::jsonb,
      updated_at = now()
    where id = admin_id;
  end if;

  delete from auth.identities where user_id = admin_id and provider = 'email';

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    admin_id,
    jsonb_build_object('sub', admin_id::text, 'email', admin_email),
    'email',
    admin_id::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, full_name, role)
  values (admin_id, 'Quản trị viên', 'admin')
  on conflict (id) do update set full_name = excluded.full_name, role = 'admin', updated_at = now();
end;
$$;
