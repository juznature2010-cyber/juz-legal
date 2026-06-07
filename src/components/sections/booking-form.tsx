"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services, team } from "@/lib/data";

export function BookingForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug: form.get("service"),
        lawyerSlug: form.get("lawyer") || null,
        bookingDate: form.get("date"),
        bookingTime: form.get("time"),
        mode: form.get("mode"),
        clientName: form.get("bname"),
        clientPhone: form.get("bphone"),
        note: form.get("bnote") || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Không thể đặt lịch.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
        <p className="font-serif text-xl text-navy">Đặt lịch thành công</p>
        <p className="mt-2 text-muted">
          Chúng tôi sẽ xác nhận lịch hẹn qua điện thoại hoặc email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="lawyer">Luật sư (tùy chọn)</Label>
        <select
          id="lawyer"
          name="lawyer"
          className="mt-1.5 flex h-11 w-full rounded-md border border-navy/15 bg-white px-4 text-sm"
        >
          <option value="">Bất kỳ luật sư phù hợp</option>
          {team.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Ngày *</Label>
          <Input id="date" name="date" type="date" required className="mt-1.5" />
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
          <Input id="bname" name="bname" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="bphone">Điện thoại *</Label>
          <Input id="bphone" name="bphone" type="tel" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="bnote">Ghi chú</Label>
        <Textarea id="bnote" name="bnote" className="mt-1.5" />
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
