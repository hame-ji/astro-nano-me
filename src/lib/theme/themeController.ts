export type ThemeMode = "light" | "dark" | "system";

const systemMediaQuery = "(prefers-color-scheme: dark)";

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function writeStoredTheme(mode: ThemeMode) {
  try {
    localStorage.setItem("theme", mode);
  } catch {
    return;
  }
}

function getStoredThemeMode(): ThemeMode {
  const storedTheme = readStoredTheme();

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return "system";
}

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
  void window.getComputedStyle(css).opacity;
  document.head.removeChild(css);
}

export function resolveDarkMode(mode: ThemeMode) {
  return mode === "system"
    ? window.matchMedia(systemMediaQuery).matches
    : mode === "dark";
}

export function applyThemeMode(mode: ThemeMode) {
  const currentMode = getStoredThemeMode();
  const currentDark = document.documentElement.classList.contains("dark");
  const nextDark = resolveDarkMode(mode);

  if (currentMode === mode && currentDark === nextDark) {
    return {
      changed: false,
      nextDark,
    };
  }

  writeStoredTheme(mode);

  if (currentDark !== nextDark) {
    applyThemeWithoutTransition(nextDark);
  }

  return {
    changed: currentDark !== nextDark,
    nextDark,
  };
}

export function preloadThemeMode() {
  const mode = getStoredThemeMode();
  const nextDark = resolveDarkMode(mode);
  const currentDark = document.documentElement.classList.contains("dark");

  if (currentDark !== nextDark) {
    applyThemeWithoutTransition(nextDark);
  }

  return {
    mode,
    nextDark,
  };
}

export function applySystemThemeChange(nextDark: boolean) {
  if (getStoredThemeMode() !== "system") {
    return {
      changed: false,
      nextDark,
    };
  }

  const currentDark = document.documentElement.classList.contains("dark");

  if (currentDark === nextDark) {
    return {
      changed: false,
      nextDark,
    };
  }

  applyThemeWithoutTransition(nextDark);

  return {
    changed: true,
    nextDark,
  };
}
