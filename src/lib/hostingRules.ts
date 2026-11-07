// Applies the redirects, rewrites and headers from vercel.json outside Vercel, so the
// file stays the one place for them on both hosts. Same pattern syntax as Vercel
// (path-to-regexp 6), same order: redirects, then rewrites, headers on the response.

import { compile, pathToRegexp, type Key } from "path-to-regexp";

type Condition = { type: "host" | "query" | "header"; key?: string; value?: string };
type Redirect = { source: string; destination: string; permanent?: boolean; has?: Condition[] };
type Rewrite = { source: string; destination: string; has?: Condition[] };
type HeaderRule = { source: string; headers: { key: string; value: string }[]; has?: Condition[] };
export type VercelConfig = { redirects?: Redirect[]; rewrites?: Rewrite[]; headers?: HeaderRule[] };

type Compiled<T> = T & { regexp: RegExp; keys: Key[] };

const prepare = <T extends { source: string }>(rules: T[] = []): Compiled<T>[] =>
  rules.map((rule) => {
    const keys: Key[] = [];
    return { ...rule, regexp: pathToRegexp(rule.source, keys), keys };
  });

const conditionsHold = (has: Condition[] | undefined, url: URL, request: Request): boolean =>
  (has ?? []).every((condition) => {
    if (condition.type === "host") return url.hostname === condition.value;
    if (condition.type === "query") {
      const value = url.searchParams.get(condition.key ?? "");
      return value !== null && (condition.value === undefined || value === condition.value);
    }
    const value = request.headers.get(condition.key ?? "");
    return value !== null && (condition.value === undefined || value === condition.value);
  });

const matchRule = <T extends { has?: Condition[] }>(
  rule: Compiled<T>,
  url: URL,
  request: Request,
): Record<string, string> | null => {
  const found = rule.regexp.exec(url.pathname);
  if (!found || !conditionsHold(rule.has, url, request)) return null;
  const params: Record<string, string> = {};
  rule.keys.forEach((key, index) => {
    const value = found[index + 1];
    if (value !== undefined) params[String(key.name)] = value;
  });
  return params;
};

const fillDestination = (destination: string, params: Record<string, string>, url: URL): URL => {
  const target = new URL(destination, url.origin);
  if (target.pathname.includes(":")) {
    const segments = Object.fromEntries(
      Object.entries(params).map(([name, value]) => [name, value.split("/").filter(Boolean)]),
    );
    target.pathname = compile(decodeURIComponent(target.pathname), { encode: (v) => v, validate: false })(segments);
    // The captured path drops a trailing slash; keep it so /x/ does not land on /x.
    if (url.pathname.endsWith("/") && !target.pathname.endsWith("/")) target.pathname += "/";
  }
  // Vercel passes the incoming query string through unless the destination sets one.
  if (!target.search && url.search) target.search = url.search;
  return target;
};

export function createHostingRules(config: VercelConfig) {
  const redirects = prepare(config.redirects);
  const rewrites = prepare(config.rewrites);
  const headers = prepare(config.headers);

  return {
    redirect(request: Request): Response | null {
      const url = new URL(request.url);
      for (const rule of redirects) {
        const params = matchRule(rule, url, request);
        if (!params) continue;
        const location = fillDestination(rule.destination, params, url);
        return new Response(null, { status: rule.permanent ? 308 : 307, headers: { Location: location.toString() } });
      }
      return null;
    },

    rewrite(request: Request): Request {
      const url = new URL(request.url);
      for (const rule of rewrites) {
        const params = matchRule(rule, url, request);
        if (!params) continue;
        const target = fillDestination(rule.destination, params, url);
        if (target.origin !== url.origin) return request;
        return new Request(target.toString(), request);
      }
      return request;
    },

    headersFor(request: Request): Headers {
      const url = new URL(request.url);
      const out = new Headers();
      for (const rule of headers) {
        if (!matchRule(rule, url, request)) continue;
        for (const { key, value } of rule.headers) out.set(key, value);
      }
      return out;
    },
  };
}

const directive = (cacheControl: string, name: string): number | null => {
  const found = new RegExp(`(?:^|,)\\s*${name}=(\\d+)`, "i").exec(cacheControl);
  return found ? Number(found[1]) : null;
};

// The Worker cache keeps a response only when this header says so. Only what the
// response already marks for shared caches (Vercel-CDN-Cache-Control, s-maxage) or as
// immutable is kept, so a deploy shows up at once everywhere else, as it does on Vercel.
export function edgeCacheControl(method: string, response: Response): string {
  const cacheControl = response.headers.get("cache-control") ?? "";
  const cdnControl = response.headers.get("vercel-cdn-cache-control") ?? "";
  const cacheable =
    (method === "GET" || method === "HEAD") &&
    !response.headers.has("set-cookie") &&
    !/\b(private|no-store)\b/i.test(cacheControl) &&
    !/\b(private|no-store|no-cache)\b/i.test(cdnControl);
  if (!cacheable) return "no-store";
  const cdn = directive(cdnControl, "max-age");
  if (cdn !== null && cdn > 0) {
    const swr = directive(cdnControl, "stale-while-revalidate");
    return `public, max-age=${cdn}${swr ? `, stale-while-revalidate=${swr}` : ""}`;
  }
  if (/\bno-cache\b/i.test(cacheControl)) return "no-store";
  const shared = directive(cacheControl, "s-maxage");
  if (shared !== null && shared > 0) {
    const swr = directive(cacheControl, "stale-while-revalidate");
    return `public, max-age=${shared}${swr ? `, stale-while-revalidate=${swr}` : ""}`;
  }
  if (/\bimmutable\b/i.test(cacheControl)) {
    const age = directive(cacheControl, "max-age");
    if (age) return `public, max-age=${age}, immutable`;
  }
  return "no-store";
}
