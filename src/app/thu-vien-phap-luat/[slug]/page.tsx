import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import {
  getLibraryItem,
  libraryItems,
  getLibraryItemsByCategory,
} from "@/lib/data";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return libraryItems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) return {};
  return createMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/thu-vien-phap-luat/${item.slug}`,
  });
}

export default async function LibraryItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) notFound();

  const related =
    getLibraryItemsByCategory(item.category)
      .filter((p) => p.slug !== slug)
      .slice(0, 2) ?? [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: "vi-VN",
    mainEntityOfPage: `${siteConfig.url}/thu-vien-phap-luat/${item.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replaceAll("<", "\\u003c"),
        }}
      />
      <PageBanner title={item.title} subtitle={item.excerpt} image="insights" tall={false} />
      <article className="section-premium bg-ivory">
        <div className="container-narrow">
          <p className="text-sm text-muted">
            {item.category} · {item.date} · {item.readTime}
          </p>
          <div className="prose prose-navy mt-8 max-w-none">
            {item.content.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="mb-4 leading-relaxed text-muted"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="section-premium border-t border-navy/[0.06] bg-white">
          <div className="container-premium">
            <h2 className="text-display-sm text-navy">Tài liệu liên quan</h2>
            <div className="gold-line mt-4" />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/thu-vien-phap-luat/${p.slug}`}
                  className="card-luxury block p-7 transition"
                >
                  <h3 className="font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

