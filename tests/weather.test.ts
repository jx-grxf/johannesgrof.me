import assert from "node:assert/strict";
import test from "node:test";
import { decodeHeader, parseCurrent, roundCoordinate, safeTimeZone, toCondition } from "../src/lib/weather.ts";

test("weather codes collapse to the conditions the widget can draw", () => {
  assert.equal(toCondition(0), "clear");
  assert.equal(toCondition(2), "partly");
  assert.equal(toCondition(3), "cloudy");
  assert.equal(toCondition(48), "fog");
  assert.equal(toCondition(55), "drizzle");
  assert.equal(toCondition(65), "rain");
  assert.equal(toCondition(73), "snow");
  assert.equal(toCondition(86), "snow");
  assert.equal(toCondition(81), "showers");
  assert.equal(toCondition(99), "thunder");
});

test("an unknown or missing weather code stays null rather than guessing", () => {
  assert.equal(toCondition(undefined), null);
  assert.equal(toCondition("3"), null);
  assert.equal(toCondition(Number.NaN), null);
  assert.equal(toCondition(12), null);
});

test("the city header is percent-decoded, and a broken one does not throw", () => {
  assert.equal(decodeHeader("Frankfurt%20am%20Main"), "Frankfurt am Main");
  assert.equal(decodeHeader("Gr%C3%A4z"), "Gräz");
  assert.equal(decodeHeader("100%"), "100%");
  assert.equal(decodeHeader(null), "");
});

test("coordinates are rounded to roughly 11 km before they leave the server", () => {
  assert.equal(roundCoordinate("47.0707", 90), 47.1);
  assert.equal(roundCoordinate("15.4395", 180), 15.4);
  assert.equal(roundCoordinate("-0.04", 90), -0);
});

test("coordinates that are missing or out of range yield no location", () => {
  assert.equal(roundCoordinate(null, 90), null);
  assert.equal(roundCoordinate("", 90), null);
  assert.equal(roundCoordinate("north", 90), null);
  assert.equal(roundCoordinate("120", 90), null);
  assert.equal(roundCoordinate("-200", 180), null);
});

test("only a real IANA zone survives; anything else falls back", () => {
  assert.equal(safeTimeZone("Europe/Vienna", "Europe/Vienna"), "Europe/Vienna");
  assert.equal(safeTimeZone("America/Argentina/Salta", "Europe/Vienna"), "America/Argentina/Salta");
  assert.equal(safeTimeZone("Nowhere/Fake", "Europe/Vienna"), "Europe/Vienna");
  assert.equal(safeTimeZone("'; DROP TABLE", "Europe/Vienna"), "Europe/Vienna");
  assert.equal(safeTimeZone(null, "Europe/Vienna"), "Europe/Vienna");
});

test("a multi-coordinate response is read by position", () => {
  const data = [
    { current: { temperature_2m: 29.4, weather_code: 3, is_day: 1 } },
    { current: { temperature_2m: 30.2, weather_code: 1, is_day: 1 } },
  ];

  assert.deepEqual(parseCurrent(data, 0), { temperature: 29, condition: "cloudy", isDay: true });
  assert.deepEqual(parseCurrent(data, 1), { temperature: 30, condition: "partly", isDay: true });
});

test("a single-coordinate response is accepted in the same shape", () => {
  assert.deepEqual(parseCurrent({ current: { temperature_2m: -4.6, weather_code: 71, is_day: 0 } }, 0), {
    temperature: -5,
    condition: "snow",
    isDay: false,
  });
});

test("a failed lookup renders the place without a temperature", () => {
  assert.deepEqual(parseCurrent(undefined, 0), { temperature: null, condition: null, isDay: true });
  assert.deepEqual(parseCurrent([], 1), { temperature: null, condition: null, isDay: true });
  assert.deepEqual(parseCurrent({ error: true }, 0), { temperature: null, condition: null, isDay: true });
});
