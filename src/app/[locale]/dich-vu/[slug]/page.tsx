import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactForm } from "@/components/sections/contact-form";
import { ServiceIcon } from "@/components/icons";
import { routing } from "@/i18n/routing";
import { getPageData } from "@/lib/i18n-page";
import { services } from "@/lib/data";

type Props = { params: Promise<{ locale: string; slug: string }> };

const sectionLabels = {
  vi: {
    items: "Hạng mục hỗ trợ",
    process: "Quy trình thực hiện",
    step: "Bước",
    contact: "Liên hệ tư vấn",
  },
  en: {
    items: "Scope of support",
    process: "Our process",
    step: "Step",
    contact: "Request consultation",
  },
  zh: {
    items: "服务内容",
    process: "服务流程",
    step: "步骤",
    contact: "咨询联系",
  },
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const { data } = await getPageData();
  const s = data.getService(slug);
  if (!s) return {};
  return createMetadata({
    title: s.title,
    description: s.short,
    path: `/dich-vu/${s.slug}`,
    locale,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { data } = await getPageData();
  const s = data.getService(slug);
  if (!s) notFound();

  const labels =
    sectionLabels[locale as keyof typeof sectionLabels] ?? sectionLabels.vi;

  return (
    <>
      <PageBanner title={s.title} subtitle={s.short} image="services" />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="min-w-0 lg:col-span-2">
              <div className="flex items-start gap-4">
                <ServiceIcon name={s.icon} className="h-10 w-10 text-gold" />
                <p className="text-lg leading-relaxed text-muted">{s.intro}</p>
              </div>
              <h2 className="mt-14 font-display text-2xl text-navy">{labels.items}</h2>
              <div className="gold-line mt-3" />
              <ul className="mt-6 space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <span className="text-gold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <h2 className="mt-14 font-display text-2xl text-navy">{labels.process}</h2>
              <div className="gold-line mt-3" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {s.process.map((p) => (
                  <div key={p.step} className="card-luxury p-6">
                    <span className="font-serif text-gold">
                      {labels.step} {p.step}
                    </span>
                    <h3 className="mt-1 font-medium">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-luxury p-6 sm:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-xl text-navy">{labels.contact}</h3>
              <div className="mt-6">
                <ContactForm serviceLabel={s.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FaqSection items={s.faq} />
    </>
  );
}
