"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm({ serviceLabel }: { serviceLabel?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        message: form.get("message"),
        serviceLabel,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Không thể gửi yêu cầu.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
        <p className="font-serif text-xl text-navy">Cảm ơn bạn đã liên hệ</p>
        <p className="mt-2 text-muted">
          JUZ Legal sẽ phản hồi trong vòng 2 giờ làm việc.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serviceLabel && (
        <p className="text-sm text-muted">
          Dịch vụ quan tâm: <strong className="text-navy">{serviceLabel}</strong>
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Họ và tên *</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input id="phone" name="phone" type="tel" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="message">Nội dung *</Label>
        <Textarea id="message" name="message" required className="mt-1.5" />
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
        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
      </Button>
    </form>
  );
}
