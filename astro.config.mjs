import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://hame-ji.github.io",
  base: process.env.DEPLOY === "true" ? "/astro-nano-me" : undefined,
  trailingSlash: "never",
  integrations: [mdx(), sitemap(), tailwind()],
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
