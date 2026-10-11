// Finds a Vienna stop from what someone typed into a URL: "schottentor",
// "karlsplatz", "westbhf", "Wien Mitte". Pure, so it can be tested.

export type Stop = readonly [diva: number, name: string];

export const normalize = (text: string) =>
  text
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(ast\)/g, "")
    .replace(/\bbhf\b|bahnhof/g, "bf")
    .replace(/strasse\b/g, "str")
    .replace(/[^a-z0-9]+/g, "");

// What people call a stop when it differs from the Wiener Linien name.
const ALIASES: Record<string, string> = {
  wienmitte: "mittelandstr",
  hbf: "hauptbf",
  wienhbf: "hauptbf",
  ring: "schottentor",
};

export interface StopMatch {
  stop: Stop | null;
  suggestions: Stop[];
}

/** Exact name first, then names that start with the query, then names that contain it, then names that contain every word; shorter names win ties. */
export function findStop(stops: readonly Stop[], query: string): StopMatch {
  let raw = query;
  try {
    raw = decodeURIComponent(query);
  } catch {}
  raw = raw.replace(/[-_+]/g, " ");
  const normalized = normalize(raw);
  const q = ALIASES[normalized] ?? normalized;
  if (!q) return { stop: null, suggestions: [] };
  const words = raw.split(/\s+/).map(normalize).filter(Boolean);
  const scored = stops
    .map((stop) => {
      const name = normalize(stop[1]);
      const rank = name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : words.length > 1 && words.every((word) => name.includes(word)) ? 3 : -1;
      return { stop, rank, length: name.length };
    })
    .filter((entry) => entry.rank !== -1)
    .sort((a, b) => a.rank - b.rank || a.length - b.length || a.stop[1].localeCompare(b.stop[1], "de"));
  return { stop: scored[0]?.stop ?? null, suggestions: scored.slice(1, 6).map((entry) => entry.stop) };
}
