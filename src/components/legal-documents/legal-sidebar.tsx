"use client";

import { cn } from "@/lib/utils";
import type { TaxonomyItem } from "@/lib/legal-documents/types";

type Props = {
  title: string;
  items: TaxonomyItem[];
  counts: Record<string, number>;
  activeId?: string;
  onSelect: (id?: string) => void;
};

export function LegalSidebar({ title, items, counts, activeId, onSelect }: Props) {
  return (
    <aside className="card-luxury overflow-hidden">
      <div className="border-b border-navy/[0.06] bg-navy px-4 py-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {title}
        </h2>
      </div>
      <ul className="max-h-[28rem] overflow-y-auto p-2">
        <li>
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className={cn(
              "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition",
              !activeId
                ? "bg-gold/10 font-medium text-navy"
                : "text-muted hover:bg-surface hover:text-navy"
            )}
          >
            <span>Tất cả</span>
          </button>
        </li>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition",
                activeId === item.id
                  ? "bg-gold/10 font-medium text-navy"
                  : "text-muted hover:bg-surface hover:text-navy"
              )}
            >
              <span>{item.label}</span>
              <span className="ml-2 shrink-0 text-xs text-muted">
                ({counts[item.id] ?? 0})
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
