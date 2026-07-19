"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageBanner } from "@/components/sections/page-banner";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/data";
import { FadeIn } from "@/components/motion";

export default function BlogPage() {
  const [q, setQ] = useState("");
  const featured = blogPosts.find((p) => p.featured);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return blogPosts;
    return blogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <>
      <PageBanner
        eyebrow="Insights"
        title="Tin tức pháp lý"
        subtitle="Phân tích chuyên sâu và cập nhật văn bản — hỗ trợ ra quyết định đúng đắn."
        image="insights"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <label htmlFor="blog-search" className="sr-only">
              Tìm bài viết pháp lý
            </label>
            <Input
              id="blog-search"
              type="search"
              aria-label="Tìm bài viết pháp lý"
              placeholder="Tìm bài viết..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
            />
          </div>

          {featured && !q && (
            <FadeIn className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                Nổi bật
              </p>
              <Link
                href={`/tin-tuc/${featured.slug}`}
                className="card-luxury mt-6 block p-6 transition sm:mt-8 sm:p-8 md:p-10"
              >
                <span className="text-eyebrow text-[10px]">{featured.category}</span>
                <h2 className="mt-3 font-display text-2xl text-navy sm:mt-4 sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-muted">{featured.excerpt}</p>
              </Link>
            </FadeIn>
          )}

          <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/tin-tuc/${post.slug}`}
                className="card-luxury block p-5 transition sm:p-7"
              >
                <span className="text-eyebrow text-[10px]">{post.category}</span>
                <h3 className="mt-3 font-display text-xl text-navy">{post.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted">
                  {post.date} · {post.readTime}
                </p>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-8 text-muted">Không tìm thấy bài viết phù hợp.</p>
          )}
        </div>
      </section>
    </>
  );
}
