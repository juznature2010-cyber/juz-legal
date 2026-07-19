import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { contactSchema } from "@/lib/lead-schemas";
import { sendNewContactNotification } from "@/lib/notify-email";
import {
  checkRateLimit,
  getClientIp,
  isSameOrigin,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Nguồn yêu cầu không hợp lệ." },
        { status: 403 }
      );
    }

    const rate = checkRateLimit(`contact:${getClientIp(request)}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Hệ thống liên hệ chưa được cấu hình. Vui lòng gọi hotline." },
        { status: 503 }
      );
    }

    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, message } = parsed.data;
    const email = parsed.data.email || null;
    const serviceLabel = parsed.data.serviceLabel || null;

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

    const emailResult = await sendNewContactNotification({
      name,
      phone,
      email,
      message,
      serviceLabel,
    });
    if (!emailResult.ok && !emailResult.skipped) {
      console.error("[contact] Đã lưu nhưng gửi mail thất bại:", emailResult.error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
