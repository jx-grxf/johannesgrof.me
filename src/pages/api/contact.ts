import type { APIRoute } from "astro";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { MAX_TURNSTILE_TOKEN_LENGTH, verifyTurnstile } from "@/lib/turnstile";

// Runs as an on-demand Vercel function rather than being prerendered.
export const prerender = false;

// Read at runtime via process.env (falling back to import.meta.env for local
// dev) so changing a Vercel env var takes effect on redeploy without the value
// being baked into the build.
const env = (key: string): string | undefined => process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-IP rate limit backed by Upstash Redis (shared across all serverless
// instances). Lazily created and only active when the Upstash env vars are
// present, so the form keeps working before the integration is provisioned.
let ratelimit: Ratelimit | null = null;
const getRatelimit = () => {
  if (ratelimit) {
    return ratelimit;
  }
  // The Vercel Upstash integration provisions KV_REST_API_* vars; fall back to
  // the UPSTASH_REDIS_REST_* names in case a plain Upstash setup is used.
  const url = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
  const token = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) {
    return null;
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    // 3 submissions per IP per 10 minutes.
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    prefix: "ratelimit:contact",
    analytics: false,
  });
  return ratelimit;
};

const getClientIp = (request: Request, fallback: string) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? fallback ?? "unknown";
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Reject cross-site POSTs: a browser sets Origin on cross-origin requests, so
  // a mismatch against our own host means the request came from another site.
  // Comparing to the request host (not a hard-coded domain) keeps preview
  // deployments working. Requests with no Origin (e.g. curl) are left to the
  // rate limiter and honeypot.
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    const requestHost = request.headers.get("host");
    if (!originHost || originHost !== requestHost) {
      return json(403, { ok: false, error: "forbidden" });
    }
  }

  let payload: Record<string, unknown>;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      payload = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json(400, { ok: false, error: "invalid_body" });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json(400, { ok: false, error: "invalid_body" });
  }

  // Honeypot: real users leave this hidden field empty.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return json(200, { ok: true });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return json(400, { ok: false, error: "missing_fields" });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 320) {
    return json(400, { ok: false, error: "invalid_email" });
  }
  if (name.length > 120 || message.length > 5000) {
    return json(400, { ok: false, error: "too_long" });
  }

  const token = payload["cf-turnstile-response"];
  if (typeof token !== "string" || !token || token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return json(403, { ok: false, error: "verification_failed" });
  }
  const secret = env("TURNSTILE_SECRET");
  if (!secret) {
    console.error("Contact form: TURNSTILE_SECRET is not configured.");
    return json(503, { ok: false, error: "server_misconfigured" });
  }

  const ip = getClientIp(request, clientAddress);
  try {
    const limiter = getRatelimit();
    if (limiter) {
      const { success } = await limiter.limit(ip);
      if (!success) return json(429, { ok: false, error: "rate_limited" });
    } else if (env("NODE_ENV") === "production" || env("VERCEL_ENV")) {
      console.error("Contact form: rate-limit backend is not configured.");
      return json(503, { ok: false, error: "server_misconfigured" });
    }
  } catch {
    console.error("Contact form: rate-limit backend unavailable.");
    return json(503, { ok: false, error: "server_unavailable" });
  }

  const verification = await verifyTurnstile({ token, secret, hostname: new URL(request.url).hostname, remoteip: ip });
  if (!verification.ok) {
    return json(verification.error === "verification_failed" ? 403 : 503, { ok: false, error: verification.error });
  }

  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured.");
    return json(500, { ok: false, error: "server_misconfigured" });
  }

  const resend = new Resend(apiKey);
  const toAddress = env("CONTACT_TO_EMAIL") ?? "contact@johannesgrof.me";
  // Falls back to Resend's shared onboarding sender until the domain is verified.
  const fromAddress = env("CONTACT_FROM_EMAIL") ?? "Contact Form <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<h2>New contact form message</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    if (error) {
      console.error("Contact form: Resend error", error);
      return json(502, { ok: false, error: "send_failed" });
    }
  } catch (err) {
    console.error("Contact form: unexpected error", err);
    return json(502, { ok: false, error: "send_failed" });
  }

  return json(200, { ok: true });
};
