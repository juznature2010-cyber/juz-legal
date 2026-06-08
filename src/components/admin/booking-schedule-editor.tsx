"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/supabase/types";

type BookingScheduleEditorProps = {
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  mode: Booking["mode"];
  className?: string;
};

function toTimeInputValue(time: string) {
  return time?.slice(0, 5) ?? "";
}

export function BookingScheduleEditor({
  bookingId,
  bookingDate,
  bookingTime,
  mode,
  className,
}: BookingScheduleEditorProps) {
  const router = useRouter();
  const [date, setDate] = useState(bookingDate);
  const [time, setTime] = useState(toTimeInputValue(bookingTime));
  const [consultMode, setConsultMode] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingDate: date,
          bookingTime: time,
          mode: consultMode,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Cập nhật thất bại.");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-md border border-gold/25 bg-gold/5 p-3",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
        Chỉnh lịch trước khi xác nhận
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`date-${bookingId}`} className="text-xs">
            Ngày
          </Label>
          <Input
            id={`date-${bookingId}`}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSaved(false);
            }}
            className="mt-1 h-9 text-xs"
          />
        </div>
        <div>
          <Label htmlFor={`time-${bookingId}`} className="text-xs">
            Giờ
          </Label>
          <Input
            id={`time-${bookingId}`}
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setSaved(false);
            }}
            className="mt-1 h-9 text-xs"
          />
        </div>
      </div>
      <div className="mt-3">
        <Label htmlFor={`mode-${bookingId}`} className="text-xs">
          Hình thức tư vấn
        </Label>
        <select
          id={`mode-${bookingId}`}
          value={consultMode}
          onChange={(e) => {
            setConsultMode(e.target.value as Booking["mode"]);
            setSaved(false);
          }}
          className="mt-1 flex h-9 w-full rounded-md border border-navy/15 bg-white px-3 text-xs text-navy"
        >
          <option value="online">Trực tuyến</option>
          <option value="office">Tại văn phòng</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={loading || !date || !time}
        >
          {loading ? "Đang lưu..." : "Lưu lịch"}
        </Button>
        {saved ? (
          <span className="text-[10px] text-emerald-700">Đã cập nhật lịch</span>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-[10px] text-red-600">{error}</p> : null}
    </div>
  );
}
