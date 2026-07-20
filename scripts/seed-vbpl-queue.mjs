import { loadEnvLocal } from "./lib/env.mjs";

const env = { ...loadEnvLocal(), ...process.env };

const DEFAULT_VBPL_ITEMS = [
  "149086", // Luật Doanh nghiệp
  "149088", // NĐ 01/2021
  "149087", // Luật Đầu tư
  "142194", // BLLĐ 2019
  "23204", // Luật SHTT
  "170048", // Luật Đất đai 2024
  "23189", // Luật Thương mại
];

const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error("[LOI] Can NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const itemIds = process.argv.slice(2).filter((value) => /^\d+$/.test(value));
const targets = itemIds.length ? itemIds : DEFAULT_VBPL_ITEMS;

const rows = targets.map((itemId) => ({
  vbpl_item_id: itemId,
  source_url: `https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=${itemId}`,
  status: "pending",
  scheduled_at: new Date().toISOString(),
}));

const { error } = await supabase.from("vbpl_sync_queue").upsert(rows, {
  onConflict: "vbpl_item_id",
});

if (error) {
  console.error("[LOI]", error.message);
  process.exit(1);
}

console.log(`[OK] Da them ${rows.length} ItemID vao vbpl_sync_queue`);
