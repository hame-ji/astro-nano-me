import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
  const pathname = url.pathname.replace(/\/$/, "");
  if (pathname.endsWith("/fr") || pathname.includes("/fr/")) {
    return "fr";
  }
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
