import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("[LOI] Khong tim thay .env.local");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const env = loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n=== Kiem tra Supabase — JUZ Legal ===\n");

if (!url || !url.includes("supabase.co")) {
  console.error("[LOI] NEXT_PUBLIC_SUPABASE_URL chua dung");
  process.exit(1);
}
console.log("[OK] URL:", url);

if (!key || key.includes("THAY_BANG") || key.includes("your-anon")) {
  console.error("[LOI] NEXT_PUBLIC_SUPABASE_ANON_KEY chua duoc dien");
  console.error("     Lay tu: Supabase Dashboard -> Settings -> API -> anon public");
  process.exit(1);
}

try {
  const res = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (res.ok) {
    console.log("[OK] Ket noi Supabase Auth thanh cong");
  } else {
    console.warn("[CANH BAO] Auth health:", res.status, await res.text());
  }
} catch (e) {
  console.error("[LOI] Khong ket noi duoc:", e.message);
  process.exit(1);
}

const tables = ["profiles", "contact_messages", "bookings"];
for (const table of tables) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });
    if (res.status === 404 || res.status === 406) {
      console.warn(`[CANH BAO] Bang "${table}" chua co — chay supabase/schema.sql trong SQL Editor`);
    } else if (res.ok) {
      console.log(`[OK] Bang "${table}" san sang`);
    } else {
      console.warn(`[CANH BAO] Bang "${table}":`, res.status);
    }
  } catch {
    console.warn(`[CANH BAO] Khong kiem tra duoc bang "${table}"`);
  }
}

console.log("\n[DONE] Kiem tra hoan tat. Chay: npm run dev\n");
