"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  documentTypes,
  issuers,
  legalFields,
  documentStatusLabels,
} from "@/lib/legal-documents/taxonomy";
import { legalDocuments } from "@/lib/legal-documents/documents";
import { getIssueYears } from "@/lib/legal-documents/search";
import type {
  DocumentStatus,
  LegalDocumentFilters,
  SearchInField,
  SearchMatchMode,
} from "@/lib/legal-documents/types";
import { cn } from "@/lib/utils";

type Props = {
  filters: LegalDocumentFilters;
  onChange: (filters: LegalDocumentFilters) => void;
  onSubmit: () => void;
};

const searchInOptions: { value: SearchInField; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "number", label: "Số hiệu" },
  { value: "summary", label: "Trích yếu" },
];

const matchModeOptions: { value: SearchMatchMode; label: string }[] = [
  { value: "all", label: "Có tất cả từ trên" },
  { value: "exact", label: "Chính xác cụm từ trên" },
];

export function LegalSearchPanel({ filters, onChange, onSubmit }: Props) {
  const years = getIssueYears(legalDocuments);
  const advancedOpen = filters.advancedOpen ?? false;

  function update(partial: Partial<LegalDocumentFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="card-luxury overflow-hidden">
      <div className="border-b border-navy/[0.06] bg-navy px-4 py-3 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          Tìm kiếm văn bản
        </p>
      </div>

      <form
        className="space-y-4 p-4 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <label htmlFor="legal-keyword" className="text-xs font-medium text-navy">
              Từ khóa tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                id="legal-keyword"
                type="search"
                value={filters.q ?? ""}
                onChange={(event) => update({ q: event.target.value })}
                placeholder="Ví dụ: Luật doanh nghiệp, 59/2020/QH14, đăng ký..."
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" variant="luxury" className="h-12 px-8">
            Tìm kiếm
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-navy">
              Cách thức tìm kiếm
            </legend>
            <div className="flex flex-wrap gap-3">
              {matchModeOptions.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted"
                >
                  <input
                    type="radio"
                    name="matchMode"
                    checked={(filters.matchMode ?? "all") === option.value}
                    onChange={() => update({ matchMode: option.value })}
                    className="accent-gold"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="search-in" className="mb-2 block text-xs font-medium text-navy">
              Tìm trong
            </label>
            <div className="relative">
              <select
                id="search-in"
                value={filters.searchIn ?? "all"}
                onChange={(event) =>
                  update({ searchIn: event.target.value as SearchInField })
                }
                className="h-12 w-full appearance-none border border-navy/10 bg-white/95 px-4 pr-10 text-sm focus-visible:border-gold/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/30"
              >
                {searchInOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => update({ advancedOpen: !advancedOpen })}
          className="inline-flex items-center gap-2 text-sm font-medium text-navy transition hover:text-gold"
          aria-expanded={advancedOpen}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Tìm kiếm nâng cao
        </button>

        <div
          className={cn(
            "grid gap-4 border-t border-navy/[0.06] pt-4 md:grid-cols-2 xl:grid-cols-4",
            advancedOpen ? "block" : "hidden"
          )}
        >
          <FilterSelect
            id="doc-type"
            label="Loại văn bản"
            value={filters.docType ?? ""}
            onChange={(value) => update({ docType: value || undefined })}
            options={documentTypes}
          />
          <FilterSelect
            id="issuer"
            label="Cơ quan ban hành"
            value={filters.issuer ?? ""}
            onChange={(value) => update({ issuer: value || undefined })}
            options={issuers}
          />
          <FilterSelect
            id="field"
            label="Lĩnh vực"
            value={filters.field ?? ""}
            onChange={(value) => update({ field: value || undefined })}
            options={legalFields}
          />
          <FilterSelect
            id="status"
            label="Tình trạng hiệu lực"
            value={filters.status ?? ""}
            onChange={(value) =>
              update({ status: (value || undefined) as DocumentStatus | undefined })
            }
            options={Object.entries(documentStatusLabels).map(([id, label]) => ({
              id,
              label,
            }))}
          />
          <FilterSelect
            id="year"
            label="Năm ban hành"
            value={filters.year ?? ""}
            onChange={(value) => update({ year: value || undefined })}
            options={years.map((year) => ({ id: year, label: year }))}
          />
        </div>
      </form>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-navy">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none border border-navy/10 bg-white/95 px-3 pr-9 text-sm focus-visible:border-gold/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/30"
        >
          <option value="">Tất cả</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
