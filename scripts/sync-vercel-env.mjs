import { spawnSync } from "child_process";
import { loadEnvLocal } from "./lib/env.mjs";

const env = loadEnvLocal();
const siteUrlProduction = "https://www.juzlegal.com";

const sharedKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "ADMIN_EMAIL",
  "BOOKING_NOTIFY_EMAIL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "NEXT_PUBLIC_GA_ID",
];

const targets = {
  production: {
    NEXT_PUBLIC_SITE_URL: siteUrlProduction,
    includeAdminPublic: true,
  },
  preview: {
    NEXT_PUBLIC_SITE_URL: siteUrlProduction,
    includeAdminPublic: true,
  },
  development: {
    NEXT_PUBLIC_SITE_URL: "http://localhost:5173",
    includeAdminPublic: false,
  },
};

function run(args, input) {
  return spawnSync("npx", ["vercel", ...args], {
    input,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function upsert(key, value, target) {
  if (!value?.trim()) {
    console.error(`[LOI] Thieu ${key} trong .env.local`);
    process.exit(1);
  }
  run(["env", "rm", key, target, "--yes"]);
  const add = run(["env", "add", key, target, "--yes"], `${value.trim()}\n`);
  if (add.status !== 0) {
    console.error(`[LOI] ${key} (${target}):`, add.stderr || add.stdout);
    process.exit(1);
  }
  console.log(`[OK] ${key} → ${target}`);
}

console.log("\n=== Dong bo bien moi truong len Vercel ===\n");

for (const [target, config] of Object.entries(targets)) {
  console.log(`-- ${target.toUpperCase()} --`);
  for (const key of sharedKeys) {
    upsert(key, env[key], target);
  }
  if (config.includeAdminPublic) {
    upsert(
      "NEXT_PUBLIC_ADMIN_EMAIL",
      env.NEXT_PUBLIC_ADMIN_EMAIL || env.ADMIN_EMAIL,
      target
    );
  }
  upsert("NEXT_PUBLIC_SITE_URL", config.NEXT_PUBLIC_SITE_URL, target);
  console.log("");
}

console.log("[DONE] Kiem tra: npx vercel env ls preview\n");
