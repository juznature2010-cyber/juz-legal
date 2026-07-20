import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { withPg, requireEnv } from "./lib/env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { SUPABASE_DB_PASSWORD: password } = requireEnv(["SUPABASE_DB_PASSWORD"]);
const sql = readFileSync(join(root, "supabase", "dev-setup.sql"), "utf8");

try {
  console.log("Dang setup dev auth (auto-confirm + admin)...");
  await withPg(password, async (client) => {
    await client.query(sql);
  });
  console.log("[OK] Dev setup xong");
  console.log("  Admin: admin@juzlegal.vn");
  console.log("  Mat khau: (xem supabase/dev-setup.sql)");
} catch (err) {
  console.error("[LOI]", err.message);
  process.exit(1);
}
