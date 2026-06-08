import { spawnSync } from "child_process";
import { loadEnvLocal } from "./lib/env.mjs";

const env = loadEnvLocal();

const vars = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ADMIN_EMAIL: env.ADMIN_EMAIL,
  NEXT_PUBLIC_ADMIN_EMAIL: env.NEXT_PUBLIC_ADMIN_EMAIL,
};

const siteUrlProduction = "https://www.juzlegal.com";
const targets = ["production", "preview", "development"];

function run(args, input) {
  const result = spawnSync("npx", ["vercel", ...args], {
    input,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
  return result;
}

console.log("\n=== Dong bo bien moi truong len Vercel ===\n");

for (const target of targets) {
  for (const [key, value] of Object.entries(vars)) {
    if (!value?.trim()) {
      console.error(`[LOI] Thieu ${key} trong .env.local`);
      process.exit(1);
    }
    run(["env", "rm", key, target, "--yes"]);
    const add = run(["env", "add", key, target, "--yes"], `${value}\n`);
    if (add.status !== 0) {
      console.error(`[LOI] ${key} (${target}):`, add.stderr || add.stdout);
      process.exit(1);
    }
    console.log(`[OK] ${key} → ${target}`);
  }

  const siteUrl = target === "production" ? siteUrlProduction : "http://localhost:5173";
  run(["env", "rm", "NEXT_PUBLIC_SITE_URL", target, "--yes"]);
  const site = run(["env", "add", "NEXT_PUBLIC_SITE_URL", target, "--yes"], `${siteUrl}\n`);
  if (site.status !== 0) {
    console.error(`[LOI] NEXT_PUBLIC_SITE_URL (${target}):`, site.stderr || site.stdout);
    process.exit(1);
  }
  console.log(`[OK] NEXT_PUBLIC_SITE_URL=${siteUrl} → ${target}`);
}

console.log("\n[DONE] Chay: npx vercel --prod --yes\n");
