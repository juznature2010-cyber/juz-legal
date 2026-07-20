export const VBPL_BASE_URL = "https://vbpl.vn";

export function buildVbplDocumentUrl(itemId: string) {
  return `${VBPL_BASE_URL}/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=${itemId}`;
}

export function extractVbplItemId(sourceUrl?: string | null) {
  if (!sourceUrl) return null;
  const match = sourceUrl.match(/ItemID=(\d+)/i);
  return match?.[1] ?? null;
}

export function slugifyDocumentNumber(number: string) {
  return number
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function fetchVbplHtml(itemId: string) {
  const url = buildVbplDocumentUrl(itemId);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "JUZ-Legal-Sync/1.0 (+https://www.juzlegal.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`VBPL fetch failed (${response.status}) for ItemID=${itemId}`);
  }

  const html = await response.text();
  if (!html.trim()) {
    throw new Error(`VBPL returned empty HTML for ItemID=${itemId}`);
  }

  return { url, html };
}

export function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateForAi(text: string, maxChars = 120_000) {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n...[truncated]`;
}
