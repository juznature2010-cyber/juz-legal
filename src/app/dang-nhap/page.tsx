import { Suspense } from "react";
import { PageBanner } from "@/components/sections/page-banner";
import { LoginForm } from "@/components/auth/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản JUZ Legal.",
  path: "/dang-nhap",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <>
      <PageBanner
        eyebrow="Hệ thống nội bộ"
        title="Đăng nhập"
        subtitle="Đăng nhập tài khoản khách hàng hoặc quản trị viên"
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-narrow mx-auto max-w-md">
          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm text-muted">
              Khách hàng đăng nhập để xem tài khoản. Quản trị viên truy cập bảng điều khiển.
            </p>
            <div className="mt-6">
              <Suspense fallback={<p className="text-sm text-muted">Đang tải...</p>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
