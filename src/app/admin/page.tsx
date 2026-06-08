import Link from "next/link";
import {
  Calendar,
  FileText,
  Mail,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { requireAdminPage } from "@/lib/admin-auth";
import { getUserDisplayName } from "@/lib/auth-utils";
import { enrichBookings } from "@/lib/admin-data";
import {
  getAdminStats,
  getRecentBookings,
  getRecentContacts,
} from "@/lib/supabase/queries";
import { AdminStats } from "@/components/admin/admin-dashboard";
import { AdminBookingsList } from "@/components/admin/admin-bookings-list";
import { AdminContactsList } from "@/components/admin/admin-contacts-list";
import { PageBanner } from "@/components/sections/page-banner";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { AdminSignOut } from "@/components/auth/admin-sign-out";

export const metadata = createMetadata({
  title: "Bảng điều khiển",
  description: "Khu vực quản trị JUZ Legal.",
  path: "/admin",
  noIndex: true,
});

const quickLinks = [
  {
    title: "Đặt lịch tư vấn",
    desc: "Xem và cập nhật trạng thái đặt lịch",
    href: "/admin/dat-lich",
    icon: Calendar,
  },
  {
    title: "Liên hệ khách hàng",
    desc: "Đọc và phản hồi tin nhắn liên hệ",
    href: "/admin/lien-he",
    icon: Mail,
  },
  {
    title: "Nội dung website",
    desc: "Xem trang dịch vụ trên website",
    href: "/dich-vu",
    icon: FileText,
  },
  {
    title: "Đội ngũ",
    desc: "Xem trang đội ngũ trên website",
    href: "/doi-ngu",
    icon: Users,
  },
] as const;

export default async function AdminPage() {
  const user = await requireAdminPage();

  const [stats, bookings, contacts] = await Promise.all([
    getAdminStats(),
    enrichBookings(await getRecentBookings(8)),
    getRecentContacts(8),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="Quản trị"
        title="Bảng điều khiển"
        subtitle={`Xin chào, ${getUserDisplayName(user)}`}
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-premium">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-eyebrow text-gold">JUZ Legal Admin</p>
              <h2 className="text-display-sm mt-2">Tổng quan</h2>
            </div>
            <AdminSignOut />
          </div>

          <AdminStats {...stats} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-navy/10 bg-white p-5 transition hover:border-gold/40 hover:shadow-md"
              >
                <item.icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 font-serif text-lg text-navy">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold opacity-0 transition group-hover:opacity-100">
                  Mở <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <AdminBookingsList bookings={bookings} compact showViewAll />
            <AdminContactsList contacts={contacts} compact showViewAll />
          </div>

          <div className="mt-10 rounded-lg border border-navy/10 bg-surface p-6 sm:p-8">
            <h3 className="font-serif text-xl text-navy">Hướng dẫn nhanh</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>• Chọn trạng thái trong danh sách để cập nhật đặt lịch hoặc liên hệ ngay trên trang.</li>
              <li>• Vào Đặt lịch tư vấn hoặc Liên hệ để lọc theo trạng thái.</li>
              <li>• Quản lý tài khoản: Supabase Dashboard → Authentication.</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/">Xem website</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
