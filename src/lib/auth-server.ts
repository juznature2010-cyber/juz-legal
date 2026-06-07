import type { User } from "@supabase/supabase-js";
import { resolveUserRole, type UserRole } from "@/lib/auth-utils";
import { getProfileRole } from "@/lib/supabase/queries";

export async function resolveUserRoleServer(user: User): Promise<UserRole> {
  const profileRole = await getProfileRole(user.id);
  return resolveUserRole(user, profileRole);
}
