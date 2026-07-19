import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getService, getTeamMember } from "@/lib/data";
import { sendNewBookingRequestNotification } from "@/lib/notify-email";
import { bookingSchema } from "@/lib/lead-schemas";
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

    const rate = checkRateLimit(`booking:${getClientIp(request)}`);
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
        { error: "Hệ thống đặt lịch chưa được cấu hình. Vui lòng gọi hotline." },
        { status: 503 }
      );
    }

    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      serviceSlug,
      lawyerSlug = null,
      bookingDate,
      bookingTime,
      mode,
      clientName,
      clientPhone,
      note = null,
    } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("bookings").insert({
      service_slug: serviceSlug,
      lawyer_slug: lawyerSlug,
      booking_date: bookingDate,
      booking_time: bookingTime,
      mode,
      client_name: clientName,
      client_phone: clientPhone,
      note,
      user_id: user?.id ?? null,
    });

    if (error) {
      console.error("booking insert:", error.message);
      return NextResponse.json(
        { error: "Không thể đặt lịch. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    const serviceTitle = getService(serviceSlug)?.title ?? serviceSlug;
    const lawyerName = lawyerSlug
      ? (getTeamMember(lawyerSlug)?.name ?? lawyerSlug)
      : null;

    const emailResult = await sendNewBookingRequestNotification({
      serviceTitle,
      lawyerName,
      bookingDate,
      bookingTime,
      mode: mode as "online" | "office",
      clientName,
      clientPhone,
      note,
    });

    if (emailResult.ok) {
      console.log("[bookings] Da gui mail thong bao dat lich moi, id=", emailResult.id);
    } else if (!emailResult.skipped) {
      console.error("[bookings] Dat lich da luu nhung gui mail that bai:", emailResult.error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
