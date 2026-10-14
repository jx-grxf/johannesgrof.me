import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { applyEdit, planReplacement } from "../tools/text-editor/apply.mjs";

test("replaces a fragment inside a TS string and escapes the delimiter", () => {
  const source = `export const hero = { title: "Software that does one thing, properly." };\n`;
  const plan = planReplacement("site.ts", source, "Software that does", 'Software, die "eine" Sache');
  assert.equal(plan.matches, 1);
  const result = source.slice(0, plan.start) + plan.text + source.slice(plan.end);
  assert.equal(result, `export const hero = { title: "Software, die \\"eine\\" Sache one thing, properly." };\n`);
});

test("finds text behind an escaped apostrophe or wrapped across lines", () => {
  const source = `const a = 'won\\'t cooperate';\n`;
  assert.equal(planReplacement("x.ts", source, "won't cooperate", "x").matches, 1);
  const astro = `---\nconst a = 1;\n---\n<p>\n  Daten aus\n  Wien\n</p>\n`;
  const plan = planReplacement("x.astro", astro, "Daten aus Wien", "Daten aus Graz");
  assert.equal(plan.text, "Daten aus Graz");
});

test("refuses markup characters in astro markup and matches outside strings in TS", () => {
  const astro = `---\n---\n<p class="a">Hallo Welt</p>\n`;
  assert.ok(planReplacement("x.astro", astro, "Hallo Welt", "Hallo {Welt}").reason);
  assert.ok(planReplacement("x.ts", "// Hallo Welt\n", "Hallo Welt", "Hi").reason);
});

test("applies a unique edit and leaves ambiguous ones pending", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "text-editor-"));
  const src = path.join(root, "src");
  await mkdir(src);
  await writeFile(path.join(src, "a.ts"), `export const a = ["Kontakt", "Ein einzigartiger Satz."];\n`);
  await writeFile(path.join(src, "b.ts"), `export const b = "Kontakt";\n`);

  const applied = await applyEdit(src, { from: "Ein einzigartiger Satz.", to: "Ein neuer Satz." });
  assert.equal(applied.status, "applied");
  assert.match(await readFile(path.join(src, "a.ts"), "utf8"), /"Ein neuer Satz\."/);

  const pending = await applyEdit(src, { from: "Kontakt", to: "Schreib mir" });
  assert.equal(pending.status, "pending");
});

test("takes plain text in an astro attribute but parks text that would need escaping", () => {
  const astro = `---\n---\n<img alt="Today on iPhone" />\n`;
  assert.equal(planReplacement("x.astro", astro, "Today on iPhone", "Heute am iPhone").text, "Heute am iPhone");
  assert.ok(planReplacement("x.astro", astro, "Today on iPhone", 'Heute "live"').reason);
});
