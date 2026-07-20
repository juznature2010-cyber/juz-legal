import { createAdminClient } from "@/lib/supabase/admin";
import {
  extractDocumentHeuristic,
  extractDocumentWithAi,
  isAiExtractionConfigured,
} from "@/lib/vbpl/ai-extractor";
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

type QueueItem = {
  id: string;
  vbpl_item_id: string;
  source_url: string;
};

export async function runVbplSync(options: {
  triggeredBy: string;
  itemIds?: string[];
  useAi?: boolean;
  limit?: number;
}): Promise<SyncJobResult> {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY chưa cấu hình — không thể đồng bộ vào Supabase"
    );
  }

  const useAi = options.useAi ?? isAiExtractionConfigured();
  const aiModel = useAi ? process.env.AI_MODEL?.trim() || "gpt-4o-mini" : "heuristic";
  const limit = options.limit ?? 20;

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
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  itemIds: string[] | undefined,
  limit: number
): Promise<Array<QueueItem & { attempts: number }>> {
  if (itemIds?.length) {
    for (const itemId of itemIds) {
      await supabase.from("vbpl_sync_queue").upsert(
        {
          vbpl_item_id: itemId,
          source_url: buildVbplDocumentUrl(itemId),
          status: "pending",
          scheduled_at: new Date().toISOString(),
        },
        { onConflict: "vbpl_item_id" }
      );
    }
  }

  const { data, error } = await supabase
    .from("vbpl_sync_queue")
    .select("id, vbpl_item_id, source_url, attempts")
    .in("status", ["pending", "failed"])
    .order("priority", { ascending: false })
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as Array<QueueItem & { attempts: number }>;
}

export async function enqueueVbplItems(itemIds: string[]) {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("SUPABASE_SERVICE_ROLE_KEY chưa cấu hình");

  const rows = itemIds.map((itemId) => ({
    vbpl_item_id: itemId,
    source_url: buildVbplDocumentUrl(itemId),
    status: "pending" as const,
    scheduled_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("vbpl_sync_queue")
    .upsert(rows, { onConflict: "vbpl_item_id" });

  if (error) throw new Error(error.message);
  return rows.length;
}
