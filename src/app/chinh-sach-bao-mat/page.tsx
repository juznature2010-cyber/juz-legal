import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "Chính sách bảo mật",
  description: "Chính sách thu thập và bảo vệ dữ liệu cá nhân tại JUZ Legal.",
  path: "/chinh-sach-bao-mat",
});

const sections = [
  {
    title: "Thông tin thu thập",
    body: "Khi gửi biểu mẫu hoặc tạo tài khoản, bạn có thể cung cấp họ tên, số điện thoại, email, nội dung tư vấn và thời gian mong muốn. Chúng tôi chỉ thu thập dữ liệu cần thiết để xử lý yêu cầu.",
  },
  {
    title: "Mục đích sử dụng",
    body: "Dữ liệu được dùng để liên hệ, sắp xếp lịch tư vấn, cung cấp dịch vụ, quản lý tài khoản, phòng chống spam và thực hiện nghĩa vụ pháp luật.",
  },
  {
    title: "Bảo mật và lưu trữ",
    body: "JUZ Legal giới hạn quyền truy cập, áp dụng biện pháp bảo vệ phù hợp và không bán dữ liệu cá nhân. Thời hạn lưu trữ phụ thuộc mục đích xử lý và nghĩa vụ pháp lý.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        title="Chính sách bảo mật"
        subtitle="Cách JUZ Legal sử dụng và bảo vệ thông tin bạn cung cấp."
        image="default"
        tall={false}
      />
      <article className="section-premium bg-ivory">
        <div className="container-narrow space-y-8 text-muted">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl text-navy">{section.title}</h2>
              <p className="mt-3 leading-relaxed">{section.body}</p>
            </section>
          ))}
          <p>
            Yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu có thể gửi tới{" "}
            <a className="text-navy underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
          <p className="text-sm">
            Nội dung này cần được người phụ trách pháp lý phê duyệt trước khi
            vận hành chính thức.
          </p>
        </div>
      </article>
    </>
  );
}
