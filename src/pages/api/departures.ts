import type { APIRoute } from "astro";
import { departureStops, parseMonitor, type Departure } from "@/lib/departures";

// Live departures for the ÖffiGo board on the home page.
//
// Only Wiener Linien open data (CC BY 4.0, Stadt Wien) is used here, never the
// VAO data ÖffiGo itself has under contract. Upstream load stays bounded by a
// closed list of stops, a short per-stop cache inside the instance, and the
// Vercel CDN cache on top.
export const prerender = false;

const UPSTREAM = "https://www.wienerlinien.at/ogd_realtime/monitor";
/** Coalesces bursts inside one instance; the CDN below does the long-range caching. */
const TTL_MS = 10_000;
const STALE_MS = 5 * 60_000;
const DEADLINE_MS = 3_500;

interface Snapshot {
  at: number;
  departures: Departure[];
}

const cache = new Map<string, Snapshot>();
const inFlight = new Map<string, Promise<Snapshot>>();

async function load(diva: number): Promise<Snapshot> {
  const response = await fetch(`${UPSTREAM}?diva=${diva}`, {
    headers: { Accept: "application/json", "User-Agent": "johannesgrof.me departures board" },
    signal: AbortSignal.timeout(DEADLINE_MS),
  });
  if (!response.ok) throw new Error(`upstream ${response.status}`);
  return { at: Date.now(), departures: parseMonitor(await response.json()) };
}

// Browsers always revalidate (the board polls every 30 s anyway); Vercel's CDN
// holds one answer per stop for 20 s and may serve it 30 s longer while it
// refreshes. With the 10 s instance cache a departure is at most about a minute
// old, and the board prints the time of the data it shows. Errors are not cached.
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? "public, max-age=0, must-revalidate" : "no-store",
      ...(status === 200 ? { "Vercel-CDN-Cache-Control": "max-age=20, stale-while-revalidate=30" } : {}),
    },
  });

export const GET: APIRoute = async ({ url }) => {
  const stop = departureStops.find((s) => s.slug === url.searchParams.get("stop")) ?? departureStops[0];
  const cached = cache.get(stop.slug);
  const fresh = cached && Date.now() - cached.at < TTL_MS;

  if (!fresh) {
    let pending = inFlight.get(stop.slug);
    if (!pending) {
      pending = load(stop.diva).finally(() => inFlight.delete(stop.slug));
      inFlight.set(stop.slug, pending);
    }
    try {
      cache.set(stop.slug, await pending);
    } catch {
      // A short upstream blip: serve the last good snapshot if it is recent enough.
      if (!cached || Date.now() - cached.at > STALE_MS) {
        return json({ stop: stop.slug, error: "unavailable" }, 503);
      }
    }
  }

  const snapshot = cache.get(stop.slug)!;
  return json({
    stop: stop.slug,
    name: stop.name,
    updatedAt: new Date(snapshot.at).toISOString(),
    departures: snapshot.departures,
    source: "Wiener Linien, data.wien.gv.at (CC BY 4.0)",
  });
};
