"use client";

import { useMemo, useState } from "react";
import { PageBanner } from "@/components/sections/page-banner";
import { LegalSearchPanel } from "@/components/legal-documents/legal-search-panel";
import { LegalSidebar } from "@/components/legal-documents/legal-sidebar";
import { LegalDocumentTable } from "@/components/legal-documents/legal-document-table";
import {
  legalDocuments,
  documentTypes,
  legalFields,
  filterLegalDocuments,
  countDocumentsByType,
  countDocumentsByField,
} from "@/lib/legal-documents";
import type {
  DocumentListMode,
  LegalDocumentFilters,
} from "@/lib/legal-documents/types";
import { cn } from "@/lib/utils";

const listTabs: { id: DocumentListMode; label: string }[] = [
  { id: "all", label: "Tất cả văn bản" },
  { id: "new", label: "Văn bản mới" },
  { id: "effective", label: "Hiệu lực trong tháng" },
  { id: "expired", label: "Hết hiệu lực trong tháng" },
];

export default function LegalLibraryPage() {
  const [filters, setFilters] = useState<LegalDocumentFilters>({
    q: "",
    matchMode: "all",
    searchIn: "all",
    listMode: "all",
    advancedOpen: false,
  });
  const [sidebarMode, setSidebarMode] = useState<"type" | "field">("type");
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const typeCounts = useMemo(
    () => countDocumentsByType(legalDocuments),
    []
  );
  const fieldCounts = useMemo(
    () => countDocumentsByField(legalDocuments),
    []
  );

  const results = useMemo(
    () => filterLegalDocuments(legalDocuments, appliedFilters),
    [appliedFilters]
  );

  function applyFilters(next = filters) {
    setAppliedFilters(next);
  }

  function handleSidebarSelect(id?: string) {
    const next =
      sidebarMode === "type"
        ? { ...appliedFilters, docType: id, field: undefined }
        : { ...appliedFilters, field: id, docType: undefined };
    setFilters(next);
    setAppliedFilters(next);
  }

  const activeSidebarId =
    sidebarMode === "type" ? appliedFilters.docType : appliedFilters.field;

  return (
    <>
      <PageBanner
        eyebrow="CSDL Văn bản pháp luật"
        title="Tra cứu văn bản quy phạm pháp luật"
        subtitle="Tìm kiếm theo số hiệu, trích yếu, loại văn bản, cơ quan ban hành, lĩnh vực và tình trạng hiệu lực — theo mô hình vbpl.vn."
        image="insights"
      />

      <section className="section-premium bg-ivory">
        <div className="container-premium space-y-8">
          <LegalSearchPanel
            filters={filters}
            onChange={setFilters}
            onSubmit={() => applyFilters(filters)}
          />

          <div className="grid gap-6 xl:grid-cols-[18rem_1fr]">
            <div className="space-y-4">
              <div className="flex rounded-sm border border-navy/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setSidebarMode("type")}
                  className={cn(
                    "flex-1 rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition",
                    sidebarMode === "type"
                      ? "bg-navy text-white"
                      : "text-muted hover:text-navy"
                  )}
                >
                  Loại VB
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarMode("field")}
                  className={cn(
                    "flex-1 rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition",
                    sidebarMode === "field"
                      ? "bg-navy text-white"
                      : "text-muted hover:text-navy"
                  )}
                >
                  Lĩnh vực
                </button>
              </div>

              <LegalSidebar
                title={sidebarMode === "type" ? "Loại văn bản" : "Lĩnh vực"}
                items={sidebarMode === "type" ? documentTypes : legalFields}
                counts={sidebarMode === "type" ? typeCounts : fieldCounts}
                activeId={activeSidebarId}
                onSelect={handleSidebarSelect}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {listTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      const next = { ...appliedFilters, listMode: tab.id };
                      setFilters(next);
                      setAppliedFilters(next);
                    }}
                    className={cn(
                      "rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition",
                      appliedFilters.listMode === tab.id
                        ? "border-gold bg-gold/10 text-navy"
                        : "border-navy/10 bg-white text-muted hover:border-gold/40 hover:text-navy"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <p className="text-sm text-muted">
                Tìm thấy <strong className="text-navy">{results.length}</strong> văn bản
              </p>

              <LegalDocumentTable documents={results} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
