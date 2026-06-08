import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return updateSession(request);
  }

  const intlResponse = intlMiddleware(request);
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const sessionResponse = await updateSession(request);
  if (sessionResponse.headers.get("location")) {
    return sessionResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/",
    "/(vi|en|zh)/:path*",
  ],
};
