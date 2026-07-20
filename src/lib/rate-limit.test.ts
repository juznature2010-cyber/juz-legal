import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit memory fallback", () => {
  it("allows requests under the limit", async () => {
    const key = `test-${Date.now()}`;
    const first = await checkRateLimit(key, 2, 60_000);
    const second = await checkRateLimit(key, 2, 60_000);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
  });

  it("blocks after exceeding the limit", async () => {
    const key = `block-${Date.now()}`;
    await checkRateLimit(key, 1, 60_000);
    const blocked = await checkRateLimit(key, 1, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
