import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createHostingRules, edgeCacheControl, type VercelConfig } from "../src/lib/hostingRules.ts";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as VercelConfig;
const rules = createHostingRules(config);
const get = (url: string) => new Request(url);

test("www moves to the bare domain and keeps path and query", () => {
  const response = rules.redirect(get("https://www.johannesgrof.me/projects/cswap/?x=1"));
  assert.equal(response?.status, 308);
  assert.equal(response?.headers.get("location"), "https://johannesgrof.me/projects/cswap/?x=1");
  assert.equal(rules.redirect(get("https://johannesgrof.me/projects/cswap/")), null);
});

test("renamed and retired project pages redirect like on Vercel", () => {
  assert.equal(rules.redirect(get("https://johannesgrof.me/projects/claude-swap-bar"))?.headers.get("location"),
    "https://johannesgrof.me/projects/cswap/");
  const retired = rules.redirect(get("https://johannesgrof.me/de/projects/healthkit-mcp"));
  assert.equal(retired?.status, 307);
  assert.equal(retired?.headers.get("location"), "https://johannesgrof.me/de/projects/");
});

test("headers from vercel.json reach every path, cache rules only theirs", () => {
  const page = rules.headersFor(get("https://johannesgrof.me/"));
  assert.match(page.get("content-security-policy") ?? "", /static\.cloudflareinsights\.com/);
  assert.equal(page.get("cache-control"), null);
  assert.equal(rules.headersFor(get("https://johannesgrof.me/_astro/a.js")).get("cache-control"),
    "public, max-age=31536000, immutable");
});

test("the Worker cache follows Vercel-CDN-Cache-Control and s-maxage only", () => {
  const response = (headers: Record<string, string>) => new Response("", { headers });
  assert.equal(
    edgeCacheControl("GET", response({ "cache-control": "public, max-age=0, must-revalidate", "vercel-cdn-cache-control": "max-age=20, stale-while-revalidate=30" })),
    "public, max-age=20, stale-while-revalidate=30",
  );
  assert.equal(edgeCacheControl("GET", response({ "cache-control": "public, max-age=0, must-revalidate" })), "no-store");
  assert.equal(edgeCacheControl("GET", response({ "cache-control": "no-store" })), "no-store");
  assert.equal(edgeCacheControl("POST", response({ "vercel-cdn-cache-control": "max-age=60" })), "no-store");
  assert.equal(edgeCacheControl("GET", response({ "cache-control": "public, s-maxage=600" })), "public, max-age=600");
});
