function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function getSupabaseEnv() {
  return {
    url: cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}

export function isValidSupabaseUrl(url: string) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return (
    isValidSupabaseUrl(url) &&
    anonKey.length > 20 &&
    !anonKey.includes("THAY_BANG") &&
    !anonKey.includes("paste-anon")
  );
}
