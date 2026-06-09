import type { APIRoute } from "astro";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

// Runs as an on-demand Vercel function rather than being prerendered.
export const prerender = false;

const TO_ADDRESS = import.meta.env.CONTACT_TO_EMAIL ?? "contact@johannesgrof.me";
// Must be an address on a domain verified in Resend. Falls back to Resend's
// shared onboarding sender so the form still works before the domain is verified.
const FROM_ADDRESS = import.meta.env.CONTACT_FROM_EMAIL ?? "Contact Form <onboarding@resend.dev>";

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
  const url = import.meta.env.KV_REST_API_URL ?? import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.KV_REST_API_TOKEN ?? import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    // 5 submissions per IP per 10 minutes.
    limiter: Ratelimit.slidingWindow(5, "10 m"),
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
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured.");
    return json(500, { ok: false, error: "server_misconfigured" });
  }

  const limiter = getRatelimit();
  if (limiter) {
    const ip = getClientIp(request, clientAddress);
    const { success } = await limiter.limit(ip);
    if (!success) {
      return json(429, { ok: false, error: "rate_limited" });
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

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
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
