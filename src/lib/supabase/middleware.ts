import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getDashboardPath, resolveUserRole } from "@/lib/auth-utils";
import { getSafeCallbackUrl } from "@/lib/auth-client";
import {
  getLocaleFromPathname,
  stripLocalePrefix,
  withLocalePath,
} from "@/i18n/locale";
import {
  getSupabaseEnv,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const { url, anonKey } = getSupabaseEnv();
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileRole: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    profileRole = profile?.role;
  }

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);
  const path = stripLocalePrefix(pathname);
  const isLoggedIn = !!user;
  const role = user ? resolveUserRole(user, profileRole) : undefined;

  const isAdminRoute = path.startsWith("/admin");
  const isAccountRoute = path.startsWith("/tai-khoan");
  const isLoginPage = path === "/dang-nhap";
  const isRegisterPage = path === "/dang-ky";

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL(withLocalePath("/dang-nhap", locale), request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(
        new URL(withLocalePath("/tai-khoan", locale), request.url)
      );
    }
  }

  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL(withLocalePath("/dang-nhap", locale), request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      withLocalePath("/tai-khoan", locale)
    );
    return NextResponse.redirect(loginUrl);
  }

  if ((isLoginPage || isRegisterPage) && isLoggedIn) {
    const callbackUrl = getSafeCallbackUrl(
      request.nextUrl.searchParams.get("callbackUrl")
    );
    const destination = callbackUrl ?? getDashboardPath(role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return supabaseResponse;
}
