import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { enrichBooking } from "@/lib/admin-data";
import { sendBookingConfirmationZalo } from "@/lib/notify-zalo";
import type { Booking } from "@/lib/supabase/types";

const VALID_STATUSES: Booking["status"][] = [
  "pending",
  "confirmed",
  "cancelled",
  "done",
];

const VALID_MODES: Booking["mode"][] = ["online", "office"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();

  const updates: {
    status?: Booking["status"];
    booking_date?: string;
    booking_time?: string;
    mode?: Booking["mode"];
  } = {};

  if (body.status !== undefined && body.status !== null && body.status !== "") {
    const status = String(body.status).trim() as Booking["status"];
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Trạng thái không hợp lệ." }, { status: 400 });
    }
    updates.status = status;
  }

  if (body.bookingDate !== undefined) {
    const bookingDate = String(body.bookingDate).trim();
    if (!bookingDate) {
      return NextResponse.json({ error: "Ngày hẹn không hợp lệ." }, { status: 400 });
    }
    updates.booking_date = bookingDate;
  }

  if (body.bookingTime !== undefined) {
    const bookingTime = String(body.bookingTime).trim();
    if (!/^\d{2}:\d{2}/.test(bookingTime)) {
      return NextResponse.json({ error: "Giờ hẹn không hợp lệ." }, { status: 400 });
    }
    updates.booking_time =
      bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;
  }

  if (body.mode !== undefined) {
    const mode = String(body.mode).trim() as Booking["mode"];
    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json({ error: "Hình thức không hợp lệ." }, { status: 400 });
    }
    updates.mode = mode;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Không có thay đổi nào." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("admin booking fetch:", fetchError.message);
    return NextResponse.json(
      { error: "Không thể đọc đặt lịch." },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy đặt lịch." }, { status: 404 });
  }

  const shouldNotifyZalo =
    updates.status === "confirmed" && existing.status !== "confirmed";

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("admin booking update:", error.message);
    return NextResponse.json(
      { error: "Không thể cập nhật đặt lịch." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Không tìm thấy đặt lịch." }, { status: 404 });
  }

  let zalo:
    | { ok: true; skipped: false; msgId?: string }
    | { ok: false; skipped: true }
    | { ok: false; skipped: false; error: string }
    | undefined;

  if (shouldNotifyZalo) {
    const enriched = enrichBooking(data as Booking);
    zalo = await sendBookingConfirmationZalo({
      bookingId: data.id,
      serviceTitle: enriched.serviceTitle,
      lawyerName: enriched.lawyerName,
      bookingDate: data.booking_date,
      bookingTime: data.booking_time,
      mode: data.mode,
      clientName: data.client_name,
      clientPhone: data.client_phone,
      note: data.note,
    });

    if (!zalo.ok && !zalo.skipped) {
      console.error(
        "[admin/bookings] Xac nhan thanh cong nhung gui Zalo that bai:",
        zalo.error
      );
    }
  }

  return NextResponse.json({
    ok: true,
    booking: {
      id: data.id,
      status: data.status,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      mode: data.mode,
    },
    zalo,
  });
}
