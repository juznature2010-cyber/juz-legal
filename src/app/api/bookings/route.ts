import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
