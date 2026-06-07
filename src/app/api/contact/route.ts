import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim() || null;
    const message = String(body.message ?? "").trim();
    const serviceLabel = String(body.serviceLabel ?? "").trim() || null;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("contact_messages").insert({
      name,
      phone,
      email,
      message,
      service_label: serviceLabel,
      user_id: user?.id ?? null,
    });

    if (error) {
      console.error("contact insert:", error.message);
      return NextResponse.json(
        { error: "Không thể gửi yêu cầu. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
