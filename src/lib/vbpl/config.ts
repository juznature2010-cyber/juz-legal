/** ItemID mặc định — văn bản trọng yếu JUZ Legal theo dõi */
export const DEFAULT_VBPL_ITEM_IDS = [
  "149086", // Luật Doanh nghiệp
  "149088", // NĐ 01/2021
  "149087", // Luật Đầu tư
  "142194", // BLLĐ 2019
  "23204", // Luật SHTT
  "170048", // Luật Đất đai 2024
  "23189", // Luật Thương mại
] as const;

/** Trang vbpl.vn dùng để tự phát hiện văn bản mới */
export const VBPL_DISCOVERY_URLS = [
  "https://vbpl.vn/",
  "https://vbpl.vn/VBQPPL/Pages/vbpq-vanbanmoi.aspx",
  "https://vbpl.vn/VBQPPL/Pages/vbpq-vanbanmoi.aspx?type=0",
] as const;

export const VBPL_MAX_SYNC_ATTEMPTS = 3;

export function getVbplRefreshDays() {
  const parsed = Number(process.env.VBPL_REFRESH_DAYS ?? "7");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 7;
}

export function getVbplAutoSyncLimit() {
  const parsed = Number(process.env.VBPL_AUTO_SYNC_LIMIT ?? "8");
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 25) : 8;
}

export function getVbplDiscoveryLimit() {
  const parsed = Number(process.env.VBPL_DISCOVERY_LIMIT ?? "30");
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100) : 30;
}

export function getExtraVbplItemIdsFromEnv() {
  const raw = process.env.VBPL_AUTO_ITEM_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter((value) => /^\d+$/.test(value));
}
