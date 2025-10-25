// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://stijn-gamettwee.github.io/portfolio',
  vite: {
    plugins: [tailwindcss()],
  },
});
