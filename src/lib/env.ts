/** Read at runtime via process.env (falling back to import.meta.env for local
 *  dev) so changing a Vercel env var takes effect on redeploy without the value
 *  being baked into the build. */
export const env = (key: string): string | undefined =>
  process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key];

/** One JSON response shape for every endpoint, always uncacheable by default.
 *  Callers that want an edge cache pass their own Cache-Control. */
export const json = (status: number, body: unknown, cacheControl = "no-store") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": cacheControl },
  });
