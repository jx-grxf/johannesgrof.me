import type { APIRoute } from "astro";
import { Resend } from "resend";

// Runs as an on-demand Vercel function rather than being prerendered.
export const prerender = false;

const TO_ADDRESS = import.meta.env.CONTACT_TO_EMAIL ?? "contact@johannesgrof.me";
// Must be an address on a domain verified in Resend. Falls back to Resend's
// shared onboarding sender so the form still works before the domain is verified.
const FROM_ADDRESS = import.meta.env.CONTACT_FROM_EMAIL ?? "Contact Form <onboarding@resend.dev>";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured.");
    return json(500, { ok: false, error: "server_misconfigured" });
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
