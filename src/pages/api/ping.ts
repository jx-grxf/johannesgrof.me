import type { APIRoute } from "astro";

// A tiny uncached endpoint so the browser terminal can measure its real
// round-trip time to the site's Vercel edge.
export const prerender = false;

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ pong: true, at: Date.now(), region: process.env.VERCEL_REGION ?? null }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
