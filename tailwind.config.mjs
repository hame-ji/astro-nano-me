import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
        pixel: ['"Press Start 2P"', "cursive"],
      },
      colors: {
        ink: {
          DEFAULT: "rgb(0 0 0 / <alpha-value>)",
          heading: "rgb(0 0 0 / 0.95)",
          body: "rgb(0 0 0 / 0.50)",
          prose: "rgb(0 0 0 / 0.64)",
          "prose-heading": "rgb(0 0 0 / 0.84)",
          meta: "rgb(0 0 0 / 0.45)",
          subtle: "rgb(0 0 0 / 0.35)",
          link: "rgb(0 0 0 / 0.15)",
          "link-hover": "rgb(0 0 0 / 0.25)",
        },
        chalk: {
          DEFAULT: "rgb(255 255 255 / <alpha-value>)",
          heading: "rgb(255 255 255 / 0.90)",
          body: "rgb(255 255 255 / 0.75)",
          prose: "rgb(255 255 255 / 0.66)",
          "prose-heading": "rgb(255 255 255 / 0.85)",
          meta: "rgb(255 255 255 / 0.45)",
          subtle: "rgb(255 255 255 / 0.35)",
          link: "rgb(255 255 255 / 0.30)",
          "link-hover": "rgb(255 255 255 / 0.50)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
