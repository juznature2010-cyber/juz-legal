import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { withPg, requireEnv } from "./lib/env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { SUPABASE_DB_PASSWORD: password } = requireEnv(["SUPABASE_DB_PASSWORD"]);
const sql = readFileSync(join(root, "supabase", "fix-admin.sql"), "utf8");

await withPg(password, async (client) => {
  await client.query(sql);
});

console.log("[OK] Admin da duoc sua — dang nhap: admin@juzlegal.vn");
