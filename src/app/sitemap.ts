import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { blogPosts, services } from "@/lib/data";
import { routing } from "@/i18n/routing";

const staticPaths = [
  "",
  "/gioi-thieu",
  "/dich-vu",
  "/doi-ngu",
  "/tin-tuc",
  "/dat-lich",
  "/lien-he",
];

function localizedPath(locale: string, path: string) {
  if (locale === routing.defaultLocale) return path || "/";
  return path ? `/${locale}${path}` : `/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );

  const serviceRoutes = routing.locales.flatMap((locale) =>
    services.map((s) => ({
      url: `${base}${localizedPath(locale, `/dich-vu/${s.slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const blogRoutes = routing.locales.flatMap((locale) =>
    blogPosts.map((p) => ({
      url: `${base}${localizedPath(locale, `/tin-tuc/${p.slug}`)}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
