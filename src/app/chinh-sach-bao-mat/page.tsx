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
    title: "Phạm vi áp dụng",
    body: "Chính sách này áp dụng cho website JUZ Legal, biểu mẫu liên hệ/đặt lịch, tài khoản khách hàng và các kênh tư vấn trực tuyến do JUZ Legal vận hành.",
  },
  {
    title: "Thông tin thu thập",
    body: "Chúng tôi có thể thu thập họ tên, số điện thoại, email, nội dung tư vấn, thời gian mong muốn, thông tin đăng nhập và dữ liệu kỹ thuật cần thiết (cookie, nhật ký truy cập) để vận hành dịch vụ.",
  },
  {
    title: "Mục đích sử dụng",
    body: "Dữ liệu được dùng để tiếp nhận yêu cầu, sắp xếp lịch tư vấn, cung cấp dịch vụ pháp lý, quản lý tài khoản, phòng chống spam, cải thiện trải nghiệm và thực hiện nghĩa vụ pháp luật.",
  },
  {
    title: "Chia sẻ dữ liệu",
    body: "JUZ Legal không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với nhà cung cấp hạ tầng (Supabase, Vercel, Resend, Google Analytics) trong phạm vi cần thiết để vận hành website và dịch vụ.",
  },
  {
    title: "Bảo mật và lưu trữ",
    body: "Chúng tôi áp dụng kiểm soát truy cập, mã hóa truyền tải (HTTPS) và chính sách quyền truy cập nội bộ. Thời hạn lưu trữ phụ thuộc mục đích xử lý, hợp đồng dịch vụ và nghĩa vụ lưu trữ theo quy định pháp luật.",
  },
  {
    title: "Quyền của chủ thể dữ liệu",
    body: "Bạn có thể yêu cầu truy cập, chỉnh sửa, hạn chế xử lý hoặc xóa dữ liệu bằng cách liên hệ JUZ Legal. Một số dữ liệu có thể cần được lưu theo nghĩa vụ pháp lý hoặc hợp đồng đang hiệu lực.",
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
          <p className="text-sm text-navy/80">
            Cập nhật lần cuối: tháng 7/2026
          </p>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl text-navy">{section.title}</h2>
              <p className="mt-3 leading-relaxed">{section.body}</p>
            </section>
          ))}
          <p>
            Mọi yêu cầu về dữ liệu cá nhân vui lòng gửi tới{" "}
            <a className="text-navy underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>{" "}
            hoặc hotline {siteConfig.phoneDisplay}.
          </p>
        </div>
      </article>
    </>
  );
}
