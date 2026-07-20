import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    return NextResponse.json({
      reserved: !!adminEmail && email === adminEmail,
    });
  } catch {
    return NextResponse.json({ reserved: false });
  }
}
