import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultLang, languages } from "@i18n/ui";

/** Derives a clean URL slug from a content entry id like "fr/01-init.md" → "01-init" */
export function slugFromId(id: string): string {
  return id.replace(/^[a-z]{2}\//, "").replace(/\.md$/, "");
}

export function localeFromLang(lang: string): string {
  return lang === "fr" ? "fr-FR" : "en-US";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureLeadingSlash(path: string): string {
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
}

export function formatDate(date: Date, lang = defaultLang) {
  return Intl.DateTimeFormat(localeFromLang(lang), {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min`;
}

export function dateRange(
  startDate: Date,
  endDate: Date | string,
  lang = defaultLang
): string {
  const locale = localeFromLang(lang);
  const startMonth = startDate.toLocaleString(locale, { month: "long" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (typeof endDate === "string") {
    endMonth = "";
    endYear = endDate;
    endDate = new Date();
  } else {
    endMonth = endDate.toLocaleString(locale, { month: "long" });
    endYear = endDate.getFullYear().toString();
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear} • ${getElapsedTime(startDate, endDate, lang)}`;
}

/**
 * Generates hreflang alternate URLs for all supported languages.
 * Swaps the lang segment in the current pathname to produce each alternate.
 */
export function getHreflangAlternates(
  pathname: string,
  site: URL
): Array<{ lang: string; href: string }> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const stripped = pathname.replace(base, "");
  const segments = stripped.replace(/^\//, "").split("/");
  const currentLang = segments[0] in languages ? segments[0] : defaultLang;
  const pathAfterLang =
    currentLang === segments[0]
      ? segments.slice(1).join("/")
      : segments.join("/");

  return Object.keys(languages).map((lang) => {
    const alternatePath = `${base}/${lang}${pathAfterLang ? `/${pathAfterLang}` : ""}`;
    return {
      lang,
      href: new URL(alternatePath, site).toString(),
    };
  });
}

function getElapsedTime(startDate: Date, endDate: Date, lang: string): string {
  const formatDuration = (years: number, months: number): string => {
    if (lang === "fr") {
      const yearString = years === 1 ? "an" : "ans";
      return months === 0
        ? `${years} ${yearString}`
        : `${years} ${yearString}, ${months} mois`;
    }
    const yearString = years === 1 ? "year" : "years";
    const monthString = months === 1 ? "month" : "months";
    return months === 0
      ? `${years} ${yearString}`
      : `${years} ${yearString}, ${months} ${monthString}`;
  };

  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    return formatDuration(years - 1, months + 12);
  }

  return formatDuration(years, months);
}
