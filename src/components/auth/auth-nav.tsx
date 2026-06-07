"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LogIn, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth-utils";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function AuthButtonGroup({
  light,
  children,
}: {
  light: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-sm border p-0.5 sm:gap-0",
        light
          ? "border-white/20 bg-white/5"
          : "border-navy/10 bg-surface"
      )}
    >
      {children}
    </div>
  );
}

export function AuthNav({ light = false }: { light?: boolean }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;

  if (!isSupabaseConfigured()) {
    return (
      <AuthButtonGroup light={light}>
        <Button
          variant={light ? "ghost-light" : "ghost"}
          size="sm"
          asChild
          className="h-8 border-0 px-2.5 shadow-none sm:px-3"
        >
          <Link href="/dang-ky">Đăng ký</Link>
        </Button>
        <span
          className={cn(
            "hidden h-4 w-px sm:block",
            light ? "bg-white/20" : "bg-navy/15"
          )}
          aria-hidden
        />
        <Button
          variant={light ? "ghost-light" : "ghost"}
          size="sm"
          asChild
          className="h-8 border-0 px-2.5 shadow-none sm:px-3"
        >
          <Link href="/dang-nhap">
            <LogIn className="h-3.5 w-3.5" />
            Đăng nhập
          </Link>
        </Button>
      </AuthButtonGroup>
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
    <AuthButtonGroup light={light}>
      <Button
        variant={light ? "ghost-light" : "ghost"}
        size="sm"
        asChild
        className="h-8 border-0 px-2.5 shadow-none sm:px-3"
      >
        <Link href="/dang-ky">Đăng ký</Link>
      </Button>
      <span
        className={cn(
          "hidden h-4 w-px sm:block",
          light ? "bg-white/20" : "bg-navy/15"
        )}
        aria-hidden
      />
      <Button
        variant={light ? "ghost-light" : "ghost"}
        size="sm"
        asChild
        className="h-8 border-0 px-2.5 shadow-none sm:px-3"
      >
        <Link href="/dang-nhap">
          <LogIn className="h-3.5 w-3.5" />
          Đăng nhập
        </Link>
      </Button>
    </AuthButtonGroup>
  );
}
