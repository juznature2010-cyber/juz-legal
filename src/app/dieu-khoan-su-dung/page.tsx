import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng website JUZ Legal.",
  path: "/dieu-khoan-su-dung",
});

const sections = [
  {
    title: "Chấp nhận điều khoản",
    body: "Khi truy cập website JUZ Legal, bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng website.",
  },
  {
    title: "Tính chất thông tin",
    body: "Nội dung trên website mang tính tham khảo chung và không tự động hình thành quan hệ luật sư – khách hàng. Mọi tư vấn cho vụ việc cụ thể cần được xác nhận bằng hợp đồng hoặc văn bản chấp thuận chính thức.",
  },
  {
    title: "Đặt lịch và liên hệ",
    body: "Việc gửi biểu mẫu không đồng nghĩa JUZ Legal đã chấp nhận vụ việc hoặc cam kết kết quả. JUZ Legal có quyền từ chối hoặc chuyển hướng yêu cầu khi nằm ngoài phạm vi chuyên môn hoặc có xung đột lợi ích.",
  },
  {
    title: "Tài khoản người dùng",
    body: "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình. JUZ Legal có thể tạm khóa tài khoản khi phát hiện hành vi lạm dụng hoặc vi phạm pháp luật.",
  },
  {
    title: "Sở hữu trí tuệ",
    body: "Nội dung, nhận diện thương hiệu và tài liệu trên website thuộc quyền của JUZ Legal hoặc bên cấp phép. Không được sao chép, phân phối hoặc sử dụng thương mại khi chưa có chấp thuận bằng văn bản.",
  },
  {
    title: "Giới hạn trách nhiệm",
    body: "JUZ Legal nỗ lực duy trì thông tin chính xác và cập nhật, nhưng không bảo đảm website luôn không gián đoạn hoặc không có sai sót kỹ thuật. Người dùng nên xác minh quy định pháp luật hiện hành trước khi ra quyết định.",
  },
];

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
            Liên hệ:{" "}
            <a className="text-navy underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>{" "}
            · {siteConfig.address}
          </p>
        </div>
      </article>
    </>
  );
}
