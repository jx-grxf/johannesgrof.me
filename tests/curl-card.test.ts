import assert from "node:assert/strict";
import { test } from "node:test";
import { WIDTH, card, helpCard, messageCard, pumpkinFrame, stationCard, trainFrames, visibleLength, type CardData } from "../src/lib/curlCard.ts";

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
  here: 3,
  guestbook: [
    { text: "Servus aus Graz! Ein Eintrag, der so lang ist, dass er im Kasten umbrechen muss, damit nichts über den Rand ragt, und noch etwas.", at: "2026-10-11T15:00:00.000Z" },
    { text: "kurz", at: "2026-10-10T15:00:00.000Z" },
  ],
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

test("control characters from the departures feed never reach the terminal", () => {
  const evil = data({
    board: {
      stop: "Prater\x1b]0;pwned\x07stern",
      updatedAt: "2026-10-11T15:45:00.000Z",
      departures: [{ line: "U1\x1b[2J", towards: "Leopoldau\x1b]8;;https://evil.example\x1b\\", minutes: 1, realtime: true, type: "ptMetro" }],
    },
  });
  const out = card(evil);
  assert.ok(!out.includes("\x1b]8;;https://evil.example"));
  assert.ok(!out.includes("\x1b]0;"));
  assert.ok(!out.includes("\x07"));
  assert.ok(!out.includes("\x1b[2J"));
});

test("station board, help and messages stay inside the card width", () => {
  const station = stationCard(
    { stop: "Schottentor", updatedAt: "2026-10-11T15:45:00.000Z", departures: Array.from({ length: 14 }, (_, i) => ({ line: `D${i}`, towards: "Nußdorf, Beethovengang und noch viel weiter", minutes: i, realtime: i % 2 === 0, type: "ptTram" })) },
    "schottentor",
    ["Schottenring", "Schottentor (Universität)"],
    "de",
  );
  for (const text of [station, helpCard("de"), helpCard("en"), messageCard([{ text: "Danke, ist angekommen.", tone: "ok" }])]) {
    for (const line of text.split("\n")) assert.ok(visibleLength(line) <= WIDTH, `${visibleLength(line)}: ${line}`);
  }
  assert.equal(station.split("\n").filter((line) => line.includes("D1")).length > 0, true);
});

test("guestbook entries are cleaned before they reach a terminal", () => {
  const out = card(data({ guestbook: [{ text: "hi\x1b]0;pwned\x07 there", at: "2026-10-11T15:00:00.000Z" }] }));
  assert.ok(!out.includes("\x1b]0;"));
});

test("the ghost train has the same frames as the day train", () => {
  const day = trainFrames(3);
  const haunted = trainFrames(3, true);
  assert.equal(haunted.length, day.length);
  for (const frame of haunted) {
    assert.equal(frame.length, day[0]!.length);
    for (const line of frame) assert.ok(visibleLength(line) <= WIDTH);
  }
});

test("every pumpkin frame has the same height and stays inside the card", () => {
  const heights = new Set([0, 1, 2, 3, 4, 7].map((candle) => pumpkinFrame(candle).length));
  assert.equal(heights.size, 1);
  for (const line of pumpkinFrame()) assert.ok(visibleLength(line) <= WIDTH);
});
