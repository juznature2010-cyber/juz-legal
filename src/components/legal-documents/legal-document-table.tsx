import Link from "next/link";
import type { LegalDocument } from "@/lib/legal-documents/types";
import {
  getDocumentTypeLabel,
  getFieldLabel,
} from "@/lib/legal-documents/taxonomy";
import { formatLegalDate } from "@/lib/legal-documents/format";
import { LegalStatusBadge } from "@/components/legal-documents/legal-status-badge";

export function LegalDocumentTable({ documents }: { documents: LegalDocument[] }) {
  if (documents.length === 0) {
    return (
      <div className="card-luxury p-8 text-center text-muted">
        Không tìm thấy văn bản phù hợp với điều kiện tìm kiếm.
      </div>
    );
  }

  return (
    <div className="card-luxury overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-navy/[0.06] bg-surface/80 text-[11px] uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">STT</th>
              <th className="px-4 py-3 font-semibold">Số hiệu</th>
              <th className="px-4 py-3 font-semibold">Trích yếu</th>
              <th className="px-4 py-3 font-semibold">Loại</th>
              <th className="px-4 py-3 font-semibold">Ngày ban hành</th>
              <th className="px-4 py-3 font-semibold">Hiệu lực</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr
                key={doc.slug}
                className="border-b border-navy/[0.05] transition hover:bg-gold/[0.03]"
              >
                <td className="px-4 py-4 text-muted">{index + 1}</td>
                <td className="px-4 py-4 font-medium text-navy">{doc.number}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/thu-vien-phap-luat/${doc.slug}`}
                    className="font-medium text-navy transition hover:text-gold"
                  >
                    {doc.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{getFieldLabel(doc.field)}</p>
                </td>
                <td className="px-4 py-4 text-muted">
                  {getDocumentTypeLabel(doc.docType)}
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatLegalDate(doc.issuedDate)}
                </td>
                <td className="px-4 py-4">
                  <LegalStatusBadge status={doc.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-navy/[0.06] md:hidden">
        {documents.map((doc, index) => (
          <Link
            key={doc.slug}
            href={`/thu-vien-phap-luat/${doc.slug}`}
            className="block p-4 transition hover:bg-gold/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                {index + 1}. {doc.number}
              </p>
              <LegalStatusBadge status={doc.status} />
            </div>
            <h3 className="mt-2 font-display text-lg text-navy">{doc.title}</h3>
            <p className="mt-2 text-xs text-muted">
              {getDocumentTypeLabel(doc.docType)} · {formatLegalDate(doc.issuedDate)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
