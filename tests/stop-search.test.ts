import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { findStop, type Stop } from "../src/lib/stopSearch.ts";

const stops = JSON.parse(readFileSync(new URL("../src/data/viennaStops.json", import.meta.url), "utf8")) as Stop[];
const name = (query: string) => findStop(stops, query).stop?.[1];

test("finds stops the way people type them", () => {
  assert.equal(name("schottentor"), "Schottentor");
  assert.equal(name("Karlsplatz"), "Karlsplatz");
  assert.equal(name("westbahnhof"), "Westbahnhof");
  assert.equal(name("wien-mitte"), "Mitte-Landstraße");
  assert.equal(name("stephansplatz"), "Stephansplatz");
  assert.equal(name("reumann"), "Reumannplatz");
  assert.equal(name("Schwedenplatz"), "Schwedenplatz");
});

test("unknown stops return nothing instead of a random guess", () => {
  assert.equal(findStop(stops, "jakominiplatz").stop, null);
  assert.equal(findStop(stops, "").stop, null);
});

test("umlauts and spaces in the URL", () => {
  assert.equal(name("D%C3%B6blinger%20Hauptstra%C3%9Fe"), findStop(stops, "doeblinger hauptstrasse").stop?.[1]);
});
