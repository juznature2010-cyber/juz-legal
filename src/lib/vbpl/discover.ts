import {
  DEFAULT_VBPL_ITEM_IDS,
  VBPL_DISCOVERY_URLS,
  getExtraVbplItemIdsFromEnv,
  getVbplDiscoveryLimit,
} from "@/lib/vbpl/config";

const FETCH_HEADERS = {
  "User-Agent": "JUZ-Legal-AutoSync/1.0 (+https://www.juzlegal.com)",
  Accept: "text/html,application/xhtml+xml",
};

export function parseVbplItemIdsFromHtml(html: string) {
  const ids = new Set<string>();
  for (const match of html.matchAll(/ItemID[=:"'\s]*(\d{4,9})/gi)) {
    ids.add(match[1]!);
  }
  return [...ids];
}

export async function fetchDiscoveryPage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function discoverVbplItemIds() {
  const discovered = new Set<string>([
    ...DEFAULT_VBPL_ITEM_IDS,
    ...getExtraVbplItemIdsFromEnv(),
  ]);

  const errors: string[] = [];

  for (const url of VBPL_DISCOVERY_URLS) {
    try {
      const html = await fetchDiscoveryPage(url);
      for (const itemId of parseVbplItemIdsFromHtml(html)) {
        discovered.add(itemId);
      }
    } catch (error) {
      errors.push(
        `${url}: ${error instanceof Error ? error.message : "fetch failed"}`
      );
    }
  }

  const limit = getVbplDiscoveryLimit();
  const itemIds = [...discovered].slice(0, limit);

  return { itemIds, errors };
}
