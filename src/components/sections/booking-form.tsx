"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLocaleData } from "@/lib/locale-data";
import type { Locale } from "@/i18n/routing";

const BOOKING_LAWYER_SLUG = "tran-dinh-long";

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingForm() {
  const locale = useLocale() as Locale;
  const { services, getTeamMember } = getLocaleData(locale);
  const bookingLawyer = getTeamMember(BOOKING_LAWYER_SLUG);
  const t = useTranslations("booking");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const minDate = todayInputValue();

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
        lawyerSlug: BOOKING_LAWYER_SLUG,
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
      setError(data.error ?? t("submit"));
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
        <p className="font-serif text-xl text-navy">{t("successTitle")}</p>
        <p className="mt-2 text-muted">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="service">{t("service")} *</Label>
        <select
          id="service"
          name="service"
          required
          className="mt-1.5 flex h-11 w-full rounded-md border border-navy/15 bg-white px-4 text-sm"
        >
          <option value="">{t("selectService")}</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="lawyer">{t("lawyer")}</Label>
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
          <Label htmlFor="date">{t("date")} *</Label>
          <Input id="date" name="date" type="date" required min={minDate} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="time">{t("time")} *</Label>
          <Input id="time" name="time" type="time" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="mode">{t("mode")} *</Label>
        <select
          id="mode"
          name="mode"
          required
          className="mt-1.5 flex h-11 w-full rounded-md border border-navy/15 bg-white px-4 text-sm"
        >
          <option value="online">{t("modeOnline")}</option>
          <option value="office">{t("modeOffice")}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bname">{t("name")} *</Label>
          <Input id="bname" name="bname" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="bphone">{t("phone")} *</Label>
          <Input id="bphone" name="bphone" type="tel" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="bnote">{t("note")}</Label>
        <Textarea id="bnote" name="bnote" placeholder={t("notePlaceholder")} className="mt-1.5" />
      </div>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
