import type { APIRoute } from "astro";
import { edgeLocation, functionRegion } from "#platform";

// A tiny uncached endpoint so the browser terminal can measure its real
// round-trip time to the edge that serves the site.
export const prerender = false;

export const GET: APIRoute = ({ request }) =>
  new Response(JSON.stringify({ pong: true, at: Date.now(), edge: edgeLocation(request), region: functionRegion() }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
