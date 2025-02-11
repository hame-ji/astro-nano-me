import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("fr-FR", {
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

export function dateRange(startDate: Date, endDate: Date | string): string {
  const startMonth = startDate.toLocaleString("fr-FR", { month: "long" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (typeof endDate === "string") {
    endMonth = "";
    endYear = endDate;
    endDate = new Date();
  } else {
    endMonth = endDate.toLocaleString("fr-FR", { month: "long" });
    endYear = endDate.getFullYear().toString();
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear} • ${getElapsedTime(startDate, endDate)}`;
}

function getElapsedTime(startDate: Date, endDate: Date): string {
  const formatDuration = (years: number, months: number): string => {
    const yearString = years === 1 ? "an" : "ans";
    return months === 0
      ? `${years} ${yearString}`
      : `${years} ${yearString}, ${months} mois`;
  };

  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    return formatDuration(years - 1, months + 12);
  }

  return formatDuration(years, months);
}
