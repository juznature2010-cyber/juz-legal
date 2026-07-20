"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SyncJob = {
  id: string;
  status: string;
  success_count: number;
  error_count: number;
  ai_model: string | null;
  completed_at: string | null;
  created_at?: string;
};

type QueueItem = {
  vbpl_item_id: string;
  status: string;
  last_error: string | null;
  source_url: string;
};

type Props = {
  aiConfigured: boolean;
  serviceRoleConfigured: boolean;
  stats: {
    documentCount: number;
    queuePending: number;
    lastJob: SyncJob | null;
  };
  jobs: SyncJob[];
  queue: QueueItem[];
};

export function VbplSyncPanel({
  aiConfigured,
  serviceRoleConfigured,
  stats,
  jobs,
  queue,
}: Props) {
  const [itemIds, setItemIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function queueItems() {
    const ids = itemIds
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter((value) => /^\d+$/.test(value));
    if (!ids.length) {
      setMessage("Nhập ít nhất một ItemID vbpl (số).");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/vbpl/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: ids }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Queue failed");
      setMessage(`Đã thêm ${payload.queued} văn bản vào hàng đợi.`);
      setItemIds("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Lỗi hàng đợi");
    } finally {
      setLoading(false);
    }
  }

  async function runSync(useAi: boolean) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/vbpl/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useAi, limit: 10 }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Sync failed");
      setMessage(
        `Đồng bộ xong: ${payload.success}/${payload.processed} thành công (${payload.aiModel}).`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Lỗi đồng bộ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Văn bản trong Supabase" value={String(stats.documentCount)} />
        <StatCard label="Hàng đợi chờ xử lý" value={String(stats.queuePending)} />
        <StatCard
          label="Job gần nhất"
          value={stats.lastJob?.status ?? "—"}
        />
      </div>

      {!serviceRoleConfigured && (
        <p className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
          Thiếu <code>SUPABASE_SERVICE_ROLE_KEY</code> — chưa thể ghi dữ liệu từ pipeline AI.
        </p>
      )}

      {!aiConfigured && (
        <p className="rounded-sm border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-900">
          Chưa cấu hình <code>AI_API_KEY</code> — đồng bộ sẽ dùng bộ trích xuất heuristic (kém chính xác hơn AI).
        </p>
      )}

      <div className="rounded-lg border border-navy/10 bg-white p-5 sm:p-6">
        <h3 className="font-serif text-xl text-navy">Thêm văn bản vbpl vào hàng đợi</h3>
        <p className="mt-2 text-sm text-muted">
          Lấy ItemID từ URL vbpl: <code>?ItemID=149086</code>
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            value={itemIds}
            onChange={(event) => setItemIds(event.target.value)}
            placeholder="149086, 149087, 149088"
          />
          <Button type="button" variant="outline" onClick={queueItems} disabled={loading}>
            Thêm hàng đợi
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="luxury"
          onClick={() => runSync(true)}
          disabled={loading || !serviceRoleConfigured}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Chạy đồng bộ AI
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => runSync(false)}
          disabled={loading || !serviceRoleConfigured}
        >
          Chạy heuristic (không AI)
        </Button>
      </div>

      {message && (
        <p className="rounded-sm border border-navy/10 bg-surface px-4 py-3 text-sm text-navy">
          {message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Lịch sử job">
          <ul className="space-y-2 text-sm">
            {jobs.map((job) => (
              <li key={job.id} className="rounded-sm border border-navy/10 px-3 py-2">
                <p className="font-medium text-navy">{job.status}</p>
                <p className="text-xs text-muted">
                  OK {job.success_count} · Lỗi {job.error_count} · {job.ai_model ?? "—"}
                </p>
              </li>
            ))}
            {!jobs.length && <li className="text-sm text-muted">Chưa có job nào.</li>}
          </ul>
        </Panel>

        <Panel title="Hàng đợi gần đây">
          <ul className="space-y-2 text-sm">
            {queue.map((item) => (
              <li key={item.vbpl_item_id} className="rounded-sm border border-navy/10 px-3 py-2">
                <p className="font-medium text-navy">ItemID {item.vbpl_item_id}</p>
                <p className="text-xs text-muted">{item.status}</p>
                {item.last_error && (
                  <p className="mt-1 text-xs text-red-600">{item.last_error}</p>
                )}
              </li>
            ))}
            {!queue.length && <li className="text-sm text-muted">Hàng đợi trống.</li>}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl text-navy">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5">
      <h3 className="font-serif text-lg text-navy">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
