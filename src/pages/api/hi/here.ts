import type { APIRoute } from "astro";
import { allow, clientIp, isPresenceId, markHere } from "@/lib/live";

// Presence for "who": a random id per page load, sent every two minutes while
// the tab is visible. Answers with the number of open tabs.
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

export const POST: APIRoute = async ({ request }) => {
  const id = (await request.text()).trim();
  if (!isPresenceId(id)) return json({ error: "bad_id" }, 400);
  if (!(await allow("here", clientIp(request), 20, "10 m"))) return json({ error: "slow_down" }, 429);
  const count = await markHere(id).catch(() => null);
  return count === null ? json({ error: "unavailable" }, 503) : json({ count });
};
