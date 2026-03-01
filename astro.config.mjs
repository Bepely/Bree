import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import remarkMediaMarkers from "./src/plugins/media-markers.mjs";

export default defineConfig({
  site: "https://narr.netlify.app",
  integrations: [svelte()],
  markdown: {
    remarkPlugins: [remarkMediaMarkers],
  },
});
