import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingConsultButton } from "@/components/floating-consult-button";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Providers } from "@/components/providers";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { createMetadata } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return createMetadata({
    title: siteConfig.name,
    description: t("description"),
    path: "/",
    locale,
  });
}

function JsonLd({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.name,
    description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "VN",
    },
    areaServed: "Vietnam",
    priceRange: "$$",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });
  const siteT = await getTranslations({ locale, namespace: "site" });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="font-sans">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <JsonLd description={siteT("description")} />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
            >
              {t("skipToContent")}
            </a>
            <Header />
            <main id="main-content" className="page-content min-w-0">
              {children}
            </main>
            <Footer />
            <FloatingConsultButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
