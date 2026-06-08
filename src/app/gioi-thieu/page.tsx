import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { FadeIn } from "@/components/motion";
import {
  achievements,
  companyHistory,
  companyIntro,
  values,
  whyUs,
} from "@/lib/data";
import { Button } from "@/components/ui/button";

export const metadata = createMetadata({
  title: "Giới thiệu",
  description:
    "JUZ LEGAL – Chuẩn mực pháp lý quốc tế. Đối tác chiến lược tư vấn pháp lý chuyên sâu cho doanh nghiệp và cá nhân tại Việt Nam.",
  path: "/gioi-thieu",
});

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="Về chúng tôi"
        title={companyIntro.title}
        subtitle="Đối tác chiến lược, người đồng hành tin cậy trên hành trình bảo vệ quyền lợi hợp pháp của bạn tại Việt Nam."
        image="about"
      />

      <section className="section-premium bg-ivory">
        <div className="container-narrow space-y-6">
          <FadeIn>
            <p className="text-lg leading-relaxed text-muted">{companyIntro.lead}</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="text-base leading-relaxed text-muted">{companyIntro.experience}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {companyIntro.serviceHighlights.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.04}>
                <div className="card-luxury h-full p-6">
                  <span className="font-display text-2xl font-light text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg text-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-navy-deep text-white">
        <div className="container-premium">
          <h2 className="text-display-sm">{companyIntro.whyChooseTitle}</h2>
          <blockquote className="mt-6 max-w-3xl border-l-2 border-gold pl-6 font-display text-xl italic leading-relaxed text-gold-light sm:text-2xl">
            &ldquo;{companyIntro.quote}&rdquo;
          </blockquote>
          <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="border-t border-gold/40 pt-6">
                <h3 className="font-display text-lg text-gold">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-ivory">
        <div className="container-narrow">
          <FadeIn>
            <p className="text-lg leading-relaxed text-muted">{companyIntro.closing}</p>
          </FadeIn>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="gold" asChild>
              <Link href="/dat-lich">Đặt lịch tư vấn</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/lien-he">Liên hệ ngay</Link>
            </Button>
          </div>
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
              <p className="mt-4 leading-relaxed text-muted">
                Trở thành hãng luật hàng đầu khu vực — được tin tưởng bởi doanh nghiệp và
                nhà đầu tư trong hành trình phát triển bền vững tại Việt Nam và ASEAN.
              </p>
            </div>
            <div>
              <h2 className="text-display-sm text-navy">Sứ mệnh</h2>
              <p className="mt-4 leading-relaxed text-muted">
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
        </div>
      </section>
    </>
  );
}
