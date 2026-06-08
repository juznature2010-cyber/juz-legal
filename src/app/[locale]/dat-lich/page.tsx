import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { BookingForm } from "@/components/sections/booking-form";
import { getPageMeta } from "@/lib/i18n-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { t } = await getPageMeta("pages.book");
  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: "/dat-lich",
    locale,
  });
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t } = await getPageMeta("booking");

  return (
    <>
      <PageBanner
        eyebrow={t("title")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="contact"
      />
      <section className="section-premium bg-ivory">
        <div className="container-narrow">
          <div className="card-luxury p-5 sm:p-8 md:p-10">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
