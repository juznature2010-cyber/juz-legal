const url = "https://ssnaglboujsbmjnkguhr.supabase.co";
const key = "sb_publishable_xdul51MMNOIXKTPNVGyDqQ_vTrA0ClT";

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

const admin = await auth("token?grant_type=password", {
  email: "admin@juzlegal.vn",
  password: "Huyen12345@123",
});
console.log(
  admin.ok ? "[OK] Admin dang nhap thanh cong" : `[LOI] Admin: ${admin.data.error_description ?? admin.data.msg ?? admin.status}`
);

const testEmail = `test${Date.now()}@example.com`;
const signup = await auth("signup", {
  email: testEmail,
  password: "TestPass123!",
  data: { full_name: "Test User", role: "user" },
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
    login.ok ? "[OK] Dang nhap khach hang thanh cong" : `[LOI] Login khach: ${login.data.error_description ?? login.status}`
  );
}

console.log("\nMo http://localhost:5173 de test tren giao dien\n");
