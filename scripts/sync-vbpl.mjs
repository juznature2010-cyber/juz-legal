import { loadEnvLocal } from "./lib/env.mjs";

const env = { ...loadEnvLocal(), ...process.env };
const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:5173";
const secret = env.VBPL_SYNC_SECRET?.trim();
const cronSecret = secret || env.ADMIN_SYNC_TOKEN?.trim();

async function callCronApi() {
  const response = await fetch(`${siteUrl}/api/cron/vbpl-sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });
  return response.json();
}

console.log("VBPL sync CLI");
console.log("- Neu dev server dang chay: goi /api/admin/vbpl/sync (can dang nhap admin trong browser truoc)");
console.log("- Production/cron: dat VBPL_SYNC_SECRET va goi /api/cron/vbpl-sync");
console.log("");
console.log("Buoc 1: npm run vbpl:seed-queue");
console.log("Buoc 2: Vao /admin/thu-vien-phap-luat → Chay dong bo AI");
console.log("Hoac: POST /api/cron/vbpl-sync voi header Authorization: Bearer <VBPL_SYNC_SECRET>");

if (cronSecret && env.NEXT_PUBLIC_SITE_URL) {
  try {
    const result = await callCronApi();
    console.log("[CRON]", JSON.stringify(result, null, 2));
  } catch (error) {
    console.warn("[CRON] Khong goi duoc:", error.message);
  }
} else {
  console.log("[INFO] Chua cau hinh VBPL_SYNC_SECRET — bo qua cron auto-run");
}
