import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { FadeIn } from "@/components/motion";
import { companyHistory, values, achievements } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const metadata = createMetadata({
  title: "Giới thiệu",
  description:
    "Giới thiệu Dịch vụ Pháp lý JUZ legal — tầm nhìn, sứ mệnh và giá trị cốt lõi.",
  path: "/gioi-thieu",
});

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="Về chúng tôi"
        title="Giới thiệu JUZ Legal"
        subtitle="Đối tác pháp lý chuyên nghiệp cho doanh nghiệp và cá nhân tại Việt Nam."
        image="about"
      />
      <section className="section-premium bg-ivory">
        <div className="container-narrow">
          <FadeIn>
            <p className="text-lg leading-relaxed text-muted">
              {siteConfig.legalName} (JUZ Legal) được thành lập với sứ mệnh mang
              đến giải pháp pháp lý toàn diện, minh bạch và hiệu quả — phục vụ doanh nghiệp
              trong nước, nhà đầu tư FDI và khách hàng cá nhân có nhu cầu tư vấn cao cấp.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-premium bg-white">
        <div className="container-premium">
          <h2 className="text-display-sm text-navy">Lịch sử hình thành</h2>
          <div className="gold-line mt-4" />
          <div className="mt-8 space-y-5 border-l-2 border-gold pl-5 sm:mt-10 sm:space-y-6 sm:pl-8">
            {companyHistory.map((h) => (
              <div key={h.year}>
                <span className="font-serif text-xl text-gold">{h.year}</span>
                <p className="mt-1 text-muted">{h.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-display-sm text-navy">Tầm nhìn</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Trở thành hãng luật hàng đầu khu vực — được tin tưởng bởi doanh nghiệp và
                nhà đầu tư trong hành trình phát triển bền vững tại Việt Nam và ASEAN.
              </p>
            </div>
            <div>
              <h2 className="text-display-sm text-navy">Sứ mệnh</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Bảo vệ quyền lợi hợp pháp của khách hàng bằng chuyên môn sâu, đạo đức nghề
                nghiệp và dịch vụ tận tâm — góp phần xây dựng môi trường kinh doanh minh
                bạch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-premium bg-navy-deep text-white">
        <div className="container-premium">
          <h2 className="text-display-sm">Giá trị cốt lõi</h2>
          <div className="gold-line mt-4" />
          <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="border-t border-gold/40 pt-6">
                <h3 className="font-display text-xl text-gold">{v.title}</h3>
                <p className="mt-2 text-sm text-white/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-white">
        <div className="container-premium text-center">
          <h2 className="text-display-sm text-navy">Thành tựu nổi bật</h2>
          <div className="gold-line mx-auto mt-4" />
          <ul className="mx-auto mt-8 grid max-w-2xl gap-4 text-left">
            {achievements.map((a) => (
              <li key={a} className="flex gap-3 text-muted">
                <span className="text-gold">◆</span> {a}
              </li>
            ))}
          </ul>
          <Button variant="gold" className="mt-10" asChild>
            <Link href="/dat-lich">Đặt lịch tư vấn</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
