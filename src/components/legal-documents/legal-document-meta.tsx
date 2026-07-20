import type { LegalDocument } from "@/lib/legal-documents/types";
import {
  getDocumentTypeLabel,
  getFieldLabel,
  getIssuerLabel,
} from "@/lib/legal-documents/taxonomy";
import { formatLegalDate } from "@/lib/legal-documents/format";
import { LegalStatusBadge } from "@/components/legal-documents/legal-status-badge";

export function LegalDocumentMeta({ document }: { document: LegalDocument }) {
  const rows = [
    { label: "Số hiệu", value: document.number },
    { label: "Loại văn bản", value: getDocumentTypeLabel(document.docType) },
    { label: "Trích yếu", value: document.title },
    { label: "Cơ quan ban hành", value: getIssuerLabel(document.issuer) },
    { label: "Lĩnh vực", value: getFieldLabel(document.field) },
    { label: "Ngày ban hành", value: formatLegalDate(document.issuedDate) },
    { label: "Ngày hiệu lực", value: formatLegalDate(document.effectiveDate) },
    { label: "Ngày hết hiệu lực", value: formatLegalDate(document.expiredDate) },
    { label: "Người ký", value: document.signer ?? "—" },
  ];

  return (
    <div className="card-luxury overflow-hidden">
      <div className="border-b border-navy/[0.06] bg-navy px-4 py-3 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          Thông tin văn bản
        </p>
      </div>
      <dl className="divide-y divide-navy/[0.06]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4 sm:px-6"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {row.label}
            </dt>
            <dd className="text-sm text-navy">{row.value}</dd>
          </div>
        ))}
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4 sm:px-6">
          <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Tình trạng hiệu lực
          </dt>
          <dd>
            <LegalStatusBadge status={document.status} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
