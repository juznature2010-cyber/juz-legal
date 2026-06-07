import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getDashboardPath, resolveUserRole } from "@/lib/auth-utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const isLoggedIn = !!user;
  const role = user ? resolveUserRole(user, profileRole) : undefined;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/tai-khoan");
  const isLoginPage = pathname === "/dang-nhap";
  const isRegisterPage = pathname === "/dang-ky";

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/tai-khoan", request.url));
    }
  }

  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL("/dang-nhap", request.url);
    loginUrl.searchParams.set("callbackUrl", "/tai-khoan");
    return NextResponse.redirect(loginUrl);
  }

  if ((isLoginPage || isRegisterPage) && isLoggedIn) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return supabaseResponse;
}
