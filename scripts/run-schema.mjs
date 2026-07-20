import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { withPg, requireEnv } from "./lib/env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { SUPABASE_DB_PASSWORD: password } = requireEnv(["SUPABASE_DB_PASSWORD"]);
const sql = readFileSync(join(root, "supabase", "schema.sql"), "utf8");

await withPg(password, async (client, label) => {
  console.log(`Dang ket noi (${label})...`);
  console.log("Dang chay schema.sql...");
  await client.query(sql);
  console.log("[OK] schema.sql da chay xong");
});
