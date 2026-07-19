import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";

export const metadata = createMetadata({
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng website JUZ Legal.",
  path: "/dieu-khoan-su-dung",
});

export default function TermsPage() {
  return (
    <>
      <PageBanner
        title="Điều khoản sử dụng"
        subtitle="Điều kiện áp dụng khi truy cập website JUZ Legal."
        image="default"
        tall={false}
      />
      <article className="section-premium bg-ivory">
        <div className="container-narrow space-y-8 text-muted">
          <section>
            <h2 className="font-display text-2xl text-navy">Thông tin chung</h2>
            <p className="mt-3 leading-relaxed">
              Nội dung website mang tính tham khảo và không tự động hình thành
              quan hệ luật sư – khách hàng hoặc thay thế tư vấn cho vụ việc cụ thể.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-navy">Đặt lịch và liên hệ</h2>
            <p className="mt-3 leading-relaxed">
              Việc gửi biểu mẫu không đồng nghĩa JUZ Legal đã chấp nhận vụ việc.
              Dịch vụ chỉ phát sinh sau xác nhận hoặc thỏa thuận chính thức.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-navy">Sở hữu trí tuệ</h2>
            <p className="mt-3 leading-relaxed">
              Nội dung và nhận diện thuộc quyền của JUZ Legal hoặc bên cấp phép;
              không được sử dụng thương mại khi chưa có chấp thuận.
            </p>
          </section>
          <p className="text-sm">
            Nội dung này cần được người phụ trách pháp lý phê duyệt trước khi
            vận hành chính thức.
          </p>
        </div>
      </article>
    </>
  );
}
