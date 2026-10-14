import { fileURLToPath } from "node:url";
import path from "node:path";
import { applyEdit, logEdits, readLog } from "./apply.mjs";

const ENDPOINT = "/__text-editor";

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const sendJson = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
};

const middleware = (root) => {
  const srcDir = path.join(root, "src");
  const logFile = path.join(root, ".local", "text-edits.json");

  return async (req, res) => {
    try {
      if (req.method === "GET") {
        const page = new URL(req.url ?? "", "http://dev").searchParams.get("page");
        const log = await readLog(logFile);
        return sendJson(res, 200, {
          pending: log.filter((entry) => entry.status === "pending").length,
          recent: log.filter((entry) => entry.page === page).slice(-20).reverse(),
        });
      }
      if (req.method !== "POST") return sendJson(res, 405, { error: "method" });

      const { page, edits } = JSON.parse(await readBody(req));
      const at = new Date().toISOString();
      const entries = [];
      // One after another: two edits may land in the same file.
      for (const edit of edits) {
        const result = await applyEdit(srcDir, edit);
        if (result.status === "unchanged") continue;
        entries.push({ at, page, from: edit.from, to: edit.to, context: edit.context, ...result });
      }
      await logEdits(logFile, entries);
      sendJson(res, 200, { results: entries });
    } catch (error) {
      sendJson(res, 500, { error: String(error) });
    }
  };
};

/**
 * Click-to-edit for the site's copy. Exists only under `astro dev`: the build
 * never sees the client script or the endpoint that writes to `src/`.
 */
export default function textEditor() {
  return {
    name: "text-editor",
    hooks: {
      "astro:config:setup": ({ command, config, injectScript, updateConfig }) => {
        if (command !== "dev") return;
        const root = fileURLToPath(config.root);
        const client = fileURLToPath(new URL("./client.ts", import.meta.url));
        injectScript("page", `import ${JSON.stringify(client)};`);
        updateConfig({
          vite: {
            plugins: [
              {
                name: "text-editor-endpoint",
                apply: "serve",
                configureServer(server) {
                  server.middlewares.use(ENDPOINT, middleware(root));
                },
              },
            ],
          },
        });
      },
    },
  };
}
