import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getDashboardPath, resolveUserRole, type UserRole } from "@/lib/auth-utils";

export function getSafeCallbackUrl(callbackUrl: string | null | undefined) {
  if (!callbackUrl) return null;
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) return null;
  if (callbackUrl.startsWith("/dang-nhap") || callbackUrl.startsWith("/dang-ky")) {
    return null;
  }
  return callbackUrl;
}

export async function fetchProfileRole(
  supabase: SupabaseClient,
  userId: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role as string | undefined;
}

export async function resolveUserRoleClient(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole> {
  const profileRole = await fetchProfileRole(supabase, user.id);
  return resolveUserRole(user, profileRole);
}

export function getPostAuthPath(role: UserRole, callbackUrl?: string | null) {
  const safe = getSafeCallbackUrl(callbackUrl);
  if (safe) return safe;
  return getDashboardPath(role);
}

export function isReservedAdminEmail(email: string) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  return !!adminEmail && email.trim().toLowerCase() === adminEmail;
}

export async function signOutAndRedirect(
  supabase: SupabaseClient,
  href = "/"
) {
  await supabase.auth.signOut();
  window.location.href = href;
}
