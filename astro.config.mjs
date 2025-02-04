import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://ram-4.github.io",
  base: "/astro-nano-me",
  trailingSlash: "never",
  integrations: [mdx(), sitemap(), tailwind()],
});
