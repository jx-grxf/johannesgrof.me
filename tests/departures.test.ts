import assert from "node:assert/strict";
import { test } from "node:test";
import { departureStops, parseMonitor } from "../src/lib/departures.ts";

const line = (name: string, towards: string, countdown: number, real = true) => ({
  name,
  towards,
  type: "ptMetro",
  departures: {
    departure: [
      {
        departureTime: { timePlanned: "2026-10-06T19:58:45.000+0200", ...(real ? { timeReal: "2026-10-06T19:58:23.000+0200" } : {}), countdown },
        vehicle: { name, towards, type: "ptMetro" },
      },
    ],
  },
});

test("sorts departures soonest first and keeps the operator real-time flag", () => {
  const rows = parseMonitor({ data: { monitors: [{ lines: [line("U1", "Leopoldau", 6), line("O", "Raxstraße", 2, false)] }] } });
  assert.deepEqual(rows.map((r) => [r.line, r.minutes, r.realtime]), [["O", 2, false], ["U1", 6, true]]);
});

test("drops duplicate line and direction pairs across monitors", () => {
  const rows = parseMonitor({ data: { monitors: [{ lines: [line("U1", "Leopoldau", 4)] }, { lines: [line("U1", "Leopoldau", 9)] }] } });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].minutes, 4);
});

test("tolerates empty or malformed responses", () => {
  assert.deepEqual(parseMonitor({}), []);
  assert.deepEqual(parseMonitor({ data: { monitors: [{ lines: [{ name: "5", departures: { departure: [] } }] }] } }), []);
});

test("stop list has unique slugs and numeric DIVA ids", () => {
  assert.equal(new Set(departureStops.map((s) => s.slug)).size, departureStops.length);
  assert.ok(departureStops.every((s) => Number.isInteger(s.diva) && s.diva > 60_000_000));
});
