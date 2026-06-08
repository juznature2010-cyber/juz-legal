import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { ContactForm } from "@/components/sections/contact-form";
import { siteConfig } from "@/lib/site";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getPageMeta } from "@/lib/i18n-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { t } = await getPageMeta("pages.contactPage");
  return createMetadata({
    title: t("title"),
    description: t("description"),
    path: "/lien-he",
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t } = await getPageMeta("contact");
  const { t: tNav } = await getPageMeta("nav");
  const { t: tSite } = await getPageMeta("site");

  return (
    <>
      <PageBanner
        eyebrow={tNav("contact")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="contact"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">{t("address")}</p>
                  <p className="text-muted">{siteConfig.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-muted hover:text-gold">
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-muted hover:text-gold">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">{t("hours")}</p>
                  <p className="text-muted">{tSite("workingHours")}</p>
                </div>
              </div>
            </div>
            <div className="card-luxury p-5 sm:p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
