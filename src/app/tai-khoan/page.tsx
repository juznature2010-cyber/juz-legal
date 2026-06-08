import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Phone, User, Calendar } from "lucide-react";
import { PageBanner } from "@/components/sections/page-banner";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { AdminSignOut } from "@/components/auth/admin-sign-out";
import { getUser } from "@/lib/supabase/server";
import { getUserBookings } from "@/lib/supabase/queries";
import {
  formatBookingMode,
  formatBookingStatus,
  getUserDisplayName,
  getUserPhone,
} from "@/lib/auth-utils";
import { resolveUserRoleServer } from "@/lib/auth-server";

export const metadata = createMetadata({
  title: "Tài khoản",
  description: "Quản lý tài khoản khách hàng JUZ Legal.",
  path: "/tai-khoan",
  noIndex: true,
});

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/dang-nhap");

  if ((await resolveUserRoleServer(user)) === "admin") redirect("/admin");

  const displayName = getUserDisplayName(user);
  const phone = getUserPhone(user);
  const bookings = await getUserBookings(user.id);

  return (
    <>
      <PageBanner
        eyebrow="Khách hàng"
        title="Tài khoản của tôi"
        subtitle={`Xin chào, ${displayName}`}
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-narrow mx-auto max-w-2xl space-y-6">
          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-navy">Thông tin tài khoản</h2>
              <AdminSignOut />
            </div>

            <dl className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Họ tên</dt>
                  <dd className="mt-1 text-navy">{displayName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Email</dt>
                  <dd className="mt-1 text-navy">{user.email ?? "—"}</dd>
                </div>
              </div>
              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Điện thoại</dt>
                    <dd className="mt-1 text-navy">{phone}</dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="gold" asChild>
                <Link href="/dat-lich">Đặt lịch tư vấn</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/lien-he">Liên hệ</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-xl text-navy">Lịch hẹn của tôi</h2>
            </div>
            {bookings.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Bạn chưa có lịch hẹn nào.{" "}
                <Link href="/dat-lich" className="text-navy underline">
                  Đặt lịch ngay
                </Link>
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-navy/5">
                {bookings.map((b) => (
                  <li key={b.id} className="py-3 text-sm">
                    <p className="font-medium text-navy">
                      {b.booking_date} · {b.booking_time?.slice(0, 5)}
                    </p>
                    <p className="mt-1 text-muted">
                      {formatBookingMode(b.mode)} · {formatBookingStatus(b.status)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
