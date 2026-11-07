import assert from "node:assert/strict";
import { test } from "node:test";
import { leadSentences } from "../src/lib/seo.ts";

test("keeps whole sentences that fit", () => {
  assert.equal(leadSentences("One two. Three four five. Six.", 20), "One two.");
  assert.equal(leadSentences("One two. Three four five. Six.", 40), "One two. Three four five. Six.");
});

test("cuts a single long sentence at a word", () => {
  assert.equal(leadSentences("alpha beta gamma delta epsilon", 17), "alpha beta gamma…");
});
