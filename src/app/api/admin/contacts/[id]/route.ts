import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";
import type { ContactMessage } from "@/lib/supabase/types";

const VALID_STATUSES: ContactMessage["status"][] = ["new", "read", "replied"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const status = String(body.status ?? "").trim() as ContactMessage["status"];

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    console.error("admin contact update:", error.message);
    return NextResponse.json(
      { error: "Không thể cập nhật liên hệ." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Không tìm thấy liên hệ." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, status: data.status });
}
