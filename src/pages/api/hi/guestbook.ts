import type { APIRoute } from "astro";
import { listGuestbook } from "@/lib/live";

// Approved guestbook entries for /hi and the site terminal. The CDN holds the list for a minute.
export const prerender = false;

export const GET: APIRoute = async () => {
  const entries = await listGuestbook(10).catch(() => []);
  return new Response(JSON.stringify({ entries: entries.map(({ text, at }) => ({ text, at })) }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Vercel-CDN-Cache-Control": "max-age=60, stale-while-revalidate=60",
    },
  });
};
