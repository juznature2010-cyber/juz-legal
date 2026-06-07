import pg from "pg";
import { readFileSync } from "fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
}

const c = new pg.Client({
  connectionString: `postgresql://postgres.ssnaglboujsbmjnkguhr:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const r = await c.query(`
  select u.email, i.identity_data, i.provider_id,
         u.raw_user_meta_data, left(u.encrypted_password, 10) as pw_prefix
  from auth.users u
  join auth.identities i on i.user_id = u.id
  order by u.created_at desc limit 3
`);
console.log(JSON.stringify(r.rows, null, 2));
await c.end();
