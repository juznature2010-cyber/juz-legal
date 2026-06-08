"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { mainNav, services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { AuthNav } from "@/components/auth/auth-nav";
import { Logo } from "@/components/logo";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const solid = !isHome || scrolled;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 overflow-visible transition-all duration-500",
          solid
            ? "border-b border-white/[0.08] bg-navy-deep/90 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-xl"
            : "bg-gradient-to-b from-navy-deep/80 to-transparent"
        )}
      >
        <div className="container-premium flex h-[var(--header-bar-height)] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 md:h-[var(--header-bar-height-md)] lg:px-8">
          <Logo priority size="md" className="relative z-20 shrink-0" />

          <nav
            className="hidden flex-1 items-center justify-center gap-3 px-1 xl:flex xl:gap-5 2xl:gap-8"
            aria-label="Chính"
          >
            {mainNav.map((item) =>
              item.href === "/dich-vu" ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href="/dich-vu"
                    className={cn(
                      "nav-link inline-flex items-center gap-1.5",
                      pathname.startsWith("/dich-vu") && "nav-link-active"
                    )}
                  >
                    {item.label}
                    <span className="text-[8px] text-gold">▼</span>
                  </Link>
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-4 transition-all duration-300",
                      megaOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    )}
                  >
                    <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-navy-mid/95 p-1 shadow-2xl backdrop-blur-xl">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/dich-vu/${s.slug}`}
                          className="group/item px-4 py-3.5 transition hover:bg-white/[0.04]"
                        >
                          <span className="block text-sm text-white/90 transition group-hover/item:text-gold">
                            {s.title.replace(/^Tư vấn (pháp luật )?/, "")}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-white/40 line-clamp-1">
                            {s.short}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-link",
                    pathname === item.href && "nav-link-active"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 xl:flex xl:gap-3 2xl:gap-5">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-white/70 transition hover:text-gold 2xl:text-[11px] 2xl:tracking-[0.12em]"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden 2xl:inline">{siteConfig.phoneDisplay}</span>
              </a>
              <AuthNav light />
              <Button variant="luxury" size="sm" asChild className="shrink-0">
                <Link href="/dat-lich">Đặt lịch</Link>
              </Button>
            </div>

            <button
              type="button"
              className="rounded p-2 text-white transition hover:text-gold xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
