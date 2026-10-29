import assert from "node:assert/strict";
import { test } from "node:test";
import { isHalloween, isHalloweenNight } from "../src/lib/season.ts";

test("the window runs from 24 October to 1 November, Vienna time", () => {
  // 23 Oct 21:59 UTC is 23:59 in Vienna (CEST), 22:00 UTC already the 24th.
  assert.equal(isHalloween(new Date("2026-10-23T21:59:00Z")), false);
  assert.equal(isHalloween(new Date("2026-10-23T22:00:00Z")), true);
  // 1 Nov 22:59 UTC is 23:59 in Vienna (CET), 23:00 UTC the 2nd.
  assert.equal(isHalloween(new Date("2026-11-01T22:59:00Z")), true);
  assert.equal(isHalloween(new Date("2026-11-01T23:00:00Z")), false);
});

test("the flashlight evening is 31 October from 17:00 until 06:00", () => {
  assert.equal(isHalloweenNight(new Date("2026-10-31T15:59:00Z")), false);
  assert.equal(isHalloweenNight(new Date("2026-10-31T16:00:00Z")), true);
  assert.equal(isHalloweenNight(new Date("2026-11-01T04:59:00Z")), true);
  assert.equal(isHalloweenNight(new Date("2026-11-01T05:00:00Z")), false);
  assert.equal(isHalloweenNight(new Date("2026-10-30T20:00:00Z")), false);
});
