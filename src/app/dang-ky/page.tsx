import { Suspense } from "react";
import { PageBanner } from "@/components/sections/page-banner";
import { RegisterForm } from "@/components/auth/register-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Đăng ký",
  description: "Tạo tài khoản khách hàng JUZ Legal.",
  path: "/dang-ky",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <>
      <PageBanner
        eyebrow="Tài khoản khách hàng"
        title="Đăng ký"
        subtitle="Tạo tài khoản để theo dõi tư vấn và liên hệ nhanh hơn"
        image="default"
        tall={false}
      />
      <section className="section-padding">
        <div className="container-narrow mx-auto max-w-md">
          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm text-muted">
              Điền thông tin bên dưới để tạo tài khoản miễn phí.
            </p>
            <div className="mt-6">
              <Suspense fallback={<p className="text-sm text-muted">Đang tải...</p>}>
                <RegisterForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
