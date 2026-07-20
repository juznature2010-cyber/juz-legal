import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/legal-documents/types";
import { getStatusLabel } from "@/lib/legal-documents/taxonomy";

const statusStyles: Record<DocumentStatus, string> = {
  "con-hieu-luc": "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  "het-hieu-luc": "bg-slate-500/10 text-slate-600 ring-slate-500/20",
  "chua-co-hieu-luc": "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  "sua-doi-bo-sung": "bg-sky-500/10 text-sky-700 ring-sky-500/20",
};

export function LegalStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset",
        statusStyles[status]
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
