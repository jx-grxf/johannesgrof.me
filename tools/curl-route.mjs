// Sends curl, HTTPie and xh on / and /de/ to a small function of its own that
// prints the terminal card. The home pages are static files, which Vercel
// serves before any function, so the route has to sit in front of the
// filesystem check in the build output. Browsers never match it, so the static
// pages stay fully cached for them.
//
// The card runs as its own function instead of an Astro route: Vercel hands a
// function the original path, and Astro would look up "/" among its server
// routes, find only the prerendered page and answer 404.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "rolldown";

const FUNCTION = "_curl";

const curlRoute = {
  src: "^/(de)?/?$",
  has: [{ type: "header", key: "user-agent", value: "^(curl|HTTPie|xh)/.*$" }],
  // Anyone who asks for HTML gets the page, e.g. scripts and agents that
  // fetch the site with curl -H "Accept: text/html".
  missing: [{ type: "header", key: "accept", value: ".*text/html.*" }],
  dest: FUNCTION,
};

export default function curlRouteIntegration() {
  return {
    name: "curl-route",
    hooks: {
      "astro:build:done": async ({ logger }) => {
        const output = new URL("../.vercel/output/", import.meta.url);
        const configFile = new URL("config.json", output);
        let config;
        try {
          config = JSON.parse(await readFile(configFile, "utf8"));
        } catch {
          logger.warn("no .vercel/output/config.json, curl route skipped");
          return;
        }

        const functionDir = new URL(`functions/${FUNCTION}.func/`, output);
        await mkdir(functionDir, { recursive: true });
        await build({
          input: fileURLToPath(new URL("./curl-function.ts", import.meta.url)),
          platform: "node",
          resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
          output: { file: fileURLToPath(new URL("index.mjs", functionDir)), format: "esm", minify: true },
          logLevel: "warn",
        });
        await writeFile(
          new URL(".vc-config.json", functionDir),
          JSON.stringify({ runtime: "nodejs24.x", handler: "index.mjs", launcherType: "Nodejs", supportsResponseStreaming: true }, null, 2),
        );

        const routes = (config.routes ?? []).filter((route) => route.dest !== FUNCTION);
        const filesystem = routes.findIndex((route) => route.handle === "filesystem");
        routes.splice(filesystem === -1 ? 0 : filesystem, 0, curlRoute);
        config.routes = routes;
        await writeFile(configFile, JSON.stringify(config, null, 2));
        logger.info(`${FUNCTION} function and route added in front of the static files`);
      },
    },
  };
}
