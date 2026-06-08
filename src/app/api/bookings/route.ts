import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getService, getTeamMember } from "@/lib/data";
import { sendBookingNotification } from "@/lib/notify-email";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Hệ thống đặt lịch chưa được cấu hình. Vui lòng gọi hotline." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const serviceSlug = String(body.serviceSlug ?? "").trim();
    const lawyerSlug = String(body.lawyerSlug ?? "").trim() || null;
    const bookingDate = String(body.bookingDate ?? "").trim();
    const bookingTime = String(body.bookingTime ?? "").trim();
    const mode = String(body.mode ?? "").trim();
    const clientName = String(body.clientName ?? "").trim();
    const clientPhone = String(body.clientPhone ?? "").trim();
    const note = String(body.note ?? "").trim() || null;

    if (!serviceSlug || !bookingDate || !bookingTime || !clientName || !clientPhone) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    if (mode !== "online" && mode !== "office") {
      return NextResponse.json({ error: "Hình thức không hợp lệ." }, { status: 400 });
    }

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Ngày đặt lịch không thể là ngày trong quá khứ." },
        { status: 400 }
      );
    }

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

    const emailResult = await sendBookingNotification({
      serviceTitle,
      lawyerName,
      bookingDate,
      bookingTime,
      mode: mode as "online" | "office",
      clientName,
      clientPhone,
      note,
    });

    if (!emailResult.ok && !emailResult.skipped) {
      console.error("[bookings] Dat lich da luu nhung gui mail that bai");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
