export type ThemeMode = "light" | "dark" | "system";

const systemMediaQuery = "(prefers-color-scheme: dark)";

function applyThemeWithoutTransition(dark: boolean) {
  const css = document.createElement("style");

  css.appendChild(
    document.createTextNode(
      `* {
         -webkit-transition: none !important;
         -moz-transition: none !important;
         -o-transition: none !important;
         -ms-transition: none !important;
         transition: none !important;
      }`
    )
  );

  document.head.appendChild(css);
  document.documentElement.classList.toggle("dark", dark);
  window.getComputedStyle(css).opacity;
  document.head.removeChild(css);
}

export function resolveDarkMode(mode: ThemeMode) {
  return mode === "system"
    ? window.matchMedia(systemMediaQuery).matches
    : mode === "dark";
}

export function applyThemeMode(mode: ThemeMode) {
  const currentMode =
    (localStorage.getItem("theme") as ThemeMode | null) ?? "system";
  const currentDark = document.documentElement.classList.contains("dark");
  const nextDark = resolveDarkMode(mode);

  if (currentMode === mode && currentDark === nextDark) {
    return {
      changed: false,
      nextDark,
    };
  }

  localStorage.setItem("theme", mode);

  if (currentDark !== nextDark) {
    applyThemeWithoutTransition(nextDark);
  }

  return {
    changed: currentDark !== nextDark,
    nextDark,
  };
}
