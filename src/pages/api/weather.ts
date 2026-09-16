import type { APIRoute } from "astro";
import { json } from "@/lib/env";
import { decodeHeader, HOME, parseCurrent, roundCoordinate, safeTimeZone, type Place, type WeatherPayload } from "@/lib/weather";

// On-demand function: the answer depends on who is asking.
export const prerender = false;

const REQUEST_TIMEOUT_MS = 6000;

// Deliberately NOT a shared edge cache. The response names the visitor's own
// city, so a public s-maxage would serve one visitor's location to the next one
// behind the same edge. Private means this browser only, for fifteen minutes.
const CACHE_CONTROL = "private, max-age=900";

// Open-Meteo's free tier is 10k calls a day for non-commercial use, and the data
// is CC BY 4.0 — the widget carries the attribution.
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

const fetchCurrent = async (points: { latitude: number; longitude: number }[]): Promise<unknown> => {
  const url = new URL(OPEN_METEO);
  url.searchParams.set("latitude", points.map((p) => p.latitude).join(","));
  url.searchParams.set("longitude", points.map((p) => p.longitude).join(","));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) {
      console.warn(`[api/weather] open-meteo responded ${response.status}`);
      return undefined;
    }
    return await response.json();
  } catch (error) {
    console.warn(`[api/weather] ${error instanceof Error ? error.message : "request failed"}`);
    return undefined;
  }
};

export const GET: APIRoute = async ({ request }) => {
  const header = (name: string) => request.headers.get(name);

  // Vercel sets these on every request to a function; locally they are absent
  // and the endpoint answers with my side only.
  const latitude = roundCoordinate(header("x-vercel-ip-latitude"), 90);
  const longitude = roundCoordinate(header("x-vercel-ip-longitude"), 180);
  const hasVisitorLocation = latitude !== null && longitude !== null;

  // My own coordinates are already coarse, so both points go upstream in one
  // request — two locations, one call against the daily budget.
  const points = hasVisitorLocation
    ? [
        { latitude, longitude },
        { latitude: HOME.latitude, longitude: HOME.longitude },
      ]
    : [{ latitude: HOME.latitude, longitude: HOME.longitude }];

  const data = await fetchCurrent(points);

  const home: Place = {
    city: HOME.city,
    region: HOME.region,
    country: HOME.country,
    timeZone: HOME.timeZone,
    ...parseCurrent(data, hasVisitorLocation ? 1 : 0),
  };

  const visitor: Place | null = hasVisitorLocation
    ? {
        city: decodeHeader(header("x-vercel-ip-city")),
        region: decodeHeader(header("x-vercel-ip-country-region")),
        country: decodeHeader(header("x-vercel-ip-country")).slice(0, 2).toUpperCase(),
        timeZone: safeTimeZone(header("x-vercel-ip-timezone"), HOME.timeZone),
        ...parseCurrent(data, 0),
      }
    : null;

  const payload: WeatherPayload = { visitor, home };

  return json(200, payload, CACHE_CONTROL);
};
