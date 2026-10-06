// Live departures from Wiener Linien open data (CC BY 4.0, Stadt Wien).
// Pure helpers so the parsing can be tested without the network.

export interface DepartureStop {
  slug: string;
  name: string;
  diva: number;
}

/** The stops the home page board can show. A closed list keeps upstream load bounded. */
export const departureStops: DepartureStop[] = [
  { slug: "praterstern", name: "Praterstern", diva: 60201040 },
  { slug: "karlsplatz", name: "Karlsplatz", diva: 60200657 },
  { slug: "stephansplatz", name: "Stephansplatz", diva: 60201320 },
  { slug: "westbahnhof", name: "Westbahnhof", diva: 60201468 },
  { slug: "hauptbahnhof", name: "Hauptbahnhof", diva: 60201349 },
];

export interface Departure {
  line: string;
  towards: string;
  minutes: number;
  /** True when the operator supplied a real-time prediction, false for timetable only. */
  realtime: boolean;
  type: string;
}

interface WlDeparture {
  departureTime?: { timePlanned?: string; timeReal?: string; countdown?: number };
  vehicle?: { name?: string; towards?: string; type?: string };
}

interface WlLine {
  name?: string;
  towards?: string;
  type?: string;
  departures?: { departure?: WlDeparture[] };
}

interface WlMonitorResponse {
  data?: { monitors?: { lines?: WlLine[] }[] };
}

const tidy = (value: string | undefined) => (value ?? "").replace(/\s+/g, " ").trim();

/** Flattens a monitor response into the next departures, soonest first, one row per line and direction. */
export function parseMonitor(response: WlMonitorResponse, limit = 8): Departure[] {
  const rows: Departure[] = [];
  for (const monitor of response.data?.monitors ?? []) {
    for (const line of monitor.lines ?? []) {
      const next = (line.departures?.departure ?? []).find((d) => typeof d.departureTime?.countdown === "number");
      if (!next?.departureTime) continue;
      rows.push({
        line: tidy(next.vehicle?.name ?? line.name),
        towards: tidy(next.vehicle?.towards ?? line.towards),
        minutes: Math.max(0, next.departureTime.countdown ?? 0),
        realtime: Boolean(next.departureTime.timeReal),
        type: next.vehicle?.type ?? line.type ?? "",
      });
    }
  }
  const seen = new Set<string>();
  return rows
    .sort((a, b) => a.minutes - b.minutes)
    .filter((row) => {
      const key = `${row.line}|${row.towards}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
