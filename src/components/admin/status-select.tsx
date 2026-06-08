"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type StatusSelectProps = {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  apiPath: string;
  className?: string;
};

export function StatusSelect({
  id,
  value,
  options,
  apiPath,
  className,
}: StatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleChange(next: string) {
    const previous = status;
    setStatus(next);
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Cập nhật thất bại.");
      }

      if (next === "confirmed" && data.zalo?.ok) {
        setNotice("Đã gửi Zalo xác nhận cho khách hàng.");
      } else if (next === "confirmed" && data.zalo && !data.zalo.skipped && !data.zalo.ok) {
        setNotice("Đã xác nhận nhưng gửi Zalo thất bại — kiểm tra cấu hình.");
      }

      router.refresh();
    } catch (err) {
      setStatus(previous);
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        aria-label={`Trạng thái ${id}`}
        className="rounded border border-navy/15 bg-white px-2 py-1.5 text-xs text-navy transition focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-[10px] text-red-600">{error}</p> : null}
      {notice ? <p className="text-[10px] text-emerald-700">{notice}</p> : null}
    </div>
  );
}
