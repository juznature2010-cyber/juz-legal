import { loadEnvLocal } from "./lib/env.mjs";

const env = { ...loadEnvLocal(), ...process.env };

const DEFAULT_VBPL_ITEMS = [
  "149086",
  "149088",
  "149087",
  "142194",
  "23204",
  "170048",
  "23189",
];

const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const cronSecret = env.VBPL_SYNC_SECRET?.trim() || env.CRON_SECRET?.trim();
const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.juzlegal.com";

const cliIds = process.argv.slice(2).filter((value) => /^\d+$/.test(value));

if (cliIds.length) {
  console.log("Seed queue voi ItemID:", cliIds.join(", "));
  await seedQueue(cliIds);
  process.exit(0);
}

if (cronSecret && env.AUTO_RUN !== "0") {
  console.log("Goi auto sync cron:", `${siteUrl}/api/cron/vbpl-sync`);
  const response = await fetch(`${siteUrl}/api/cron/vbpl-sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cronSecret}` },
  });
  const payload = await response.json();
  console.log(JSON.stringify(payload, null, 2));
  process.exit(response.ok ? 0 : 1);
}

console.log("VBPL Auto Sync CLI");
console.log("1) Seed hang doi mac dinh:");
console.log("   npm run vbpl:seed-queue");
console.log("2) Chay auto sync ngay (can VBPL_SYNC_SECRET + site dang live):");
console.log("   npm run vbpl:sync");
console.log("3) Vercel Cron tu dong (vercel.json): 01:00, 07:00, 13:00, 19:00 UTC");

if (!url || !key) {
  console.warn("[CANH BAO] Thieu Supabase env — chi huong dan, khong seed.");
  process.exit(0);
}

await seedQueue(DEFAULT_VBPL_ITEMS);

async function seedQueue(itemIds) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = itemIds.map((itemId) => ({
    vbpl_item_id: itemId,
    source_url: `https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=${itemId}`,
    status: "pending",
    scheduled_at: new Date().toISOString(),
    last_error: null,
  }));

  const { error } = await supabase.from("vbpl_sync_queue").upsert(rows, {
    onConflict: "vbpl_item_id",
  });

  if (error) {
    console.error("[LOI]", error.message);
    process.exit(1);
  }

  console.log(`[OK] Da them ${rows.length} ItemID vao vbpl_sync_queue`);
}
