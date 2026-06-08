import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { ServiceIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { getPageData, getPageMeta } from "@/lib/i18n-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { t } = await getPageMeta("pages.services");
  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: "/dich-vu",
    locale,
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { data } = await getPageData();
  const { t } = await getPageMeta("pages.services");
  const { t: tNav } = await getPageMeta("nav");

  return (
    <>
      <PageBanner
        eyebrow={tNav("services")}
        title={t("title")}
        subtitle={t("description")}
        image="services"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-px bg-navy/[0.06] md:grid-cols-2">
            {data.services.map((s) => (
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
