import type { Metadata } from "next";
import { siteConfig } from "./site";

type MetaOpts = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  noIndex = false,
}: MetaOpts): Metadata {
  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    icons: {
      icon: siteConfig.logo,
      apple: siteConfig.logo,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: path || "/" },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
