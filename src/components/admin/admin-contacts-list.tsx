"use client";

import Link from "next/link";
import type { ContactMessage } from "@/lib/supabase/types";
import { formatContactStatus } from "@/lib/auth-utils";
import { StatusSelect } from "@/components/admin/status-select";
import { StatusBadge } from "@/components/admin/status-badge";

const CONTACT_STATUSES = [
  { value: "new", label: "Mới" },
  { value: "read", label: "Đã đọc" },
  { value: "replied", label: "Đã phản hồi" },
] as const;

type AdminContactsListProps = {
  contacts: ContactMessage[];
  compact?: boolean;
  showViewAll?: boolean;
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminContactsList({
  contacts,
  compact = false,
  showViewAll = false,
}: AdminContactsListProps) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-xl text-navy">Liên hệ khách hàng</h3>
        {showViewAll ? (
          <Link
            href="/admin/lien-he"
            className="text-xs uppercase tracking-wider text-gold transition hover:text-navy"
          >
            Xem tất cả →
          </Link>
        ) : null}
      </div>

      {contacts.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Chưa có tin nhắn liên hệ.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy/5">
          {contacts.map((c) => (
            <li
              key={c.id}
              className={compact ? "py-3" : "grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start"}
            >
              <div className="min-w-0 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-navy">{c.name}</p>
                  <StatusBadge
                    label={formatContactStatus(c.status)}
                    status={c.status}
                    type="contact"
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{formatCreatedAt(c.created_at)}</p>
                <p
                  className={
                    compact
                      ? "mt-1 line-clamp-2 text-muted"
                      : "mt-2 whitespace-pre-wrap text-muted"
                  }
                >
                  {c.message}
                </p>
                <p className="mt-1 text-muted">
                  <a href={`tel:${c.phone}`} className="hover:text-navy">
                    {c.phone}
                  </a>
                  {c.email ? (
                    <>
                      {" "}
                      ·{" "}
                      <a href={`mailto:${c.email}`} className="hover:text-navy">
                        {c.email}
                      </a>
                    </>
                  ) : null}
                </p>
                {!compact && c.service_label ? (
                  <p className="mt-1 text-muted">
                    Dịch vụ quan tâm:{" "}
                    <span className="text-navy">{c.service_label}</span>
                  </p>
                ) : null}
              </div>
              <StatusSelect
                id={c.id}
                value={c.status}
                options={[...CONTACT_STATUSES]}
                apiPath={`/api/admin/contacts/${c.id}`}
                className={compact ? "mt-2 w-full sm:w-40" : "w-full sm:w-44"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
