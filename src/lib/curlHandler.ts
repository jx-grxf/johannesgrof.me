// The answer to `curl -sL johannesgrof.me/hi`, shared by the /api/card route (local
// dev) and the standalone _curl function the build adds for production (see
// tools/curl-route.mjs). The language comes from the path: /hi or /de/hi.
import { HIDE_CURSOR, SHOW_CURSOR, card, trainFrames, type CardData } from "@/lib/curlCard";
import { kontobuch } from "@/data/kontobuch";
import { oeffigo } from "@/data/oeffigo";
import { getProjectCopy, homepageProjects, localizedStatusLabel } from "@/data/projects";
import { siteContentByLocale } from "@/data/siteContent";
import { author, canonicalOrigin, personSameAs } from "@/data/siteMetadata";

const FRAME_MS = 28;

async function loadBoard(origin: string): Promise<CardData["board"]> {
  try {
    // Through the public endpoint, so the CDN cache in front of it is shared with the home page board.
    const response = await fetch(`${origin}/api/departures?stop=praterstern`, { signal: AbortSignal.timeout(1_500) });
    if (!response.ok) return null;
    const body = await response.json();
    return { stop: body.name, updatedAt: body.updatedAt, departures: body.departures ?? [] };
  } catch {
    return null;
  }
}

export async function handleCard(request: Request): Promise<Response> {
  const started = Date.now();
  const url = new URL(request.url);
  const lang = /^\/de(\/|$)/.test(url.pathname) || url.searchParams.get("lang") === "de" ? "de" : "en";
  const content = siteContentByLocale[lang];
  const animate = /^curl\//i.test(request.headers.get("user-agent") ?? "") && !url.searchParams.has("static");

  // A fixed origin on Vercel: the request's own host comes from a header and must not pick the fetch target.
  const board = await loadBoard(process.env.VERCEL ? canonicalOrigin : url.origin);
  const data: CardData = {
    lang,
    eyebrow: content.hero.eyebrow,
    title: content.hero.title,
    body: content.hero.body,
    oeffigo: { tagline: oeffigo.tagline[lang], status: oeffigo.status[lang], url: oeffigo.websiteUrl },
    kontobuch: { description: kontobuch.description[lang], url: kontobuch.websiteUrl },
    projects: homepageProjects.map((project) => ({
      name: project.name,
      tagline: getProjectCopy(project, lang).tagline,
      status: localizedStatusLabel(project.status, lang),
    })),
    board,
    links: [
      { label: "web", url: lang === "de" ? "https://johannesgrof.me/de/" : "https://johannesgrof.me/" },
      { label: "github", url: personSameAs[0] },
      { label: "linkedin", url: personSameAs[1] },
      { label: "x", url: personSameAs[2] },
      { label: lang === "de" ? "mail" : "email", url: `mailto:${author.email}` },
    ],
    served: {
      edge: request.headers.get("x-vercel-id")?.split(":")[0] ?? null,
      region: process.env.VERCEL_REGION ?? null,
      ms: 0,
    },
    viennaTime: new Intl.DateTimeFormat("de-AT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" }).format(new Date()),
  };

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };

  data.served.ms = Date.now() - started;
  if (!animate) {
    return new Response(card(data), { headers });
  }

  const encoder = new TextEncoder();
  const frames = trainFrames();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      send(`${HIDE_CURSOR}\n`);
      const height = frames[0]!.length;
      for (const [index, frame] of frames.entries()) {
        // Redraw in place: jump back up over the previous frame first.
        send(`${index ? `\x1b[${height}A` : ""}${frame.map((line) => `\r\x1b[2K${line}`).join("\n")}\n`);
        await new Promise((resolve) => setTimeout(resolve, FRAME_MS));
      }
      send(`\x1b[${height}A\x1b[J`);
      send(card(data));
      send(SHOW_CURSOR);
      controller.close();
    },
  });
  return new Response(stream, { headers });
}
