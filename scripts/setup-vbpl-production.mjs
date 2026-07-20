import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "./lib/env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...loadEnvLocal(), ...process.env };

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const OPTIONAL_AI = ["AI_API_KEY", "OPENAI_API_KEY"];

function run(args, input) {
  return spawnSync("npx", ["vercel", ...args], {
    input,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
    cwd: root,
  });
}

function upsertVercel(key, value, target) {
  run(["env", "rm", key, target, "--yes"]);
  const add = run(["env", "add", key, target, "--yes"], `${value.trim()}\n`);
  if (add.status !== 0) {
    throw new Error(`${key} (${target}): ${add.stderr || add.stdout}`);
  }
  console.log(`[OK] ${key} → ${target}`);
}

function ensureLocalEnv(keys) {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) {
    writeFileSync(envPath, "", "utf8");
  }
  const content = readFileSync(envPath, "utf8");
  for (const [key, value] of Object.entries(keys)) {
    if (!value?.trim()) continue;
    if (content.includes(`${key}=`)) continue;
    appendFileSync(envPath, `\n${key}=${value.trim()}\n`, "utf8");
    console.log(`[OK] Da them ${key} vao .env.local`);
  }
}

const missing = REQUIRED.filter((key) => !env[key]?.trim());
const hasAi = OPTIONAL_AI.some((key) => env[key]?.trim());

if (missing.length) {
  console.error("\n[LOI] Thieu bien bat buoc trong .env.local:\n");
  for (const key of missing) {
    console.error(`  - ${key}`);
  }
  console.error("\nLay SUPABASE_SERVICE_ROLE_KEY tu:");
  console.error("  Supabase Dashboard → Settings → API → service_role (secret)\n");
  console.error("Sau do them vao .env.local va chay lai:");
  console.error("  npm run vbpl:setup-production\n");
  process.exit(1);
}

const cronSecret =
  env.CRON_SECRET?.trim() ||
  env.VBPL_SYNC_SECRET?.trim() ||
  randomBytes(32).toString("hex");

console.log("\n=== VBPL Production Setup ===\n");

ensureLocalEnv({
  CRON_SECRET: cronSecret,
  VBPL_SYNC_SECRET: cronSecret,
});

const vbplKeys = {
  SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY,
  CRON_SECRET: cronSecret,
  VBPL_SYNC_SECRET: cronSecret,
  AI_API_KEY: env.AI_API_KEY || env.OPENAI_API_KEY || "",
  AI_MODEL: env.AI_MODEL || "gpt-4o-mini",
  VBPL_REFRESH_DAYS: env.VBPL_REFRESH_DAYS || "7",
  VBPL_AUTO_SYNC_LIMIT: env.VBPL_AUTO_SYNC_LIMIT || "8",
  VBPL_DISCOVERY_LIMIT: env.VBPL_DISCOVERY_LIMIT || "30",
  VBPL_AUTO_ITEM_IDS:
    env.VBPL_AUTO_ITEM_IDS || "149086,149088,149087,142194,23204,170048,23189",
};

for (const target of ["production", "preview"]) {
  console.log(`-- ${target.toUpperCase()} --`);
  for (const [key, value] of Object.entries(vbplKeys)) {
    if (!value?.trim()) {
      console.warn(`[BO QUA] ${key}`);
      continue;
    }
    upsertVercel(key, value, target);
  }
  console.log("");
}

if (!hasAi) {
  console.warn("[CANH BAO] Chua co AI_API_KEY — sync se dung heuristic cho den khi them key.");
}

if (env.SUPABASE_DB_PASSWORD?.trim()) {
  console.log("Dang chay legal-documents.sql...");
  const schema = spawnSync("npm", ["run", "supabase:legal-schema"], {
    shell: true,
    stdio: "inherit",
    cwd: root,
    env: process.env,
  });
  if (schema.status !== 0) {
    console.warn("[CANH BAO] legal-schema that bai — co the da chay truoc do.");
  }
} else {
  console.warn(
    "[CANH BAO] Thieu SUPABASE_DB_PASSWORD — bo qua schema. Chay thu cong: npm run supabase:legal-schema"
  );
}

console.log("Seed hang doi vbpl...");
spawnSync("node", ["scripts/seed-vbpl-queue.mjs"], {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, ...env, CRON_SECRET: cronSecret, VBPL_SYNC_SECRET: cronSecret },
});

const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.juzlegal.com";
console.log(`\nGoi auto sync production: ${siteUrl}/api/cron/vbpl-sync`);

const syncRes = await fetch(`${siteUrl}/api/cron/vbpl-sync`, {
  method: "POST",
  headers: { Authorization: `Bearer ${cronSecret}` },
});

const payload = await syncRes.json().catch(() => ({}));
if (syncRes.ok) {
  console.log("[OK] Auto sync:", JSON.stringify(payload, null, 2));
} else {
  console.warn("[CANH BAO] Auto sync chua chay duoc (co the can redeploy Vercel truoc):");
  console.warn(JSON.stringify(payload, null, 2));
  console.warn("\nSau khi deploy xong, chay: npm run vbpl:sync");
}

console.log("\n[DONE] VBPL auto sync da cau hinh.\n");
