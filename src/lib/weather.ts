/** Weather for the desktop's clock widget: where the visitor is, and where I
 *  am, side by side. The visitor's browser never talks to a weather provider —
 *  everything here runs on the server from Vercel's geolocation headers. */

export type Condition = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "showers" | "thunder";

export interface Place {
  /** Empty when the request carried no city header; the client omits the label. */
  city: string;
  region: string;
  country: string;
  timeZone: string;
  /** Null when the weather lookup failed — the place still renders, without a temperature. */
  temperature: number | null;
  condition: Condition | null;
  isDay: boolean;
}

export interface WeatherPayload {
  /** Null when the request carried no usable geolocation (local dev, or a
   *  visitor Vercel cannot place). Only my own side renders then. */
  visitor: Place | null;
  home: Place;
}

/** Where I actually am. Feldbach, south-east Styria. */
export const HOME = {
  city: "Feldbach",
  region: "Steiermark",
  country: "AT",
  timeZone: "Europe/Vienna",
  latitude: 46.95,
  longitude: 15.888,
} as const;

/** WMO weather interpretation codes, collapsed to the nine conditions the
 *  widget can actually draw. Anything unknown stays null rather than guessing. */
export function toCondition(code: unknown): Condition | null {
  if (typeof code !== "number" || !Number.isFinite(code)) return null;

  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 80 && code <= 82) return "showers";
  if (code >= 95) return "thunder";

  return null;
}

/** Vercel percent-encodes the city header, and a malformed value must not take
 *  the endpoint down with a URIError. */
export function decodeHeader(value: string | null): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
}

/** Rounded to one decimal — roughly 11 km. Precise enough to name the weather,
 *  far too coarse to locate anyone, and it keeps upstream lookups repetitive
 *  enough to be cheap. */
export function roundCoordinate(value: string | null, limit: number): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || Math.abs(parsed) > limit) return null;

  return Math.round(parsed * 10) / 10;
}

/** IANA zone names only; the value ends up in Intl.DateTimeFormat on the client,
 *  where an unexpected string throws a RangeError. */
export function safeTimeZone(value: string | null, fallback: string): string {
  if (!value || !/^[A-Za-z][\w+-]*(?:\/[\w+-]+){1,2}$/.test(value)) return fallback;

  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return value;
  } catch {
    return fallback;
  }
}

interface CurrentReading {
  temperature: number | null;
  condition: Condition | null;
  isDay: boolean;
}

const EMPTY_READING: CurrentReading = { temperature: null, condition: null, isDay: true };

/** Open-Meteo answers a multi-coordinate request with an array, and a
 *  single-coordinate request with a bare object. Both shapes land here. */
export function parseCurrent(data: unknown, index: number): CurrentReading {
  const list = Array.isArray(data) ? data : [data];
  const entry = list[index];
  if (!entry || typeof entry !== "object") return EMPTY_READING;

  const current = (entry as Record<string, unknown>).current;
  if (!current || typeof current !== "object") return EMPTY_READING;

  const reading = current as Record<string, unknown>;
  const temperature = typeof reading.temperature_2m === "number" && Number.isFinite(reading.temperature_2m) ? Math.round(reading.temperature_2m) : null;

  return {
    temperature,
    condition: toCondition(reading.weather_code),
    // is_day is 1/0 in the API; anything else falls back to daytime styling.
    isDay: reading.is_day !== 0,
  };
}
