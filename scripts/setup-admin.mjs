import { requireEnv, withPg } from "./lib/env.mjs";

const env = requireEnv([
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_DB_PASSWORD",
  "ADMIN_EMAIL",
]);

const url = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = env.ADMIN_EMAIL.toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD ?? env.ADMIN_PASSWORD;

if (!adminPassword) {
  console.error("[LOI] Thieu ADMIN_PASSWORD (dat tam trong .env.local hoac bien moi truong)");
  console.error("     Vi du: ADMIN_PASSWORD=MatKhauManh123!");
  process.exit(1);
}

async function auth(path, body) {
  const res = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

const recreate = process.env.RECREATE_ADMIN === "1" || process.argv.includes("--recreate");

console.log("\n=== Tao / cap nhat tai khoan admin ===\n");

if (recreate) {
  console.log("Xoa tai khoan admin cu (neu co)...");
  await withPg(env.SUPABASE_DB_PASSWORD, async (client) => {
    const { rowCount } = await client.query(
      "delete from auth.users where lower(email) = $1",
      [adminEmail]
    );
    console.log(rowCount ? "[OK] Da xoa admin cu" : "[OK] Khong co admin cu");
  });
}

const signup = await auth("signup", {
  email: adminEmail,
  password: adminPassword,
  data: { full_name: "Quản trị viên" },
});

let userId = signup.data.user?.id ?? signup.data.id;

if (!signup.ok && !signup.data.access_token) {
  const login = await auth("token?grant_type=password", {
    email: adminEmail,
    password: adminPassword,
  });
  if (!login.ok) {
    console.error("[LOI] Khong tao/dang nhap admin:", signup.data);
    process.exit(1);
  }
  userId = login.data.user?.id;
  console.log("[OK] Admin da ton tai, cap nhat role...");
} else {
  console.log("[OK] Tao admin moi thanh cong");
}

if (userId) {
  await withPg(env.SUPABASE_DB_PASSWORD, async (client) => {
    await client.query(
      `update public.profiles
       set role = 'admin', full_name = 'Quản trị viên', updated_at = now()
       where id = $1`,
      [userId]
    );
  });
}

const verify = await auth("token?grant_type=password", {
  email: adminEmail,
  password: adminPassword,
});

if (verify.ok) {
  console.log(`[OK] Admin san sang: ${adminEmail}`);
  if (recreate) {
    console.log(`[MAT KHAU MOI] ${adminPassword}`);
    console.log("     Luu mat khau nay — chi hien mot lan.");
  }
} else {
  console.error("[LOI] Xac minh dang nhap that bai:", verify.data);
  process.exit(1);
}

console.log("\n[DONE]\n");
