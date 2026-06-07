"use client";

import Link from "next/link";
import { LogIn, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth-utils";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthNav({ light = false }: { light?: boolean }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;

  if (!isSupabaseConfigured()) {
    return (
      <Button variant={light ? "ghost-light" : "ghost"} size="sm" asChild>
        <Link href="/dang-nhap">
          <LogIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Link>
      </Button>
    );
  }

  const supabase = createClient();

  if (user) {
    const isAdmin = role === "admin";
    const dashboardHref = getDashboardPath(role ?? undefined);

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant={light ? "ghost-light" : "ghost"}
          size="sm"
          asChild
          className="hidden sm:inline-flex"
        >
          <Link href={dashboardHref}>
            {isAdmin ? (
              <LayoutDashboard className="h-3.5 w-3.5" />
            ) : (
              <UserCircle className="h-3.5 w-3.5" />
            )}
            {isAdmin ? "Quản trị" : "Tài khoản"}
          </Link>
        </Button>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className={
            light
              ? "flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/70 transition hover:text-gold"
              : "flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted transition hover:text-navy"
          }
          aria-label="Đăng xuất"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Đăng xuất</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant={light ? "ghost-light" : "ghost"} size="sm" asChild>
        <Link href="/dang-ky">
          <span className="hidden sm:inline">Đăng ký</span>
          <span className="sm:hidden">+</span>
        </Link>
      </Button>
      <Button variant={light ? "ghost-light" : "ghost"} size="sm" asChild>
        <Link href="/dang-nhap">
          <LogIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Link>
      </Button>
    </div>
  );
}
