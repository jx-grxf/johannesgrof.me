import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import textEditor from "./tools/text-editor/integration.mjs";
import curlRoute from "./tools/curl-route.mjs";

export default defineConfig({
  site: "https://johannesgrof.me",
  devToolbar: {
    enabled: false,
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  adapter: vercel(),
  integrations: [textEditor(), curlRoute()],
});
