import { describe, expect, it } from "vitest";
import { resolveUserRole } from "./auth-utils";

const user = (email: string) =>
  ({ email, id: "1", app_metadata: {}, user_metadata: {}, aud: "x", created_at: "" }) as never;

describe("resolveUserRole", () => {
  it("grants admin by profile role on client", () => {
    expect(resolveUserRole(user("a@example.com"), "admin", false)).toBe("admin");
  });

  it("does not grant admin by email on client path", () => {
    process.env.ADMIN_EMAIL = "admin@juzlegal.vn";
    expect(resolveUserRole(user("admin@juzlegal.vn"), "user", false)).toBe("user");
  });

  it("grants admin by email on server path", () => {
    process.env.ADMIN_EMAIL = "admin@juzlegal.vn";
    expect(resolveUserRole(user("admin@juzlegal.vn"), "user", true)).toBe("admin");
  });
});
