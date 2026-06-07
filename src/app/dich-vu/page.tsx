import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/data";

export const metadata = createMetadata({
  title: "Dịch vụ pháp lý",
  description: "Dịch vụ pháp lý doanh nghiệp, đầu tư, tranh tụng, đất đai, lao động, SHTT, hôn nhân gia đình.",
  path: "/dich-vu",
});

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Dịch vụ"
        title="Dịch vụ pháp lý"
        subtitle="Giải pháp chuyên sâu cho từng lĩnh vực — tư vấn, soạn thảo và đại diện."
        image="services"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-px bg-navy/[0.06] md:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/dich-vu/${s.slug}`}
                className="group flex flex-col gap-4 bg-white p-6 transition duration-500 hover:bg-ivory sm:flex-row sm:gap-8 sm:p-8 md:p-10"
              >
                <ServiceIcon
                  name={s.icon}
                  className="h-8 w-8 shrink-0 text-gold sm:h-10 sm:w-10"
                />
                <div className="min-w-0">
                  <h2 className="font-display text-2xl text-navy transition group-hover:text-gold">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
