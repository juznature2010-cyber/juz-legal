import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactForm } from "@/components/sections/contact-form";
import { ServiceIcon } from "@/components/icons";
import { getService, services } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return createMetadata({
    title: s.title,
    description: s.short,
    path: `/dich-vu/${s.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

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
              <h2 className="mt-14 font-display text-2xl text-navy">Hạng mục hỗ trợ</h2>
              <div className="gold-line mt-3" />
              <ul className="mt-6 space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <span className="text-gold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <h2 className="mt-14 font-display text-2xl text-navy">Quy trình thực hiện</h2>
              <div className="gold-line mt-3" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {s.process.map((p) => (
                  <div key={p.step} className="card-luxury p-6">
                    <span className="font-serif text-gold">Bước {p.step}</span>
                    <h3 className="mt-1 font-medium">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-luxury p-6 sm:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-xl text-navy">Liên hệ tư vấn</h3>
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
