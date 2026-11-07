import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import vercel from "@astrojs/vercel";
import textEditor from "./tools/text-editor/integration.mjs";
import curlRoute from "./tools/curl-route.mjs";

// Vercel stays the default so going back is only a DNS change; Workers Builds sets
// DEPLOY_TARGET=cloudflare. Platform specifics live behind `#platform`.
const target = process.env.DEPLOY_TARGET === "cloudflare" ? "cloudflare" : "vercel";

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
  vite: {
    resolve: {
      alias: {
        "#platform": fileURLToPath(new URL(`./src/platform/${target}.ts`, import.meta.url)),
      },
    },
    define: {
      "import.meta.env.DEPLOY_TARGET": JSON.stringify(target),
    },
  },
  adapter: target === "cloudflare" ? cloudflare({ prerenderEnvironment: "node", imageService: "passthrough" }) : vercel(),
  integrations: target === "cloudflare" ? [textEditor()] : [textEditor(), curlRoute()],
});
