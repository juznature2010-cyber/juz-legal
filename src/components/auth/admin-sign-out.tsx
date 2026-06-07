"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const supabase = createClient();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
      }}
    >
      <LogOut className="h-3.5 w-3.5" />
      Đăng xuất
    </Button>
  );
}
