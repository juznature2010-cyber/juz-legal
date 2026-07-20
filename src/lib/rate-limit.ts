type Entry = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __juzRateLimit?: Map<string, Entry>;
};
const store = globalStore.__juzRateLimit ?? new Map<string, Entry>();
globalStore.__juzRateLimit = store;

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1_000),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!baseUrl || !token) return null;

  const windowSeconds = Math.ceil(windowMs / 1_000);
  const redisKey = `juz:rl:${key}`;

  try {
    const incr = await fetch(`${baseUrl}/incr/${encodeURIComponent(redisKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!incr.ok) return null;

    const incrData = (await incr.json()) as { result?: number };
    const count = incrData.result ?? 0;
    if (count === 1) {
      await fetch(
        `${baseUrl}/expire/${encodeURIComponent(redisKey)}/${windowSeconds}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
    }

    if (count > limit) {
      const ttl = await fetch(
        `${baseUrl}/ttl/${encodeURIComponent(redisKey)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      const ttlData = (await ttl.json()) as { result?: number };
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, ttlData.result ?? windowSeconds),
      };
    }

    return { allowed: true, retryAfterSeconds: 0 };
  } catch (error) {
    console.error("[rate-limit] Upstash unavailable:", error);
    return null;
  }
}

export async function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1_000
): Promise<RateLimitResult> {
  const upstash = await upstashRateLimit(key, limit, windowMs);
  if (upstash) return upstash;
  return memoryRateLimit(key, limit, windowMs);
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export { isTrustedFormRequest as isSameOrigin } from "@/lib/request-security";
