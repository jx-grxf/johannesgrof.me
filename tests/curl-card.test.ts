import assert from "node:assert/strict";
import { test } from "node:test";
import { WIDTH, card, trainFrames, visibleLength, type CardData } from "../src/lib/curlCard.ts";

const data = (overrides: Partial<CardData> = {}): CardData => ({
  lang: "de",
  eyebrow: "Servus, ich bin Johannes.",
  title: "Software, die eine Sache richtig macht.",
  body: "Ein Absatz, der lang genug ist, um umgebrochen zu werden, weil er weit über achtzig Zeichen hinausgeht und dann noch ein Stück weiter.",
  oeffigo: { tagline: "Die Öffi-App für ganz Österreich.", status: "geschlossene TestFlight-Beta", url: "https://oeffigo.app" },
  kontobuch: { description: "Dein digitales Rechnungswesen-Heft mit einer Beschreibung, die viel zu lang für eine Zeile ist.", url: "https://kontobuch.johannesgrof.me/" },
  projects: [
    { name: "agent-presence", tagline: "Discord Rich Presence für zwei Coding-Agenten, mit einem sehr langen Satz dahinter.", status: "In Entwicklung" },
    { name: "poise", tagline: "Kurz.", status: "Aktiv" },
  ],
  board: {
    stop: "Praterstern",
    updatedAt: "2026-10-11T15:45:00.000Z",
    departures: [
      { line: "U1", towards: "Leopoldau", minutes: 0, realtime: true, type: "ptMetro" },
      { line: "N66", towards: "Eine Endstation mit einem Namen, der nicht auf die Tafel passt", minutes: 12, realtime: false, type: "ptBusNight" },
    ],
  },
  links: [{ label: "github", url: "https://github.com/jx-grxf" }],
  served: { edge: "fra1", region: "fra1", ms: 12 },
  viennaTime: "17:45",
  ...overrides,
});

test("no card line is wider than the card", () => {
  for (const line of card(data()).split("\n")) assert.ok(visibleLength(line) <= WIDTH, `${visibleLength(line)}: ${line}`);
});

test("board rows line up with the box", () => {
  const rows = card(data()).split("\n").filter((line) => line.includes("│"));
  const widths = new Set(rows.map(visibleLength));
  assert.equal(widths.size, 1, [...widths].join(","));
});

test("a dark board still renders", () => {
  assert.match(card(data({ board: null })), /Tafel ist gerade dunkel/);
});

test("every train frame has the same height and fits the width", () => {
  const frames = trainFrames();
  assert.ok(frames.length > 20);
  for (const frame of frames) {
    assert.equal(frame.length, frames[0]!.length);
    for (const line of frame) assert.equal(visibleLength(line), WIDTH);
  }
});
