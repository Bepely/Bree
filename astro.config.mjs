import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import remarkMediaMarkers from "./src/plugins/media-markers.mjs";

export default defineConfig({
  site: "https://narr.netlify.app",
  integrations: [svelte(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMediaMarkers],
  },
});
