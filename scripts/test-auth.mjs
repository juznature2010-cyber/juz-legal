import { requireEnv } from "./lib/env.mjs";

const env = requireEnv([
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "ADMIN_EMAIL",
]);

const url = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD ?? env.ADMIN_PASSWORD;

async function auth(path, body) {
  const res = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

console.log("\n=== Test Auth JUZ Legal ===\n");

if (adminPassword) {
  const admin = await auth("token?grant_type=password", {
    email: adminEmail,
    password: adminPassword,
  });
  console.log(
    admin.ok
      ? "[OK] Admin dang nhap thanh cong"
      : `[LOI] Admin: ${admin.data.error_description ?? admin.data.msg ?? admin.status}`
  );
} else {
  console.warn("[BO QUA] Test admin — thieu ADMIN_PASSWORD trong .env.local");
}

const testEmail = `test${Date.now()}@example.com`;
const signup = await auth("signup", {
  email: testEmail,
  password: "TestPass123!",
  data: { full_name: "Test User" },
});
const hasSession = !!signup.data.access_token;
console.log(
  hasSession
    ? "[OK] Dang ky + vao luon (khong can email)"
    : `[LOI] Dang ky: ${signup.data.error_description ?? signup.data.msg ?? JSON.stringify(signup.data)}`
);

if (hasSession) {
  const login = await auth("token?grant_type=password", {
    email: testEmail,
    password: "TestPass123!",
  });
  console.log(
    login.ok
      ? "[OK] Dang nhap khach hang thanh cong"
      : `[LOI] Login khach: ${login.data.error_description ?? login.status}`
  );
}

console.log("\nMo http://localhost:5173 de test tren giao dien\n");
