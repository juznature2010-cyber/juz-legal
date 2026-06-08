"use client";

import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocaleData } from "@/lib/locale-data";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/auth/auth-nav";
import { Logo } from "@/components/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale() as Locale;
  const { mainNav, services } = getLocaleData(locale);
  const t = useTranslations("header");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-deep/90 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[min(100%,24rem)] flex-col border-l border-white/10 bg-navy-deep p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <Logo size="sm" className="min-w-0 shrink-0" />
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-gold"
                aria-label={t("closeMenu")}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6">
              <LocaleSwitcher />
            </div>
            <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="border-b border-white/[0.06] py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
              <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/30">
                {tFooter("services")}
              </p>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/dich-vu/${s.slug}`}
                  onClick={onClose}
                  className="py-2 text-sm text-white/55 hover:text-gold"
                >
                  {s.title}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-4">
              <AuthNav light />
              <Button variant="luxury" className="w-full" asChild>
                <Link href="/dat-lich" onClick={onClose}>
                  {tCommon("bookConsultation")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
