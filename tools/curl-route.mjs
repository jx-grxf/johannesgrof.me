// Sends curl, HTTPie and xh on / and /de/ to /api/card. The home pages are
// static files, and Vercel serves those before any function or middleware, so
// the route has to sit in front of the filesystem check in the build output.
// Browsers never match it, so the static pages stay fully cached for them.
import { readFile, writeFile } from "node:fs/promises";

const curlRoute = {
  src: "^/(de)?/?$",
  has: [{ type: "header", key: "user-agent", value: "^(curl|HTTPie|xh)/.*$" }],
  dest: "/api/card?lang=$1",
  // Sends the rewritten path through the filesystem and function routes again,
  // the same way vercel.json rewrites do; without it the request ends at 404.html.
  check: true,
};

export default function curlRouteIntegration() {
  return {
    name: "curl-route",
    hooks: {
      "astro:build:done": async ({ logger }) => {
        const file = new URL("../.vercel/output/config.json", import.meta.url);
        let config;
        try {
          config = JSON.parse(await readFile(file, "utf8"));
        } catch {
          logger.warn("no .vercel/output/config.json, curl route skipped");
          return;
        }
        const routes = config.routes ?? [];
        const filesystem = routes.findIndex((route) => route.handle === "filesystem");
        if (routes.some((route) => route.dest === curlRoute.dest)) return;
        routes.splice(filesystem === -1 ? 0 : filesystem, 0, curlRoute);
        config.routes = routes;
        await writeFile(file, JSON.stringify(config, null, 2));
        logger.info("curl route added in front of the static files");
      },
    },
  };
}
