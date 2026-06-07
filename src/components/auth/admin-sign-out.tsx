"use client";

import { useMemo } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AdminSignOut() {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        window.location.href = "/";
      }}
    >
      <LogOut className="h-3.5 w-3.5" />
      Đăng xuất
    </Button>
  );
}
