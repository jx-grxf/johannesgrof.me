export const TURNSTILE_ACTION = "turnstile-spin-v2";
export const MAX_TURNSTILE_TOKEN_LENGTH = 2048;

type Verification = { ok: true } | { ok: false; error: "verification_failed" | "verification_unavailable" };

interface VerificationInput {
  token: string;
  secret: string;
  hostname: string;
  remoteip: string;
}

export async function verifyTurnstile(input: VerificationInput, fetcher: typeof fetch = fetch): Promise<Verification> {
  if (!input.token || input.token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return { ok: false, error: "verification_failed" };
  }
  try {
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: input.secret, response: input.token, remoteip: input.remoteip }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return { ok: false, error: "verification_unavailable" };
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return { ok: false, error: "verification_unavailable" };
    const data = result as Record<string, unknown>;
    if (data.success !== true || data.action !== TURNSTILE_ACTION || data.hostname !== input.hostname) {
      return { ok: false, error: "verification_failed" };
    }
    return { ok: true };
  } catch {
    console.error("Contact form: Turnstile verification could not complete.");
    return { ok: false, error: "verification_unavailable" };
  }
}
