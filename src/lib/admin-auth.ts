import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { resolveUserRoleServer } from "@/lib/auth-server";

export async function requireAdminPage() {
  const user = await getUser();
  if (!user) redirect("/dang-nhap");
  if ((await resolveUserRoleServer(user)) !== "admin") redirect("/tai-khoan");
  return user;
}

export async function requireAdminApi() {
  const user = await getUser();
  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if ((await resolveUserRoleServer(user)) !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user };
}
