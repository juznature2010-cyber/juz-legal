"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

export function FloatingConsultButton() {
  const t = useTranslations("floating");
  const tHeader = useTranslations("header");
  const telHref = `tel:${siteConfig.phone}`;

  return (
    <a
      href={telHref}
      className="group fixed bottom-5 right-4 z-40 flex items-center gap-2.5 rounded-full border border-gold/50 bg-navy-deep/95 px-4 py-3 text-white shadow-[0_8px_32px_rgb(0_0_0/0.45)] backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-navy hover:shadow-[0_12px_40px_rgb(201_162_39/0.25)] sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
        marginRight: "env(safe-area-inset-right)",
      }}
      aria-label={tHeader("callAria", { phone: siteConfig.phoneDisplay })}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-navy shadow-inner transition group-hover:scale-105">
        <Phone className="h-5 w-5" aria-hidden />
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/25 opacity-60 motion-reduce:animate-none" />
      </span>
      <span className="flex flex-col pr-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold sm:text-[11px]">
          {t("label")}
        </span>
        <span className="text-xs font-medium text-white/90 sm:text-sm">
          {siteConfig.phoneDisplay}
        </span>
      </span>
    </a>
  );
}
