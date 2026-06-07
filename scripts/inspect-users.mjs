import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "ssnaglboujsbmjnkguhr";
const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
}
const encoded = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
const client = new pg.Client({
  connectionString: `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const users = await client.query(`
  select id, email, email_confirmed_at is not null as confirmed,
         raw_app_meta_data, raw_user_meta_data
  from auth.users order by created_at desc limit 5
`);
console.log("USERS:", JSON.stringify(users.rows, null, 2));

const identities = await client.query(`
  select user_id, provider, provider_id from auth.identities limit 5
`);
console.log("IDENTITIES:", JSON.stringify(identities.rows, null, 2));

await client.end();
