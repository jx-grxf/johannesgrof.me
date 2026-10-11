import assert from "node:assert/strict";
import { test } from "node:test";
import { GUESTBOOK_MAX, cleanGuestbookText, isPresenceId, isZugToken } from "../src/lib/live.ts";

test("guestbook text becomes one clean line", () => {
  assert.equal(cleanGuestbookText("  servus\n\naus\tGraz  "), "servus aus Graz");
  assert.equal(cleanGuestbookText("a\u001b[31mred\u0007"), "a [31mred");
  assert.equal(cleanGuestbookText("evil‮esrever"), "evil esrever");
  assert.equal([...cleanGuestbookText("x".repeat(500))].length, GUESTBOOK_MAX);
});

test("tokens and presence ids only accept their own shape", () => {
  assert.ok(isZugToken("k7f3m"));
  assert.ok(!isZugToken("K7F3M"));
  assert.ok(!isZugToken("k7f3m:x"));
  assert.ok(!isZugToken("abcd1"));
  assert.ok(isPresenceId("a1b2c3d4e5"));
  assert.ok(!isPresenceId("../who"));
});
