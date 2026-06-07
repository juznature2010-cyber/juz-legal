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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-white/[0.08] bg-navy-deep/90 py-0 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-xl"
            : "bg-gradient-to-b from-navy-deep/80 to-transparent py-2"
        )}
      >
        <div className="container-premium flex h-14 items-center justify-between gap-3 sm:gap-6 md:h-[4.5rem]">
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="hidden h-8 w-px shrink-0 bg-gold/60 sm:block md:h-10" aria-hidden />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-medium tracking-wide text-white transition group-hover:text-gold sm:text-xl md:text-2xl">
                {siteConfig.name}
              </p>
              <p className="hidden text-[9px] uppercase tracking-[0.3em] text-white/45 sm:block sm:tracking-[0.35em]">
                Attorneys at Law
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Chính">
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

          <div className="hidden items-center gap-4 lg:flex xl:gap-6">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/70 transition hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{siteConfig.phoneDisplay}</span>
            </a>
            <AuthNav light />
            <Button variant="luxury" size="sm" asChild>
              <Link href="/dat-lich">Đặt lịch</Link>
            </Button>
          </div>

          <button
            type="button"
            className="rounded p-2 text-white transition hover:text-gold lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
