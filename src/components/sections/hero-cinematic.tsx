"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { Link } from "@/i18n/navigation";

export function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tSite = useTranslations("site");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", isDesktop ? "18%" : "0%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", isDesktop ? "8%" : "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, isDesktop ? 0 : 1]);

  const stats = [
    { value: "18+", label: t("statYears") },
    { value: "500+", label: t("statClients") },
    { value: "7", label: t("statAreas") },
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[min(100svh,900px)] items-end overflow-hidden bg-navy-deep sm:min-h-[92svh] lg:min-h-[100svh]"
    >
      <motion.div className="absolute inset-0 md:scale-105" style={{ y: imageY }}>
        <Image
          src={images.hero}
          alt=""
          fill
          priority
          className="object-cover object-[center_30%] md:object-center"
          sizes="100vw"
        />
      </motion.div>
      <div className="overlay-hero absolute inset-0" />
      <div className="grain absolute inset-0" />

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full pb-8 pt-[calc(var(--header-height)+1.5rem)] md:pb-14 md:pt-[calc(var(--header-height-md)+2rem)] lg:pb-20 lg:pt-40"
      >
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <p className="text-eyebrow line-clamp-2 text-gold-light sm:line-clamp-none">
              {siteConfig.legalName}
            </p>
            <div className="gold-line mt-4 sm:mt-6" />
            <h1 className="text-display mt-5 text-white sm:mt-8">{t("title")}</h1>
            <p className="text-lead mt-5 max-w-2xl sm:mt-8">{tSite("description")}</p>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button variant="luxury" size="xl" asChild>
                <Link href="/dat-lich">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {tCommon("bookConsultation")}
                </Link>
              </Button>
              <Button variant="ghost-light" size="xl" asChild>
                <Link href="/lien-he">
                  <Phone className="h-4 w-4 shrink-0" />
                  {tCommon("contactNow")}
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-10 border-t border-white/10 pt-6 sm:mt-14 md:mt-20 md:pt-8"
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-8 md:gap-16">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="font-display text-2xl font-light text-gold sm:text-3xl md:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[8px] uppercase leading-snug tracking-[0.12em] text-white/50 sm:mt-1 sm:text-[10px] sm:tracking-[0.18em] md:text-[11px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="#intro"
              className="mt-6 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 transition hover:text-gold md:flex"
            >
              {t("scroll")}
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
