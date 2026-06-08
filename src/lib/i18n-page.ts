import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLocaleData } from "@/lib/locale-data";

export async function getPageLocale() {
  return (await getLocale()) as Locale;
}

export async function getPageData() {
  const locale = await getPageLocale();
  return { locale, data: getLocaleData(locale) };
}

export async function getPageMeta(namespace: string) {
  const locale = await getPageLocale();
  const t = await getTranslations({ locale, namespace });
  return { locale, t };
}
