import { createAdminClient } from "@/lib/supabase/admin";
import {
  extractDocumentHeuristic,
  extractDocumentWithAi,
  isAiExtractionConfigured,
} from "@/lib/vbpl/ai-extractor";
import {
  DEFAULT_VBPL_ITEM_IDS,
  VBPL_MAX_SYNC_ATTEMPTS,
  getVbplAutoSyncLimit,
  getVbplRefreshDays,
} from "@/lib/vbpl/config";
import { discoverVbplItemIds } from "@/lib/vbpl/discover";
import { fetchVbplHtml, buildVbplDocumentUrl } from "@/lib/vbpl/fetch";
import { upsertExtractedDocument } from "@/lib/vbpl/repository";

export type SyncLogEntry = {
  vbplItemId: string;
  status: "success" | "error";
  message: string;
  slug?: string;
};

export type SyncJobResult = {
  jobId: string;
  processed: number;
  success: number;
  errors: number;
  logs: SyncLogEntry[];
  aiModel?: string;
};

export type AutoSyncResult = SyncJobResult & {
  discovered: number;
  enqueued: number;
  refreshed: number;
  discoveryErrors: string[];
};

type QueueItem = {
  id: string;
  vbpl_item_id: string;
  source_url: string;
  attempts: number;
};

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

export async function runAutoVbplSync(options: {
  triggeredBy: string;
  useAi?: boolean;
}): Promise<AutoSyncResult> {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY chưa cấu hình — không thể đồng bộ vào Supabase"
    );
  }

  const discovery = await discoverVbplItemIds();
  const enqueuedFromDiscovery = await enqueueVbplItemsInternal(
    supabase,
    discovery.itemIds
  );
  const refreshed = await enqueueStaleDocuments(supabase);
  const limit = getVbplAutoSyncLimit();

  const syncResult = await runVbplSync({
    triggeredBy: options.triggeredBy,
    useAi: options.useAi,
    limit,
    supabase,
  });

  return {
    ...syncResult,
    discovered: discovery.itemIds.length,
    enqueued: enqueuedFromDiscovery,
    refreshed,
    discoveryErrors: discovery.errors,
  };
}

