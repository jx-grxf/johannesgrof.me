import assert from "node:assert/strict";
import test from "node:test";
import { verifyTurnstile, TURNSTILE_ACTION } from "../src/lib/turnstile.ts";

const input = { token: "issued-token", secret: "server-secret", hostname: "www.johannesgrof.me", remoteip: "192.0.2.1" };
const valid = { success: true, hostname: input.hostname, action: TURNSTILE_ACTION };
const respond = (body: unknown, status = 200): typeof fetch => async () => new Response(JSON.stringify(body), { status });

test("accepts a verified token only for this hostname and action", async () => {
  const fetcher: typeof fetch = async (url, options) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(options?.method, "POST");
    const body = options?.body as URLSearchParams;
    assert.equal(body.get("secret"), input.secret);
    assert.equal(body.get("response"), input.token);
    assert.equal(body.get("remoteip"), input.remoteip);
    assert.ok(options?.signal);
    return new Response(JSON.stringify(valid));
  };
  assert.deepEqual(await verifyTurnstile(input, fetcher), { ok: true });
});

for (const [name, result] of [
  ["invalid token", { success: false, "error-codes": ["invalid-input-response"] }],
  ["expired or reused token", { success: false, "error-codes": ["timeout-or-duplicate"] }],
  ["different site", { ...valid, hostname: "attacker.example" }],
  ["different action", { ...valid, action: "login" }],
  ["missing hostname", { success: true, action: TURNSTILE_ACTION }],
  ["truthy non-boolean success", { ...valid, success: "true" }],
] as const) {
  test(`rejects ${name}`, async () => {
    assert.deepEqual(await verifyTurnstile(input, respond(result)), { ok: false, error: "verification_failed" });
  });
}

test("empty and oversized tokens never reach Cloudflare", async () => {
  const unexpected: typeof fetch = async () => { assert.fail("must not call siteverify"); };
  for (const token of ["", "x".repeat(2049)]) {
    assert.deepEqual(await verifyTurnstile({ ...input, token }, unexpected), { ok: false, error: "verification_failed" });
  }
});

test("provider outages and malformed responses fail closed", async () => {
  for (const fetcher of [respond(valid, 503), respond(null), async () => new Response("not json"), async () => { throw new Error("timeout"); }] as typeof fetch[]) {
    assert.deepEqual(await verifyTurnstile(input, fetcher), { ok: false, error: "verification_unavailable" });
  }
});
