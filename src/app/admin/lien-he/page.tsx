import { requireAdminPage } from "@/lib/admin-auth";
import { getUserDisplayName } from "@/lib/auth-utils";
import { getContacts } from "@/lib/supabase/queries";
import type { ContactMessage } from "@/lib/supabase/types";
import { AdminContactsList } from "@/components/admin/admin-contacts-list";
import { AdminFilterTabs } from "@/components/admin/admin-filter-tabs";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSignOut } from "@/components/auth/admin-sign-out";
import { PageBanner } from "@/components/sections/page-banner";
import { createMetadata } from "@/lib/seo";

const STATUSES: { value: ContactMessage["status"]; label: string }[] = [
  { value: "new", label: "Mới" },
  { value: "read", label: "Đã đọc" },
  { value: "replied", label: "Đã phản hồi" },
];

export const metadata = createMetadata({
  title: "Quản lý liên hệ",
  description: "Quản lý tin nhắn liên hệ từ khách hàng JUZ Legal.",
  path: "/admin/lien-he",
  noIndex: true,
});

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireAdminPage();
  const { status } = await searchParams;
  const filterStatus = STATUSES.some((s) => s.value === status)
    ? (status as ContactMessage["status"])
    : undefined;

  const contacts = await getContacts({ limit: 100, status: filterStatus });

  const tabs = [
    { label: "Tất cả", href: "/admin/lien-he", active: !filterStatus },
    ...STATUSES.map((s) => ({
      label: s.label,
      href: `/admin/lien-he?status=${s.value}`,
      active: filterStatus === s.value,
    })),
  ];

  return (
    <>
      <PageBanner
        eyebrow="Quản trị"
        title="Quản lý liên hệ"
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
            <AdminContactsList contacts={contacts} />
          </div>
        </div>
      </section>
    </>
  );
}
