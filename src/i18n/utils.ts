import { ui, defaultLang, languages } from "./ui";

/**
 * Extracts the language from the first meaningful path segment,
 * stripping the base URL prefix first.
 */
export function getLangFromUrl(url: URL): keyof typeof ui {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const stripped = url.pathname.replace(base, "");
  const firstSegment = stripped.replace(/^\//, "").split("/")[0];
  if (firstSegment in languages) {
    return firstSegment as keyof typeof ui;
  }
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
