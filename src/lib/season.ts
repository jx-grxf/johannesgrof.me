// Halloween on the site: 24 October to 1 November, Vienna time, every year,
// and it switches itself off without a deploy. Dates are month * 100 + day so
// the inline script in BaseHead can compare them without a date library.
export const HALLOWEEN = {
  from: 1024,
  to: 1101,
  /** The flashlight evening: 31 October from 17:00 until 06:00 the next morning. */
  night: 1031,
  nightFromHour: 17,
  nightUntilHour: 6,
} as const;

interface ViennaClock {
  monthDay: number;
  hour: number;
}

export function viennaClock(date = new Date()): ViennaClock {
  const parts: Record<string, number> = {};
  for (const part of new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Vienna", month: "numeric", day: "numeric", hour: "numeric", hourCycle: "h23" }).formatToParts(date)) {
    parts[part.type] = Number(part.value);
  }
  return { monthDay: (parts.month ?? 0) * 100 + (parts.day ?? 0), hour: parts.hour ?? 0 };
}

export function isHalloween(date = new Date()): boolean {
  const { monthDay } = viennaClock(date);
  return monthDay >= HALLOWEEN.from && monthDay <= HALLOWEEN.to;
}

export function isHalloweenNight(date = new Date()): boolean {
  const { monthDay, hour } = viennaClock(date);
  return (monthDay === HALLOWEEN.night && hour >= HALLOWEEN.nightFromHour) || (monthDay === HALLOWEEN.to && hour < HALLOWEEN.nightUntilHour);
}

/** In the browser: what the head script decided before the first paint. */
export const seasonOn = () => typeof document !== "undefined" && document.documentElement.dataset.season === "halloween";
export const seasonNight = () => seasonOn() && "seasonNight" in document.documentElement.dataset;
