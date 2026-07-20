import { loadEnvLocal } from "./lib/env.mjs";

const env = loadEnvLocal();

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "ADMIN_EMAIL",
  "BOOKING_NOTIFY_EMAIL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
];

console.log("\n=== Bien moi truong can co tren Vercel ===\n");
console.log("Production + Preview (bat buoc cho form/auth/email):\n");

for (const key of required) {
  const value = env[key];
  if (!value) {
    console.log(`[THIEU] ${key}`);
    continue;
  }
  if (key.includes("KEY") || key.includes("SECRET") || key.includes("TOKEN")) {
    console.log(`${key}=${value.slice(0, 8)}... (${value.length} ky tu)`);
  } else {
    console.log(`${key}=${value}`);
  }
}

console.log("\nNEXT_PUBLIC_SITE_URL=https://www.juzlegal.com");
console.log("NEXT_PUBLIC_GA_ID=G-NX6GE58D37  (tuy chon)");
console.log("\nDong bo Preview tu production:");
console.log("  npm run vercel:sync-preview");
console.log("\nDong bo day du tu .env.local:");
console.log("  npm run vercel:sync-env\n");
