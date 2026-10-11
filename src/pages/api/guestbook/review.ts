import type { APIRoute } from "astro";
import { checkReview, decidePending, getPending } from "@/lib/live";

// Where the link in the guestbook mail leads. Opening it only shows the entry;
// approving or rejecting takes a button press, so mail scanners that follow
// links cannot decide anything.
export const prerender = false;

const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escape(title)}</title>
<style>body{margin:0;background:#12110f;color:#f1eee5;font:16px/1.6 ui-monospace,Menlo,monospace}main{max-width:560px;margin:12vh auto;padding:0 20px}h1{font-size:1.1rem;color:#ff6a4d}blockquote{margin:24px 0;padding:16px 18px;border-left:3px solid #ffb21a;background:#1c1a16;font-size:1.05rem}form{display:flex;gap:12px}button{font:inherit;padding:10px 18px;border:1px solid #5c574d;background:#f1eee5;color:#12110f}button[value=reject]{background:none;color:#f1eee5}p{color:#8f8a7e}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  if (!(await checkReview(id, sig))) return page("Ungültiger Link", "<h1>Ungültiger Link</h1>", 403);
  const entry = await getPending(id);
  if (!entry) return page("Schon erledigt", "<h1>Schon erledigt</h1><p>Der Eintrag wurde schon entschieden oder ist abgelaufen.</p>", 410);
  return page(
    "Gästebuch-Eintrag",
    `<h1>Neuer Gästebuch-Eintrag</h1><blockquote>${escape(entry.text)}</blockquote><p>Eingegangen ${escape(new Date(entry.at).toLocaleString("de-AT", { timeZone: "Europe/Vienna" }))}</p>
<form method="post"><input type="hidden" name="id" value="${escape(id)}"><input type="hidden" name="sig" value="${escape(sig)}"><button name="decision" value="approve">Freigeben</button><button name="decision" value="reject">Ablehnen</button></form>`,
  );
};

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const sig = String(form.get("sig") ?? "");
  const decision = String(form.get("decision") ?? "");
  if (!(await checkReview(id, sig)) || !["approve", "reject"].includes(decision)) return page("Ungültig", "<h1>Ungültig</h1>", 403);
  const entry = await decidePending(id, decision === "approve");
  if (!entry) return page("Schon erledigt", "<h1>Schon erledigt</h1><p>Der Eintrag wurde schon entschieden oder ist abgelaufen.</p>", 410);
  return page(
    decision === "approve" ? "Freigegeben" : "Abgelehnt",
    decision === "approve"
      ? `<h1>Freigegeben</h1><blockquote>${escape(entry.text)}</blockquote><p>Läuft innerhalb einer Minute über die Tafel.</p>`
      : `<h1>Abgelehnt</h1><p>Der Eintrag ist gelöscht.</p>`,
  );
};
