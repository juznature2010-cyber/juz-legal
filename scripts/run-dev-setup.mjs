import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "ssnaglboujsbmjnkguhr";

function loadEnvLocal() {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const password =
  process.env.SUPABASE_DB_PASSWORD ?? loadEnvLocal().SUPABASE_DB_PASSWORD;

if (!password) {
  console.error("[LOI] Thieu SUPABASE_DB_PASSWORD trong .env.local");
  process.exit(1);
}

const encoded = encodeURIComponent(password);
const connectionString = `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`;
const sql = readFileSync(join(root, "supabase", "dev-setup.sql"), "utf8");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

try {
  console.log("Dang setup dev auth (auto-confirm + admin)...");
  await client.connect();
  await client.query(sql);
  console.log("[OK] Dev setup xong");
  console.log("  Admin: admin@juzlegal.vn");
  console.log("  Mat khau: (xem supabase/dev-setup.sql)");
} catch (err) {
  console.error("[LOI]", err.message);
  process.exit(1);
} finally {
  await client.end();
}
