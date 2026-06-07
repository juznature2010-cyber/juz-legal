import pg from "pg";
import { readFileSync } from "fs";

const url = "https://ssnaglboujsbmjnkguhr.supabase.co";
const key = "sb_publishable_xdul51MMNOIXKTPNVGyDqQ_vTrA0ClT";
const adminEmail = "admin@juzlegal.vn";
const adminPassword = "Huyen12345@123";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
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

async function dbQuery(text, params) {
  const client = new pg.Client({
    connectionString: `postgresql://postgres.ssnaglboujsbmjnkguhr:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const result = await client.query(text, params);
  await client.end();
  return result;
}

console.log("Xoa admin cu (neu co)...");
await dbQuery("delete from auth.users where email = $1", [adminEmail]);

console.log("Tao admin moi qua Supabase Auth API...");
const signup = await auth("signup", {
  email: adminEmail,
  password: adminPassword,
  data: { full_name: "Quản trị viên", role: "admin" },
});

if (!signup.ok && !signup.data.access_token) {
  console.error("[LOI] Signup admin:", signup.data);
  process.exit(1);
}

const userId = signup.data.user?.id ?? signup.data.id;
if (userId) {
  await dbQuery(
    "update public.profiles set role = 'admin', full_name = 'Quản trị viên' where id = $1",
    [userId]
  );
}

const login = await auth("token?grant_type=password", {
  email: adminEmail,
  password: adminPassword,
});

if (login.ok) {
  console.log("[OK] Admin san sang: admin@juzlegal.vn");
} else {
  console.error("[LOI] Login admin:", login.data);
  process.exit(1);
}
