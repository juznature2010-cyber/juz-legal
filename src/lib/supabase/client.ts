import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseConfigured() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!key &&
    !key.includes("THAY_BANG") &&
    !key.includes("paste-anon") &&
    key.length > 20
  );
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
