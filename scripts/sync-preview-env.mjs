import { spawnSync } from "child_process";
import { extractPublicEnv } from "./extract-public-env.mjs";
import { loadEnvLocal } from "./lib/env.mjs";

const productionSite = "https://www.juzlegal.com";
const localEnv = loadEnvLocal();

function run(args, input) {
  return spawnSync("npx", ["vercel", ...args], {
    input,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function upsertEnv(key, value, target) {
  if (!value?.trim()) {
    console.warn(`[BO QUA] ${key} (${target}) — khong co gia tri`);
    return false;
  }
  run(["env", "rm", key, target, "--yes"]);
  const add = run(["env", "add", key, target, "--yes"], `${value.trim()}\n`);
  if (add.status !== 0) {
    console.error(`[LOI] ${key} (${target}):`, add.stderr || add.stdout);
    return false;
  }
  console.log(`[OK] ${key} → ${target}`);
  return true;
}

console.log("\n=== Dong bo bien Preview tu Production ===\n");

const extracted = await extractPublicEnv(productionSite);
const previewVars = {
  NEXT_PUBLIC_SUPABASE_URL:
    localEnv.NEXT_PUBLIC_SUPABASE_URL || extracted.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    localEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    extracted.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: productionSite,
  ADMIN_EMAIL: localEnv.ADMIN_EMAIL || extracted.ADMIN_EMAIL,
  NEXT_PUBLIC_ADMIN_EMAIL:
    localEnv.NEXT_PUBLIC_ADMIN_EMAIL || extracted.NEXT_PUBLIC_ADMIN_EMAIL,
  BOOKING_NOTIFY_EMAIL: localEnv.BOOKING_NOTIFY_EMAIL,
  RESEND_API_KEY: localEnv.RESEND_API_KEY,
  EMAIL_FROM: localEnv.EMAIL_FROM,
  NEXT_PUBLIC_GA_ID: localEnv.NEXT_PUBLIC_GA_ID || "G-NX6GE58D37",
};

let ok = 0;
for (const [key, value] of Object.entries(previewVars)) {
  if (upsertEnv(key, value, "preview")) ok += 1;
}

console.log(`\n[DONE] Da cap nhat ${ok} bien cho Preview.`);
console.log("Neu thieu RESEND/EMAIL_FROM, them vao .env.local va chay lai script.\n");
