import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://johannesgrof.me",
  devToolbar: {
    enabled: false,
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
