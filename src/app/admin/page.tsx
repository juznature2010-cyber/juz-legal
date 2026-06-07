import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  FileText,
  Mail,
  Settings,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { getUserDisplayName } from "@/lib/auth-utils";
import { resolveUserRoleServer } from "@/lib/auth-server";
import {
  getAdminStats,
  getRecentBookings,
  getRecentContacts,
} from "@/lib/supabase/queries";
import {
  AdminStats,
  RecentBookings,
  RecentContacts,
} from "@/components/admin/admin-dashboard";
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
    title: "Nội dung website",
    desc: "Chỉnh dịch vụ, đội ngũ, blog trong data.ts",
    href: "/dich-vu",
    icon: FileText,
  },
  {
    title: "Đặt lịch tư vấn",
    desc: "Xem form đặt lịch trên website",
    href: "/dat-lich",
    icon: Calendar,
  },
  {
    title: "Liên hệ",
    desc: "Form liên hệ từ khách hàng",
    href: "/lien-he",
    icon: Mail,
  },
  {
    title: "Đội ngũ",
    desc: "Quản lý thông tin luật sư",
    href: "/doi-ngu",
    icon: Users,
  },
] as const;

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/dang-nhap");
  if ((await resolveUserRoleServer(user)) !== "admin") redirect("/tai-khoan");

  const [stats, bookings, contacts] = await Promise.all([
    getAdminStats(),
    getRecentBookings(5),
    getRecentContacts(5),
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
            <RecentBookings bookings={bookings} />
            <RecentContacts contacts={contacts} />
          </div>

          <div className="mt-10 rounded-lg border border-navy/10 bg-surface p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Settings className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h3 className="font-serif text-xl text-navy">Supabase</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>• Quản lý user: Dashboard → Authentication</li>
                  <li>• Xem dữ liệu: Dashboard → Table Editor</li>
                  <li>• Schema SQL: <code className="text-navy">supabase/schema.sql</code></li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/">Xem website</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
