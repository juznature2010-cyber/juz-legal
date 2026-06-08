"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
  zh: "中文",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("locale");

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="group"
      aria-label={t("switch")}
    >
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={cn(
            "rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition",
            item === locale
              ? "bg-gold/20 text-gold"
              : "text-white/55 hover:text-gold"
          )}
        >
          {localeLabels[item]}
        </Link>
      ))}
    </div>
  );
}
