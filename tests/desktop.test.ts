import assert from "node:assert/strict";
import test from "node:test";
import { clampWindow } from "../src/lib/desktop.ts";

test("a window dragged past the right edge stays reachable", () => {
  const size = clampWindow(5000, 40, 700, 500, 1440, 900);

  assert.equal(size.width, 700);
  assert.equal(size.x, 1440 - 700 - 8);
});

test("a window dragged above the menu bar is pushed back down", () => {
  const size = clampWindow(100, -400, 700, 500, 1440, 900);

  assert.equal(size.y, 8);
});

test("a window keeps its title bar on screen after the display shrinks", () => {
  // Restored at its old size onto a much smaller viewport.
  const size = clampWindow(1200, 700, 1100, 800, 900, 600);

  assert.ok(size.x + size.width <= 900, "right edge stays inside the viewport");
  assert.ok(size.y >= 8, "title bar stays below the menu bar");
  assert.ok(size.width <= 900 - 16);
});

test("a window cannot be resized below a usable size", () => {
  const size = clampWindow(100, 100, 40, 40, 1440, 900);

  assert.equal(size.width, 320);
  assert.equal(size.height, 240);
});

test("a viewport smaller than the minimum still returns a positioned window", () => {
  const size = clampWindow(0, 0, 320, 240, 200, 150);

  assert.ok(Number.isFinite(size.x) && Number.isFinite(size.y));
  assert.ok(size.width >= 280);
  assert.ok(size.height >= 200);
});
