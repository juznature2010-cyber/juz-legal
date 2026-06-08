import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { requireEnv, withPg } from "./lib/env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = requireEnv(["SUPABASE_DB_PASSWORD"]);
const sql = readFileSync(join(root, "supabase", "production-patch.sql"), "utf8");

console.log("\n=== JUZ Legal — Production patch ===\n");

await withPg(env.SUPABASE_DB_PASSWORD, async (client, label) => {
  console.log(`[OK] Ket noi (${label})`);
  await client.query(sql);
  console.log("[OK] production-patch.sql da chay xong");

  const { rows } = await client.query(
    `select p.role, u.email
     from public.profiles p
     join auth.users u on u.id = p.id
     where lower(u.email) = 'admin@juzlegal.vn'`
  );
  if (rows[0]) {
    console.log(`[OK] Admin: ${rows[0].email} — role: ${rows[0].role}`);
  } else {
    console.warn("[CANH BAO] Chua co user admin@juzlegal.vn — chay: npm run supabase:admin");
  }
});

console.log("\n[DONE]\n");
