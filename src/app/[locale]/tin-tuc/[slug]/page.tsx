import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPageData } from "@/lib/i18n-page";
import { blogPosts } from "@/lib/data";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogPosts.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const { data } = await getPageData();
  const post = data.getBlogPost(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/tin-tuc/${post.slug}`,
    locale,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { data } = await getPageData();
  const post = data.getBlogPost(slug);
  if (!post) notFound();

  const related = data.blogPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const relatedLabel =
    locale === "zh" ? "相关文章" : locale === "en" ? "Related articles" : "Bài viết liên quan";

  return (
    <>
      <PageBanner title={post.title} subtitle={post.excerpt} image="insights" tall={false} />
      <article className="section-premium bg-ivory">
        <div className="container-narrow">
          <p className="text-sm text-muted">
            {post.category} · {post.date} · {post.readTime}
          </p>
          <div className="prose-navy mt-8 space-y-6 text-base leading-relaxed text-muted">
            {post.content.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </article>
      {related.length > 0 ? (
        <section className="section-premium border-t border-navy/[0.06] bg-white">
          <div className="container-narrow">
            <h2 className="font-display text-2xl text-navy">{relatedLabel}</h2>
            <ul className="mt-6 space-y-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/tin-tuc/${p.slug}`} className="text-gold hover:text-navy">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
