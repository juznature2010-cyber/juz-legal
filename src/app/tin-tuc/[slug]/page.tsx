import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { blogPosts, getBlogPost } from "@/lib/data";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/tin-tuc/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "vi-VN",
    mainEntityOfPage: `${siteConfig.url}/tin-tuc/${post.slug}`,
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
      <PageBanner title={post.title} subtitle={post.excerpt} image="insights" tall={false} />
      <article className="section-premium bg-ivory">
        <div className="container-narrow">
          <p className="text-sm text-muted">
            {post.category} · {post.date} · {post.readTime}
          </p>
          <div className="prose prose-navy mt-8 max-w-none">
            {post.content.map((para) => (
              <p key={para.slice(0, 24)} className="mb-4 leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="section-premium border-t border-navy/[0.06] bg-white">
          <div className="container-premium">
            <h2 className="text-display-sm text-navy">Bài viết liên quan</h2>
            <div className="gold-line mt-4" />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/tin-tuc/${p.slug}`}
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
