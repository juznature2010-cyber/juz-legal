import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function loadEnvLocal() {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

export function requireEnv(keys) {
  const env = { ...loadEnvLocal(), ...process.env };
  const missing = keys.filter((k) => !env[k]?.trim());
  if (missing.length) {
    console.error(`[LOI] Thieu bien moi truong: ${missing.join(", ")}`);
    console.error("     Kiem tra file .env.local");
    process.exit(1);
  }
  return env;
}

export function getProjectRef(env = { ...loadEnvLocal(), ...process.env }) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match?.[1] ?? null;
}

export function getDbConnectionStrings(password, projectRef = getProjectRef()) {
  if (!projectRef) {
    throw new Error(
      "Khong xac dinh duoc project ref. Kiem tra NEXT_PUBLIC_SUPABASE_URL."
    );
  }
  const encoded = encodeURIComponent(password);
  return [
    {
      label: "pooler-session-ap-southeast-1",
      connectionString: `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    },
    {
      label: "pooler-tx-ap-southeast-1",
      connectionString: `postgresql://postgres.${projectRef}:${encoded}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    },
    {
      label: "direct",
      connectionString: `postgresql://postgres:${encoded}@db.${projectRef}.supabase.co:5432/postgres`,
    },
  ];
}

export async function withPg(password, fn) {
  const pg = await import("pg");
  let lastError;
  for (const { label, connectionString } of getDbConnectionStrings(password)) {
    const client = new pg.default.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      await client.connect();
      const result = await fn(client, label);
      await client.end();
      return result;
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
      console.warn(`[THU LAI] ${label}:`, err.message);
    }
  }
  throw lastError ?? new Error("Khong ket noi duoc database");
}
