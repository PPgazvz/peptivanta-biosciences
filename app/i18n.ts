export type SiteLocale = "en" | "pt" | "es" | "fr" | "zh";

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
] as const satisfies ReadonlyArray<{ code: SiteLocale; label: string }>;

export const LOCALE_STORAGE_KEY = "peptivanta-locale";

export function isSiteLocale(value: string | null): value is SiteLocale {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}

export function htmlLang(locale: SiteLocale) {
  if (locale === "pt") return "pt-BR";
  if (locale === "zh") return "zh-CN";
  return locale;
}