export async function runVbplSync(options: {
  triggeredBy: string;
  itemIds?: string[];
  useAi?: boolean;
  limit?: number;
  supabase?: AdminClient;
}): Promise<SyncJobResult> {
  const supabase = options.supabase ?? createAdminClient();
  if (!supabase) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY chưa cấu hình — không thể đồng bộ vào Supabase"
    );
  }

  const useAi = options.useAi ?? isAiExtractionConfigured();
  const aiModel = useAi ? process.env.AI_MODEL?.trim() || "gpt-4o-mini" : "heuristic";
  const limit = options.limit ?? getVbplAutoSyncLimit();

  const { data: job, error: jobError } = await supabase
    .from("vbpl_sync_jobs")
    .insert({
      status: "running",
      triggered_by: options.triggeredBy,
      ai_model: aiModel,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (jobError || !job) {
    throw new Error(jobError?.message ?? "Không tạo được sync job");
  }

  const queueItems = await resolveQueueItems(supabase, options.itemIds, limit);
  const logs: SyncLogEntry[] = [];
  let success = 0;
  let errors = 0;

  await supabase
    .from("vbpl_sync_jobs")
    .update({ total_items: queueItems.length })
    .eq("id", job.id);

  for (const item of queueItems) {
    try {
      await supabase
        .from("vbpl_sync_queue")
        .update({ status: "processing", attempts: item.attempts + 1 })
        .eq("id", item.id);

      const { url, html } = await fetchVbplHtml(item.vbpl_item_id);
      const extracted = useAi
        ? (await extractDocumentWithAi(html, item.vbpl_item_id, url)).document
        : extractDocumentHeuristic(html, item.vbpl_item_id);

      const saved = await upsertExtractedDocument(supabase, extracted, {
        sourceUrl: url,
        vbplItemId: item.vbpl_item_id,
        rawHtml: html.slice(0, 500_000),
        aiModel,
      });

      await supabase
        .from("vbpl_sync_queue")
        .update({
          status: "done",
          processed_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", item.id);

      logs.push({
        vbplItemId: item.vbpl_item_id,
        status: "success",
        message: "Đồng bộ thành công",
        slug: saved.slug,
      });
      success += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await supabase
        .from("vbpl_sync_queue")
        .update({
          status: "failed",
          last_error: message,
          processed_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      logs.push({
        vbplItemId: item.vbpl_item_id,
        status: "error",
        message,
      });
      errors += 1;
    }

    await supabase
      .from("vbpl_sync_jobs")
      .update({
        processed_items: success + errors,
        success_count: success,
        error_count: errors,
        log: logs,
      })
      .eq("id", job.id);
  }

  await supabase
    .from("vbpl_sync_jobs")
    .update({
      status: errors > 0 && success === 0 ? "failed" : "completed",
      completed_at: new Date().toISOString(),
      processed_items: success + errors,
      success_count: success,
      error_count: errors,
      log: logs,
    })
    .eq("id", job.id);

  return {
    jobId: job.id,
    processed: success + errors,
    success,
    errors,
    logs,
    aiModel,
  };
}

async function resolveQueueItems(
  supabase: AdminClient,
  itemIds: string[] | undefined,
  limit: number
): Promise<QueueItem[]> {
  if (itemIds?.length) {
    await enqueueVbplItemsInternal(supabase, itemIds);
  }

  const { data: pending, error: pendingError } = await supabase
    .from("vbpl_sync_queue")
    .select("id, vbpl_item_id, source_url, attempts")
    .eq("status", "pending")
    .order("priority", { ascending: false })
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  if (pendingError) throw new Error(pendingError.message);

  const remaining = limit - (pending?.length ?? 0);
  let retryItems: QueueItem[] = [];

  if (remaining > 0) {
    const { data: failed, error: failedError } = await supabase
      .from("vbpl_sync_queue")
      .select("id, vbpl_item_id, source_url, attempts")
      .eq("status", "failed")
      .lt("attempts", VBPL_MAX_SYNC_ATTEMPTS)
      .order("scheduled_at", { ascending: true })
      .limit(remaining);

    if (failedError) throw new Error(failedError.message);
    retryItems = (failed ?? []) as QueueItem[];
  }

  const combined = [...((pending ?? []) as QueueItem[]), ...retryItems];

  if (!combined.length) {
    await enqueueVbplItemsInternal(supabase, [...DEFAULT_VBPL_ITEM_IDS]);
    const { data: seeded, error: seededError } = await supabase
      .from("vbpl_sync_queue")
      .select("id, vbpl_item_id, source_url, attempts")
      .eq("status", "pending")
      .limit(limit);

    if (seededError) throw new Error(seededError.message);
    return (seeded ?? []) as QueueItem[];
  }

  return combined.slice(0, limit);
}

async function enqueueVbplItemsInternal(supabase: AdminClient, itemIds: string[]) {
  if (!itemIds.length) return 0;

  const unique = [...new Set(itemIds.filter((id) => /^\d+$/.test(id)))];
  const rows = unique.map((itemId) => ({
    vbpl_item_id: itemId,
    source_url: buildVbplDocumentUrl(itemId),
    status: "pending" as const,
    scheduled_at: new Date().toISOString(),
    last_error: null,
  }));

  const { error } = await supabase
    .from("vbpl_sync_queue")
    .upsert(rows, { onConflict: "vbpl_item_id" });

  if (error) throw new Error(error.message);
  return rows.length;
}

async function enqueueStaleDocuments(supabase: AdminClient) {
  const refreshDays = getVbplRefreshDays();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - refreshDays);

  const { data, error } = await supabase
    .from("legal_documents")
    .select("vbpl_item_id, synced_at")
    .not("vbpl_item_id", "is", null);

  if (error) throw new Error(error.message);

  const staleIds = (data ?? [])
    .filter((row) => {
      if (!row.vbpl_item_id) return false;
      if (!row.synced_at) return true;
      return new Date(row.synced_at) < cutoff;
    })
    .map((row) => row.vbpl_item_id as string);

  if (!staleIds.length) return 0;

  await enqueueVbplItemsInternal(supabase, staleIds);
  return staleIds.length;
}

export async function enqueueVbplItems(itemIds: string[]) {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("SUPABASE_SERVICE_ROLE_KEY chưa cấu hình");
  return enqueueVbplItemsInternal(supabase, itemIds);
}

export function isAutoSyncConfigured() {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      (process.env.VBPL_SYNC_SECRET?.trim() || process.env.CRON_SECRET?.trim())
  );
}
