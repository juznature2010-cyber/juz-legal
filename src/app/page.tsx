import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { ServiceIcon } from "@/components/icons";
import { TeamPortrait } from "@/components/team-portrait";
import { HeroCinematic } from "@/components/sections/hero-cinematic";
import { SectionHeading } from "@/components/sections/section-heading";
import { TestimonialsSlider } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { BookingForm } from "@/components/sections/booking-form";
import { ContactForm } from "@/components/sections/contact-form";
import {
  practiceAreas,
  whyUs,
  workProcess,
  team,
  clients,
  blogPosts,
  homeFaq,
  companyIntro,
} from "@/lib/data";
import { images } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HeroCinematic />

      <section id="intro" className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-24">
            <div className="relative aspect-[3/4] max-h-[420px] overflow-hidden sm:aspect-[4/5] sm:max-h-none lg:max-h-none">
              <Image
                src={images.about}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-navy/20" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-navy-deep/80 to-transparent" />
            </div>
            <div>
              <SectionHeading
                eyebrow="Giới thiệu"
                title={companyIntro.title}
                subtitle="Đối tác chiến lược, người đồng hành tin cậy trên hành trình chinh phục thành công và bảo vệ quyền lợi hợp pháp của bạn tại Việt Nam."
              />
              <p className="mt-8 text-base leading-relaxed text-muted">
                {companyIntro.lead}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {companyIntro.experience}
              </p>
              <Button variant="outline" className="mt-10" asChild>
                <Link href="/gioi-thieu">
                  Về chúng tôi <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-premium border-y border-navy/[0.04] bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Thực hành"
            title="Lĩnh vực hoạt động"
            subtitle="Bảy nhóm dịch vụ pháp lý trọng tâm — kiến thức chuyên sâu và phương pháp tiếp cận thống nhất."
            align="center"
          />
          <Stagger className="mt-10 grid gap-px bg-navy/[0.06] sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {practiceAreas.map((a) => (
              <StaggerItem key={a.slug}>
                <Link
                  href={`/dich-vu/${a.slug}`}
                  className="group flex h-full flex-col bg-white p-5 transition-colors duration-500 hover:bg-ivory sm:p-6 md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <ServiceIcon
                      name={a.icon}
                      className="h-7 w-7 text-gold transition duration-500 group-hover:scale-110"
                    />
                    <ArrowUpRight className="h-4 w-4 text-navy/20 transition group-hover:text-gold" />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-navy transition group-hover:text-gold sm:mt-8 sm:text-xl">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{a.short}</p>
                  <span className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold opacity-0 transition group-hover:opacity-100">
                    Khám phá
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative section-premium overflow-hidden bg-navy-deep text-white">
        <Image
          src={images.services}
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="overlay-banner absolute inset-0" />
        <div className="container-premium relative z-10">
          <SectionHeading
            eyebrow="Lợi thế"
            title="Tại sao chọn JUZ Legal"
            dark
            align="center"
          />
          <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:mt-16 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.06}>
                <div className="border-t border-gold/40 pt-6">
                  <span className="font-display text-3xl font-light text-gold/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Quy trình"
            title="Cách chúng tôi làm việc"
            subtitle="Minh bạch từng giai đoạn — từ tiếp nhận đến hoàn tất và hậu kỳ."
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-5 lg:gap-8">
            {workProcess.map((p, i) => (
              <FadeIn key={p.step} delay={i * 0.05}>
                <div className="card-luxury h-full p-5 sm:p-6">
                  <span className="font-display text-4xl font-light text-gold">{p.step}</span>
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="flex flex-col gap-4 border-b border-navy/[0.06] pb-6 sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Đội ngũ" title="Luật sư & cố vấn" />
            <Link
              href="/doi-ngu"
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold transition hover:text-navy sm:text-[11px] sm:tracking-[0.2em]"
            >
              Xem toàn bộ đội ngũ →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {team.map((m, i) => (
              <FadeIn key={m.slug} delay={i * 0.05}>
                <article className="group overflow-hidden">
                  <TeamPortrait
                    name={m.name}
                    className="transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="border-l-2 border-gold/0 py-5 pl-0 transition group-hover:border-gold group-hover:pl-4">
                    <h3 className="font-display text-xl text-navy">{m.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-gold">
                      {m.role}
                    </p>
                    <p className="mt-2 text-xs text-muted">{m.specialty}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/[0.04] bg-navy-deep py-10 sm:py-14">
        <div className="container-premium">
          <p className="text-center text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px] sm:tracking-[0.35em]">
            Khách hàng tiêu biểu
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-10 sm:gap-x-12 sm:gap-y-5 md:gap-x-16">
            {clients.map((c) => (
              <span
                key={c}
                className="font-display text-sm font-light tracking-wide text-white/25 sm:text-base md:text-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSlider />

      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Insights" title="Tin tức pháp lý" />
            <Link
              href="/tin-tuc"
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold sm:text-[11px] sm:tracking-[0.2em]"
            >
              Tất cả bài viết →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.06}>
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  className="group block overflow-hidden card-luxury"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-mid">
                    <Image
                      src={images.insights}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-navy/40 transition group-hover:bg-navy/25" />
                  </div>
                  <div className="p-5 sm:p-7">
                    <span className="text-eyebrow text-[10px]">{post.category}</span>
                    <h3 className="mt-2 font-display text-lg leading-snug text-navy transition group-hover:text-gold sm:mt-3 sm:text-xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative section-premium overflow-hidden bg-navy-deep" id="dat-lich">
        <Image src={images.contact} alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="overlay-banner absolute inset-0" />
        <div className="container-premium relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <SectionHeading
              eyebrow="Tư vấn"
              title="Đặt lịch trực tuyến"
              subtitle="Chọn dịch vụ, luật sư và khung giờ — xác nhận trong vòng 2 giờ làm việc."
              dark
            />
            <FadeIn delay={0.1}>
              <div className="border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-8 md:p-10 [&_label]:text-white/90 [&_select]:border-white/20 [&_select]:bg-white/95">
                <BookingForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-premium bg-white" id="lien-he">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Liên hệ"
                title="Kết nối với JUZ Legal"
                subtitle="Chúng tôi sẵn sàng lắng nghe và phản hồi sớm nhất."
              />
              <ul className="mt-6 space-y-3 text-sm text-muted sm:mt-10 sm:space-y-4">
                <li>{siteConfig.address}</li>
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-gold">
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-gold">
                    {siteConfig.email}
                  </a>
                </li>
                <li>{siteConfig.workingHours}</li>
              </ul>
            </div>
            <div className="card-luxury p-5 sm:p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={homeFaq} />
    </>
  );
}
