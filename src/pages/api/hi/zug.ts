import type { APIRoute } from "astro";
import { allow, clientIp, createZugToken, pollZug } from "@/lib/live";

// The browser half of "call the train": POST hands out a code for the curl
// command shown on the page, GET is polled by that tab until the code is rung.
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

export const POST: APIRoute = async ({ request }) => {
  if (!(await allow("zug-token", clientIp(request), 10, "10 m"))) return json({ error: "slow_down" }, 429);
  const token = await createZugToken();
  return token ? json({ token, ttl: 600 }) : json({ error: "unavailable" }, 503);
};

export const GET: APIRoute = async ({ url }) => json({ state: await pollZug(url.searchParams.get("token") ?? "") });
