// Cloudflare Workers entry (DEPLOY_TARGET=cloudflare). Every request passes here
// first (`run_worker_first`), so host redirects and headers from vercel.json also
// reach static files, just as Vercel applies them in front of its CDN.

import { handle } from "@astrojs/cloudflare/handler";
import vercelConfig from "../vercel.json";
import { handleHi } from "./lib/curlHandler.ts";
import { createHostingRules, edgeCacheControl, type VercelConfig } from "./lib/hostingRules.ts";

const rules = createHostingRules(vercelConfig as VercelConfig);

type Handle = typeof handle;
type Context = Parameters<Handle>[2];

// On Vercel this route sits in front of the static files (tools/curl-route.mjs):
// curl, HTTPie and xh on /hi get the terminal card, anyone asking for HTML the page.
const CURL_PATH = /^\/(de\/)?hi(\/.*)?$/;
const CURL_AGENT = /^(curl|HTTPie|xh)\/.*$/;
const wantsCurlCard = (request: Request, url: URL): boolean =>
  CURL_PATH.test(url.pathname) &&
  CURL_AGENT.test(request.headers.get("user-agent") ?? "") &&
  !/text\/html/.test(request.headers.get("accept") ?? "");

// The Cache API, not the Workers cache layer, which keys entries without the host.
// The stored copy carries the edge lifetime in Cache-Control; the response's own
// value travels alongside and is restored on a hit, so browsers revalidate as before.
const ORIGINAL_CACHE_CONTROL = "x-jg-cache-control";
const edgeCache = (): Cache | null =>
  typeof caches === "undefined" ? null : ((caches as unknown as { default?: Cache }).default ?? null);

const fromCache = (hit: Response): Response => {
  const response = new Response(hit.body, hit);
  const original = response.headers.get(ORIGINAL_CACHE_CONTROL);
  if (!original) response.headers.delete("cache-control");
  else response.headers.set("cache-control", original);
  response.headers.delete(ORIGINAL_CACHE_CONTROL);
  return response;
};

type RateLimit = { limit(options: { key: string }): Promise<{ success: boolean }> };

const tooMany = () =>
  new Response("Too many requests, try again in a minute.\n", {
    status: 429,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "60" },
  });

export default {
  async fetch(request: Request, env: Parameters<Handle>[1], context: Context): Promise<Response> {
    const url = new URL(request.url);
    const burst = (env as { POST_BURST?: RateLimit }).POST_BURST;
    const ip = request.headers.get("cf-connecting-ip");
    if (request.method === "POST" && burst && ip && !(await burst.limit({ key: ip })).success) return tooMany();
    const redirect = rules.redirect(request);
    const curl = !redirect && wantsCurlCard(request, url);

    const cache = request.method === "GET" && !redirect && !curl ? edgeCache() : null;
    const hit = await cache?.match(request);
    if (hit) return fromCache(hit);

    let response = redirect ?? (curl ? await handleHi(request) : await handle(rules.rewrite(request), env, context));
    response = new Response(response.body, response);
    rules.headersFor(request).forEach((value, key) => response.headers.set(key, value));

    const edge = edgeCacheControl(request.method, response);
    response.headers.delete("vercel-cdn-cache-control");
    if (cache && edge !== "no-store" && response.status === 200) {
      const stored = response.clone();
      const stale = /stale-while-revalidate=\d+/.exec(edge)?.[0];
      const lifetime = /max-age=\d+/.exec(edge)![0];
      stored.headers.set(ORIGINAL_CACHE_CONTROL, response.headers.get("cache-control") ?? "");
      stored.headers.set("cache-control", `public, ${lifetime}${stale ? `, ${stale}` : ""}`);
      context.waitUntil(cache.put(request, stored));
    }
    return response;
  },
};
