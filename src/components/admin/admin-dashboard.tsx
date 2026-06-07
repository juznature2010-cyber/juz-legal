import type { Booking, ContactMessage } from "@/lib/supabase/types";
import {
  formatBookingMode,
  formatBookingStatus,
} from "@/lib/auth-utils";

export function AdminStats({
  contacts,
  bookings,
  pendingBookings,
}: {
  contacts: number;
  bookings: number;
  pendingBookings: number;
}) {
  const items = [
    { label: "Liên hệ mới", value: contacts },
    { label: "Đặt lịch", value: bookings },
    { label: "Chờ xác nhận", value: pendingBookings },
  ];

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm"
        >
          <p className="text-xs uppercase tracking-wider text-muted">{item.label}</p>
          <p className="mt-2 font-serif text-3xl text-navy">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-serif text-xl text-navy">Đặt lịch gần đây</h3>
      {bookings.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Chưa có yêu cầu đặt lịch.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy/5">
          {bookings.map((b) => (
            <li key={b.id} className="py-3 text-sm">
              <p className="font-medium text-navy">{b.client_name}</p>
              <p className="mt-1 text-muted">
                {b.booking_date} {b.booking_time?.slice(0, 5)} ·{" "}
                {formatBookingMode(b.mode)} · {formatBookingStatus(b.status)}
              </p>
              <p className="text-muted">{b.client_phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RecentContacts({ contacts }: { contacts: ContactMessage[] }) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-serif text-xl text-navy">Liên hệ gần đây</h3>
      {contacts.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Chưa có tin nhắn liên hệ.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy/5">
          {contacts.map((c) => (
            <li key={c.id} className="py-3 text-sm">
              <p className="font-medium text-navy">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-muted">{c.message}</p>
              <p className="text-muted">{c.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
