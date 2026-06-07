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
const hosts = [
  {
    label: "pooler-session-ap-southeast-1-aws1",
    connectionString: `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "pooler-tx-ap-southeast-1-aws1",
    connectionString: `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  },
  {
    label: "direct-5432",
    connectionString: `postgresql://postgres:${encoded}@db.${projectRef}.supabase.co:5432/postgres`,
  },
];

const sql = readFileSync(join(root, "supabase", "schema.sql"), "utf8");

async function run() {
  let lastError;
  for (const { label, connectionString } of hosts) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      console.log(`Dang ket noi (${label})...`);
      await client.connect();
      console.log("[OK] Ket noi thanh cong");
      console.log("Dang chay schema.sql...");
      await client.query(sql);
      console.log("[OK] schema.sql da chay xong");
      await client.end();
      return;
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
      console.warn("[THU LAI] Ket noi that bai:", err.message);
    }
  }
  console.error("[LOI]", lastError?.message ?? "Khong ket noi duoc database");
  process.exit(1);
}

run();
