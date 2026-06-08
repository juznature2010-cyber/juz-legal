import type { Locale } from "./routing";

const LOCALE_PREFIX = /^\/(en|zh)(?=\/|$)/;

export function stripLocalePrefix(pathname: string) {
  const stripped = pathname.replace(LOCALE_PREFIX, "");
  return stripped === "" ? "/" : stripped;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(/^\/(en|zh)(?=\/|$)/);
  return (match?.[1] as Locale | undefined) ?? "vi";
}

export function withLocalePath(path: string, locale: Locale) {
  if (locale === "vi") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
