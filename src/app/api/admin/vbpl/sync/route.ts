import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { enqueueVbplItems, runAutoVbplSync, runVbplSync } from "@/lib/vbpl/sync-service";
import { isAiExtractionConfigured } from "@/lib/vbpl/ai-extractor";

const bodySchema = z.object({
  itemIds: z.array(z.string().regex(/^\d+$/)).optional(),
  useAi: z.boolean().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  auto: z.boolean().optional(),
});

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  let body: z.infer<typeof bodySchema> = {};
  try {
    const json = await request.json();
    body = bodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const result = body.auto
      ? await runAutoVbplSync({
          triggeredBy: auth.user.email ?? auth.user.id,
          useAi: body.useAi,
        })
      : await runVbplSync({
          triggeredBy: auth.user.email ?? auth.user.id,
          itemIds: body.itemIds,
          useAi: body.useAi,
          limit: body.limit,
        });

    return NextResponse.json({
      ok: true,
      aiConfigured: isAiExtractionConfigured(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const queueSchema = z.object({
  itemIds: z.array(z.string().regex(/^\d+$/)).min(1),
});

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const json = await request.json();
    const { itemIds } = queueSchema.parse(json);
    const count = await enqueueVbplItems(itemIds);
    return NextResponse.json({ ok: true, queued: count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Queue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
