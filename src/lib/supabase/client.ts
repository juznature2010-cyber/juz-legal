import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseEnv,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export { isSupabaseConfigured } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase chưa được cấu hình. Kiểm tra biến môi trường trên Vercel.");
  }

  if (!browserClient) {
    const { url, anonKey } = getSupabaseEnv();
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
