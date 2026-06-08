import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingConsultButton } from "@/components/floating-consult-button";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

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

export const metadata: Metadata = createMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
});

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.name,
    description: siteConfig.description,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="font-sans">
        <GoogleAnalytics />
        <Providers>
          <JsonLd />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
          >
            Chuyển tới nội dung chính
          </a>
          <Header />
          <main id="main-content" className="page-content min-w-0">
            {children}
          </main>
          <Footer />
          <FloatingConsultButton />
        </Providers>
      </body>
    </html>
  );
}
