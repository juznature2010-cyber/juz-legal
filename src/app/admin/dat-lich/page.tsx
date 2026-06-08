import { requireAdminPage } from "@/lib/admin-auth";
import { getUserDisplayName } from "@/lib/auth-utils";
import { enrichBookings } from "@/lib/admin-data";
import { getBookings } from "@/lib/supabase/queries";
import type { Booking } from "@/lib/supabase/types";
import { AdminBookingsList } from "@/components/admin/admin-bookings-list";
import { AdminFilterTabs } from "@/components/admin/admin-filter-tabs";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSignOut } from "@/components/auth/admin-sign-out";
import { PageBanner } from "@/components/sections/page-banner";
import { createMetadata } from "@/lib/seo";

const STATUSES: { value: Booking["status"]; label: string }[] = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "done", label: "Hoàn tất" },
];

export const metadata = createMetadata({
  title: "Quản lý đặt lịch",
  description: "Quản lý yêu cầu đặt lịch tư vấn JUZ Legal.",
  path: "/admin/dat-lich",
  noIndex: true,
});

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireAdminPage();
  const { status } = await searchParams;
  const filterStatus = STATUSES.some((s) => s.value === status)
    ? (status as Booking["status"])
    : undefined;

  const bookings = enrichBookings(
    await getBookings({ limit: 100, status: filterStatus })
  );

  const tabs = [
    { label: "Tất cả", href: "/admin/dat-lich", active: !filterStatus },
    ...STATUSES.map((s) => ({
      label: s.label,
      href: `/admin/dat-lich?status=${s.value}`,
      active: filterStatus === s.value,
    })),
  ];

  return (
    <>
      <PageBanner
        eyebrow="Quản trị"
        title="Quản lý đặt lịch"
        subtitle={`Xin chào, ${getUserDisplayName(user)}`}
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-premium">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <AdminBackLink />
            <AdminSignOut />
          </div>

          <AdminFilterTabs tabs={tabs} />

          <div className="mt-6">
            <AdminBookingsList bookings={bookings} />
          </div>
        </div>
      </section>
    </>
  );
}
