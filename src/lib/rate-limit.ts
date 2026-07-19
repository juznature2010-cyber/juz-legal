type Entry = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __juzRateLimit?: Map<string, Entry>;
};
const store = globalStore.__juzRateLimit ?? new Map<string, Entry>();
globalStore.__juzRateLimit = store;

export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1_000
) {
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

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
