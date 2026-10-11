import assert from "node:assert/strict";
import { test } from "node:test";
import { buildContributionGrid } from "../src/lib/contributions.ts";

const week = (start: number, counts: number[]) => ({
  contributionDays: counts.map((contributionCount, i) => ({ date: `2026-10-${String(start + i).padStart(2, "0")}`, contributionCount })),
});

test("streaks, totals and the busiest day", () => {
  const grid = buildContributionGrid([week(1, [0, 2, 3, 4, 0, 1, 1]), week(8, [9, 1, 0])], []);
  assert.equal(grid.total, 21);
  assert.equal(grid.activeDays, 7);
  // 6th to 9th October run across the week boundary; the empty last day is today.
  assert.equal(grid.longestStreak, 4);
  assert.equal(grid.currentStreak, 4);
  assert.deepEqual(grid.busiest, { date: "2026-10-08", count: 9 });
});

test("an empty today does not break the current streak", () => {
  const grid = buildContributionGrid([week(1, [0, 2, 3, 0])], []);
  assert.equal(grid.currentStreak, 2);
});

test("levels split active days into quartiles and keep 0 for empty days", () => {
  const grid = buildContributionGrid([week(1, [0, 1, 2, 3, 4, 5, 6]), week(8, [7, 8])], []);
  const levels = grid.weeks.flat().map((day) => day.level);
  assert.equal(levels[0], 0);
  assert.equal(levels.at(-1), 4);
  assert.deepEqual([...levels].slice(1), [...levels].slice(1).sort());
});

test("private repos never appear by name", () => {
  const grid = buildContributionGrid(
    [week(5, [3])],
    [
      { repository: { name: "secret-thing", isPrivate: true }, contributions: { nodes: [{ occurredAt: "2026-10-05T10:00:00Z", commitCount: 2 }] } },
      { repository: { name: "dirhop", isPrivate: false }, contributions: { nodes: [{ occurredAt: "2026-10-05T10:00:00Z", commitCount: 1 }] } },
    ],
  );
  assert.deepEqual(grid.weeks[0]![0]!.repos, ["dirhop"]);
});

test("commit times are counted on the Vienna date", () => {
  const grid = buildContributionGrid(
    [week(5, [1, 1])],
    [{ repository: { name: "late", isPrivate: false }, contributions: { nodes: [{ occurredAt: "2026-10-05T22:30:00Z", commitCount: 1 }] } }],
  );
  assert.deepEqual(grid.weeks[0]![1]!.repos, ["late"]);
});
