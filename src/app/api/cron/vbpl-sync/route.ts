import { NextResponse } from "next/server";
import { runVbplSync } from "@/lib/vbpl/sync-service";

export async function POST(request: Request) {
  const secret = process.env.VBPL_SYNC_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }

  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-vbpl-sync-secret");

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runVbplSync({
      triggeredBy: "cron",
      limit: 10,
      useAi: true,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
