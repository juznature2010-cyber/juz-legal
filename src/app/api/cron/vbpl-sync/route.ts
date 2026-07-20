import { NextResponse } from "next/server";
import { runAutoVbplSync, isAutoSyncConfigured } from "@/lib/vbpl/sync-service";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secrets = [
    process.env.VBPL_SYNC_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter(Boolean);

  if (!secrets.length) return false;

  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-vbpl-sync-secret");

  return Boolean(provided && secrets.includes(provided));
}

async function handleSync(request: Request) {
  if (!isAutoSyncConfigured()) {
    return NextResponse.json(
      {
        error:
          "Auto sync chưa cấu hình. Cần SUPABASE_SERVICE_ROLE_KEY và VBPL_SYNC_SECRET hoặc CRON_SECRET.",
      },
      { status: 503 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutoVbplSync({
      triggeredBy: request.headers.get("x-vercel-cron") ? "vercel-cron" : "cron",
      useAi: true,
    });

    return NextResponse.json({ ok: true, auto: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Vercel Cron gọi GET; scheduler bên ngoài có thể dùng POST */
export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}
