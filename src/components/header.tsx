"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { headerNav, services, type NavItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { AuthNav } from "@/components/auth/auth-nav";
import { Logo } from "@/components/logo";

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkLabel(item: NavItem) {
  if (item.shortLabel) {
    return (
      <>
        <span className="xl:hidden">{item.shortLabel}</span>
        <span className="hidden xl:inline">{item.label}</span>
      </>
    );
  }
  return item.label;
}

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
        <div className="container-premium relative flex h-[var(--header-bar-height)] items-center md:h-[var(--header-bar-height-md)]">
          <Logo
            priority
            size="md"
            className="absolute left-3 top-[calc(50%+0.375rem)] z-20 shrink-0 -translate-y-1/2 sm:left-5 md:left-8 lg:left-10"
          />

          <div className="flex w-full min-w-0 items-center justify-end gap-2 pl-[10.5rem] sm:pl-[11rem] md:pl-[13rem] lg:gap-3 lg:pl-[14.5rem] xl:pl-[15.5rem]">
            <nav
              className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
              aria-label="Chính"
            >
              <ul className="flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-1 xl:gap-x-2 2xl:gap-x-3">
                {headerNav.map((item) => (
                  <li key={item.href} className="flex shrink-0 justify-center">
                    {item.href === "/dich-vu" ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setMegaOpen(true)}
                        onMouseLeave={() => setMegaOpen(false)}
                        onFocusCapture={() => setMegaOpen(true)}
                        onBlurCapture={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget)) {
                            setMegaOpen(false);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            setMegaOpen(false);
                            event.currentTarget.querySelector<HTMLElement>("a")?.focus();
                          }
                        }}
                      >
                        <Link
                          href="/dich-vu"
                          aria-haspopup="true"
                          aria-expanded={megaOpen}
                          aria-controls="services-mega-menu"
                          className={cn(
                            "nav-link inline-flex items-center gap-1 px-1",
                            pathname.startsWith("/dich-vu") && "nav-link-active"
                          )}
                        >
                          {navLinkLabel(item)}
                          <span className="text-[7px] text-gold">▼</span>
                        </Link>
                        <div
                          id="services-mega-menu"
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
                        href={item.href}
                        className={cn(
                          "nav-link px-1",
                          isNavActive(pathname, item.href) && "nav-link-active"
                        )}
                      >
                        {navLinkLabel(item)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className={cn(
                "flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-2.5",
                "lg:border-l lg:pl-3",
                solid ? "lg:border-white/10" : "lg:border-white/15"
              )}
            >
              <div className="hidden items-center gap-1.5 lg:flex lg:gap-2 xl:gap-2.5">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex shrink-0 items-center gap-1.5 text-[9px] uppercase tracking-[0.08em] text-white/70 transition hover:text-gold lg:text-[10px] xl:tracking-[0.1em]"
                  aria-label={`Gọi ${siteConfig.phoneDisplay}`}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden 2xl:inline">{siteConfig.phoneDisplay}</span>
                </a>
                <AuthNav light />
                <Button variant="luxury" size="sm" asChild className="shrink-0 px-3 text-[10px]">
                  <Link href="/dat-lich">Đặt lịch</Link>
                </Button>
              </div>

              <button
                type="button"
                className="rounded p-2 text-white transition hover:text-gold lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Mở menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
