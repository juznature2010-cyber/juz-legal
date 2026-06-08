import { loadEnvLocal } from "./lib/env.mjs";

const env = loadEnvLocal();

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "ADMIN_EMAIL",
  "NEXT_PUBLIC_ADMIN_EMAIL",
];

console.log("\n=== Bien moi truong can them tren Vercel ===\n");
console.log("Vercel → Project juz-legal → Settings → Environment Variables\n");

for (const key of required) {
  const value = env[key];
  if (!value) {
    console.log(`[THIEU] ${key}`);
    continue;
  }
  if (key.includes("KEY")) {
    console.log(`${key}=${value.slice(0, 8)}... (${value.length} ky tu)`);
  } else if (key === "NEXT_PUBLIC_SITE_URL") {
    console.log(`${key}=https://www.juzlegal.com  (Production)`);
    console.log(`${key}=http://localhost:5173     (Preview/Development — tuy chon)`);
  } else {
    console.log(`${key}=${value}`);
  }
}

console.log("\nNEXT_PUBLIC_GA_ID=G-NX6GE58D37  (tuy chon)\n");
console.log("Sau khi them → Deployments → Redeploy\n");
console.log("=== Supabase Auth URL Configuration ===\n");
console.log("Site URL:        https://www.juzlegal.com");
console.log("Redirect URLs:   https://www.juzlegal.com/*");
console.log("                 http://localhost:5173/*\n");
