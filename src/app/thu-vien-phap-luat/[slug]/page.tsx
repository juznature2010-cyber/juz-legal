import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { LegalDocumentMeta } from "@/components/legal-documents/legal-document-meta";
import { LegalDocumentContent } from "@/components/legal-documents/legal-document-content";
import { LegalDocumentTable } from "@/components/legal-documents/legal-document-table";
import { legalDocuments, getLegalDocumentBySlug } from "@/lib/legal-documents/documents";
import { getRelatedDocuments } from "@/lib/legal-documents/search";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);
  if (!document) return {};
  return createMetadata({
    title: document.title,
    description: `${document.number} — ${document.title}`,
    path: `/thu-vien-phap-luat/${document.slug}`,
  });
}

export default async function LegalDocumentPage({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);
  if (!document) notFound();

  const related = getRelatedDocuments(document, legalDocuments);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: document.title,
    legislationIdentifier: document.number,
    datePublished: document.issuedDate,
    inLanguage: "vi-VN",
    url: `${siteConfig.url}/thu-vien-phap-luat/${document.slug}`,
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
          __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
        }}
      />
      <PageBanner
        eyebrow={document.number}
        title={document.title}
        subtitle="Tra cứu thông tin và nội dung trích yếu văn bản quy phạm pháp luật"
        image="insights"
        tall={false}
      />

      <section className="section-premium bg-ivory">
        <div className="container-premium space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/thu-vien-phap-luat"
              className="text-sm font-medium text-navy transition hover:text-gold"
            >
              ← Quay lại tra cứu
            </Link>
            {document.sourceUrl && (
              <a
                href={document.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-navy"
              >
                Xem trên vbpl.vn
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <LegalDocumentMeta document={document} />
          <LegalDocumentContent sections={document.sections} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-premium border-t border-navy/[0.06] bg-white">
          <div className="container-premium">
            <h2 className="text-display-sm text-navy">Văn bản liên quan</h2>
            <div className="gold-line mt-4" />
            <div className="mt-8">
              <LegalDocumentTable documents={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
