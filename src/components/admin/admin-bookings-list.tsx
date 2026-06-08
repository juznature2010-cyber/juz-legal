"use client";

import Link from "next/link";
import type { Booking } from "@/lib/supabase/types";
import {
  formatBookingMode,
  formatBookingStatus,
} from "@/lib/auth-utils";
import { StatusSelect } from "@/components/admin/status-select";
import { StatusBadge } from "@/components/admin/status-badge";

const BOOKING_STATUSES = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "done", label: "Hoàn tất" },
] as const;

export type BookingRow = Booking & {
  serviceTitle: string;
  lawyerName: string | null;
};

type AdminBookingsListProps = {
  bookings: BookingRow[];
  compact?: boolean;
  showViewAll?: boolean;
};

function formatDateTime(date: string, time: string) {
  const timeShort = time?.slice(0, 5) ?? "";
  return `${date} ${timeShort}`.trim();
}

export function AdminBookingsList({
  bookings,
  compact = false,
  showViewAll = false,
}: AdminBookingsListProps) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-xl text-navy">Đặt lịch tư vấn</h3>
        {showViewAll ? (
          <Link
            href="/admin/dat-lich"
            className="text-xs uppercase tracking-wider text-gold transition hover:text-navy"
          >
            Xem tất cả →
          </Link>
        ) : null}
      </div>

      {bookings.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Chưa có yêu cầu đặt lịch.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy/5">
          {bookings.map((b) => (
            <li
              key={b.id}
              className={compact ? "py-3" : "grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start"}
            >
              <div className="min-w-0 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-navy">{b.client_name}</p>
                  <StatusBadge
                    label={formatBookingStatus(b.status)}
                    status={b.status}
                    type="booking"
                  />
                </div>
                <p className="mt-1 text-muted">
                  {formatDateTime(b.booking_date, b.booking_time)} ·{" "}
                  {formatBookingMode(b.mode)}
                </p>
                <p className="text-muted">
                  <a href={`tel:${b.client_phone}`} className="hover:text-navy">
                    {b.client_phone}
                  </a>
                </p>
                {!compact ? (
                  <>
                    <p className="mt-2 text-muted">
                      Dịch vụ: <span className="text-navy">{b.serviceTitle}</span>
                      {b.lawyerName ? (
                        <>
                          {" "}
                          · Luật sư: <span className="text-navy">{b.lawyerName}</span>
                        </>
                      ) : null}
                    </p>
                    {b.note ? (
                      <p className="mt-2 rounded bg-surface px-3 py-2 text-muted">
                        {b.note}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
              <StatusSelect
                id={b.id}
                value={b.status}
                options={[...BOOKING_STATUSES]}
                apiPath={`/api/admin/bookings/${b.id}`}
                className={compact ? "mt-2 w-full sm:w-40" : "w-full sm:w-44"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
