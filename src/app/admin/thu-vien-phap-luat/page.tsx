import { requireAdminPage } from "@/lib/admin-auth";
import { PageBanner } from "@/components/sections/page-banner";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { VbplSyncPanel } from "@/components/admin/vbpl-sync-panel";
import { createMetadata } from "@/lib/seo";
import {
  getLegalLibraryStats,
  getRecentSyncJobs,
  getSyncQueue,
} from "@/lib/supabase/queries-legal";
import { isAiExtractionConfigured } from "@/lib/vbpl/ai-extractor";
import { isAdminClientConfigured } from "@/lib/supabase/admin";

export const metadata = createMetadata({
  title: "Đồng bộ vbpl.vn",
  description: "Quản trị pipeline AI cập nhật văn bản pháp luật từ vbpl.vn vào Supabase.",
  path: "/admin/thu-vien-phap-luat",
  noIndex: true,
});

export default async function AdminLegalLibraryPage() {
  await requireAdminPage();

  const [stats, jobs, queue] = await Promise.all([
    getLegalLibraryStats(),
    getRecentSyncJobs(),
    getSyncQueue(),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="Quản trị"
        title="Thư viện pháp luật — VBPL AI Sync"
        subtitle="Pipeline AI: vbpl.vn → trích xuất cấu trúc → Supabase → website"
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-premium">
          <AdminBackLink href="/admin" />
          <VbplSyncPanel
            aiConfigured={isAiExtractionConfigured()}
            serviceRoleConfigured={isAdminClientConfigured()}
            stats={stats}
            jobs={jobs}
            queue={queue}
          />
        </div>
      </section>
    </>
  );
}
