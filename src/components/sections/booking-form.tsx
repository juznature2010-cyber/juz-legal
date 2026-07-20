"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTeamMember, services } from "@/lib/data";

const BOOKING_LAWYER_SLUG = "tran-dinh-long";
const bookingLawyer = getTeamMember(BOOKING_LAWYER_SLUG);

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const minDate = todayInputValue();
  const id = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: form.get("service"),
          lawyerSlug: BOOKING_LAWYER_SLUG,
          bookingDate: form.get("date"),
          bookingTime: form.get("time"),
          mode: form.get("mode"),
          clientName: form.get("bname"),
          clientPhone: form.get("bphone"),
          note: form.get("bnote") || null,
          website: form.get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Không thể đặt lịch.");
        return;
      }
      setSent(true);
    } catch {
      setError("Không thể kết nối. Vui lòng gọi hotline.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
        <p className="font-serif text-xl text-navy">Đặt lịch thành công</p>
        <p className="mt-2 text-muted">
          Chúng tôi đã nhận yêu cầu và sẽ xác nhận lịch hẹn qua Zalo hoặc điện thoại
          trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="sr-only" aria-hidden="true">
        <Label htmlFor={`${id}-website`}>Website</Label>
        <Input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <Label htmlFor="service">Dịch vụ *</Label>
        <select
          id="service"
          name="service"
          required
          className="mt-1.5 flex h-11 w-full rounded-md border border-navy/15 bg-white px-4 text-sm"
        >
          <option value="">Chọn dịch vụ</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="lawyer">Luật sư tư vấn</Label>
        <input type="hidden" name="lawyer" value={BOOKING_LAWYER_SLUG} />
        <p className="mt-1.5 rounded-md border border-navy/15 bg-surface px-4 py-3 text-sm text-navy">
          {bookingLawyer?.name ?? "LS. Trần Đình Long"}
          {bookingLawyer?.role ? (
            <span className="mt-0.5 block text-xs text-muted">{bookingLawyer.role}</span>
          ) : null}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Ngày *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            min={minDate}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="time">Giờ *</Label>
          <Input id="time" name="time" type="time" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="mode">Hình thức *</Label>
        <select
          id="mode"
          name="mode"
          required
          className="mt-1.5 flex h-11 w-full rounded-md border border-navy/15 bg-white px-4 text-sm"
        >
          <option value="online">Tư vấn trực tuyến</option>
          <option value="office">Tại văn phòng</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bname">Họ tên *</Label>
          <Input id="bname" name="bname" required minLength={2} autoComplete="name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="bphone">Điện thoại *</Label>
          <Input id="bphone" name="bphone" type="tel" required minLength={8} autoComplete="tel" inputMode="tel" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="bnote">Ghi chú</Label>
        <Textarea id="bnote" name="bnote" className="mt-1.5" />
      </div>

      {error && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lịch"}
      </Button>
    </form>
  );
}
