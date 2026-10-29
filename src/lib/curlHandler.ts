// Everything under curl johannesgrof.me/hi, shared by the /api/card route
// (local dev) and the standalone _curl function the build adds for production
// (see tools/curl-route.mjs). The language comes from the path: /hi or /de/hi.
import { Resend } from "resend";
import { HIDE_CURSOR, SHOW_CURSOR, card, helpCard, hereText, messageCard, pumpkinFrame, stationCard, trainFrames, type BoardData, type CardData } from "@/lib/curlCard";
import { isHalloween } from "@/lib/season";
import { parseMonitor } from "@/lib/departures";
import { addPending, allow, cleanGuestbookText, clientIp, countHere, GUESTBOOK_MAX, listGuestbook, readEnv, ringZug, signReview } from "@/lib/live";
import { findStop, type Stop } from "@/lib/stopSearch";
import { kontobuch } from "@/data/kontobuch";
import { oeffigo } from "@/data/oeffigo";
import { getProjectCopy, homepageProjects, localizedStatusLabel } from "@/data/projects";
import { siteContentByLocale } from "@/data/siteContent";
import { author, canonicalOrigin, personSameAs } from "@/data/siteMetadata";
import viennaStops from "@/data/viennaStops.json";

type Lang = "en" | "de";

const FRAME_MS = 28;
const headers = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const text = (body: string, status = 200) => new Response(body, { status, headers });

// A fixed origin on Vercel: the request's own host comes from a header and must not pick a fetch target.
const origin = (url: URL) => (process.env.VERCEL ? canonicalOrigin : url.origin);

async function loadPraterstern(url: URL): Promise<CardData["board"]> {
  try {
    // Through the public endpoint, so the CDN cache in front of it is shared with the home page board.
    const response = await fetch(`${origin(url)}/api/departures?stop=praterstern`, { signal: AbortSignal.timeout(1_500) });
    if (!response.ok) return null;
    const body = await response.json();
    return { stop: body.name, updatedAt: body.updatedAt, departures: body.departures ?? [] };
  } catch {
    return null;
  }
}

/** Streams the pixel train through the terminal, then the given text. */
function withTrain(body: () => string): Response {
  return animated(trainFrames(3, isHalloween()), FRAME_MS, body, true);
}

/** Plays frames in place, then prints the body; `clear` wipes the last frame first. */
function animated(frames: string[][], frameMs: number, body: () => string, clear: boolean): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
      send(`${HIDE_CURSOR}\n`);
      const height = frames[0]!.length;
      for (const [index, frame] of frames.entries()) {
        // Redraw in place: jump back up over the previous frame first.
        send(`${index ? `\x1b[${height}A` : ""}${frame.map((line) => `\r\x1b[2K${line}`).join("\n")}\n`);
        await new Promise((resolve) => setTimeout(resolve, frameMs));
      }
      if (clear) send(`\x1b[${height}A\x1b[J`);
      send(body());
      send(SHOW_CURSOR);
      controller.close();
    },
  });
  return new Response(stream, { headers });
}

async function cardResponse(request: Request, url: URL, lang: Lang): Promise<Response> {
  const started = Date.now();
  const content = siteContentByLocale[lang];
  const [board, here, guestbook] = await Promise.all([
    loadPraterstern(url),
    countHere().catch(() => null),
    listGuestbook(3).catch(() => []),
  ]);
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
    here,
    guestbook,
    halloween: isHalloween(),
  };
  data.served.ms = Date.now() - started;
  const animate = /^curl\//i.test(request.headers.get("user-agent") ?? "") && !url.searchParams.has("static");
  return animate ? withTrain(() => card(data)) : text(card(data));
}

const stationCache = new Map<number, { at: number; board: BoardData }>();

async function stationResponse(request: Request, query: string, lang: Lang): Promise<Response> {
  const de = lang === "de";
  if (!(await allow("hi-oeffi", clientIp(request), 20, "1 m"))) {
    return text(messageCard([{ text: de ? "Langsam, die Tafel braucht kurz Pause. In einer Minute wieder." : "Easy, the board needs a minute. Try again shortly.", tone: "error" }]), 429);
  }
  const { stop, suggestions } = findStop(viennaStops as unknown as Stop[], query);
  if (!stop) return text(stationCard(null, query, suggestions.map((s) => s[1]), lang), 404);
  const [diva, name] = stop;
  let cached = stationCache.get(diva);
  if (!cached || Date.now() - cached.at > 15_000) {
    try {
      const response = await fetch(`https://www.wienerlinien.at/ogd_realtime/monitor?diva=${diva}`, {
        headers: { Accept: "application/json", "User-Agent": "johannesgrof.me departures board" },
        signal: AbortSignal.timeout(3_500),
      });
      if (!response.ok) throw new Error(String(response.status));
      cached = { at: Date.now(), board: { stop: name, updatedAt: new Date().toISOString(), departures: parseMonitor(await response.json(), 12) } };
      stationCache.set(diva, cached);
    } catch {
      if (!cached) return text(messageCard([{ text: de ? "Die Wiener Linien antworten gerade nicht. Gleich nochmal." : "Wiener Linien is not answering right now. Try again shortly.", tone: "error" }]), 503);
    }
  }
  return text(stationCard(cached.board, query, suggestions.map((s) => s[1]), lang));
}

async function readSignBody(request: Request): Promise<string> {
  const raw = (await request.text()).slice(0, 2_000);
  const type = request.headers.get("content-type") ?? "";
  // curl -d "servus" sends the raw text; -d "text=servus" or --data-urlencode send form encoding.
  if (type.includes("application/x-www-form-urlencoded") && /^(text|msg|message|m)=/.test(raw)) {
    const params = new URLSearchParams(raw);
    return params.get("text") ?? params.get("msg") ?? params.get("message") ?? params.get("m") ?? "";
  }
  if (/%[0-9a-f]{2}/i.test(raw)) {
    try {
      return decodeURIComponent(raw.replace(/\+/g, " "));
    } catch {}
  }
  return raw;
}

async function signResponse(request: Request, lang: Lang): Promise<Response> {
  const de = lang === "de";
  if (request.method !== "POST") {
    return text(messageCard([
      { text: de ? "So schreibst du ins Gästebuch:" : "To sign the guestbook:", tone: "muted" },
      { text: `curl -d "servus aus Graz" https://johannesgrof.me${de ? "/de" : ""}/hi/sign` },
      { text: de ? `Höchstens ${GUESTBOOK_MAX} Zeichen. Ich lese jeden Eintrag, bevor er auf der Seite steht.` : `Up to ${GUESTBOOK_MAX} characters. I read every entry before it shows up on the site.`, tone: "muted" },
    ]));
  }
  if (!(await allow("hi-sign", clientIp(request), 3, "1 h"))) {
    return text(messageCard([{ text: de ? "Drei Einträge pro Stunde reichen. Später wieder." : "Three entries an hour is plenty. Try again later.", tone: "error" }]), 429);
  }
  const entryText = cleanGuestbookText(await readSignBody(request));
  if (entryText.length < 2) {
    return text(messageCard([{ text: de ? 'Da steht nichts drin. Beispiel: curl -d "servus" https://johannesgrof.me/de/hi/sign' : 'That was empty. Example: curl -d "hi" https://johannesgrof.me/hi/sign', tone: "error" }]), 400);
  }
  const entry = await addPending(entryText);
  const signature = entry ? await signReview(entry.id) : null;
  const apiKey = readEnv("RESEND_API_KEY");
  if (!entry || !signature || !apiKey) {
    return text(messageCard([{ text: de ? "Das Gästebuch ist gerade zu. Versuch es später nochmal." : "The guestbook is closed right now. Try again later.", tone: "error" }]), 503);
  }
  const reviewUrl = `${canonicalOrigin}/api/guestbook/review?id=${entry.id}&sig=${signature}`;
  try {
    await new Resend(apiKey).emails.send({
      from: readEnv("CONTACT_FROM_EMAIL") ?? "Contact Form <onboarding@resend.dev>",
      to: readEnv("CONTACT_TO_EMAIL") ?? author.email,
      subject: "Gästebuch: neuer Eintrag per curl",
      text: `Neuer Eintrag:\n\n${entry.text}\n\nAnsehen und freigeben oder ablehnen:\n${reviewUrl}\n\nOhne Entscheidung verfällt der Eintrag nach sieben Tagen.`,
    });
  } catch {
    // The entry is stored either way; the review link can be found again from Redis if the mail failed.
  }
  return text(messageCard([
    { text: de ? "Danke, ist angekommen." : "Thanks, got it.", tone: "ok" },
    { text: `»${entry.text}«` },
    { text: de ? "Sobald ich es gelesen habe, steht es auf johannesgrof.me/hi." : "Once I've read it, it shows up on johannesgrof.me/hi.", tone: "muted" },
  ]));
}

// The candle inside flickers for a couple of seconds, then the pumpkin stays lit.
const CANDLE_ORDER = [0, 1, 0, 2, 0, 3, 1, 0, 4, 0, 0, 3, 0, 1, 2, 0, 0, 0, 3, 4, 0, 1, 0, 0];

function booResponse(request: Request, url: URL, lang: Lang): Response {
  const de = lang === "de";
  const base = `johannesgrof.me${de ? "/de" : ""}/hi`;
  const body = () =>
    messageCard([
      { text: "boo.", tone: "ok" },
      ...(isHalloween()
        ? [
            { text: de ? "Der 71er fährt zum Zentralfriedhof. Was dort gerade abfährt:" : "The 71 runs to the Central Cemetery. What leaves there right now:", tone: "plain" as const },
            { text: `curl -sL ${base}/oeffi/zentralfriedhof-2-tor`, tone: "plain" as const },
            { text: de ? "In Wien heißt „mit dem 71er fahren“ sterben." : "In Vienna, “taking the 71” means dying.", tone: "muted" as const },
          ]
        : [{ text: de ? "Halloween ist auf der Seite vom 24. Oktober bis 1. November. Der Kürbis bleibt das ganze Jahr." : "Halloween runs on the site from 24 October to 1 November. The pumpkin stays all year.", tone: "muted" as const }]),
    ]);
  const animate = /^curl\//i.test(request.headers.get("user-agent") ?? "") && !url.searchParams.has("static");
  if (!animate) return text(`\n${pumpkinFrame().join("\n")}\n${body()}`);
  return animated(CANDLE_ORDER.map((candle) => ["", ...pumpkinFrame(candle)]), 110, body, false);
}

async function whoResponse(lang: Lang): Promise<Response> {
  const count = await countHere().catch(() => null);
  const de = lang === "de";
  if (count === null) return text(messageCard([{ text: de ? "Weiß ich gerade nicht." : "Can't tell right now.", tone: "muted" }]), 503);
  return text(messageCard([
    { text: count ? hereText(count, lang) : de ? "Gerade ist niemand auf der Seite. Du könntest der Erste sein." : "Nobody is on the site right now. You could be the first.", tone: "ok" },
    { text: de ? "Gezählt werden offene Tabs der letzten zweieinhalb Minuten, ohne Namen, IPs oder Cookies." : "Counted are open tabs from the last two and a half minutes, with no names, IPs or cookies.", tone: "muted" },
  ]));
}

async function zugResponse(request: Request, token: string, lang: Lang): Promise<Response> {
  const de = lang === "de";
  if (request.method !== "POST") {
    return text(messageCard([
      { text: de ? "Der Zug kommt nur mit POST:" : "The train only comes with POST:", tone: "muted" },
      { text: `curl -X POST https://johannesgrof.me${de ? "/de" : ""}/hi/zug/${token || "<code>"}` },
    ]), 405);
  }
  if (!(await allow("hi-zug", clientIp(request), 10, "1 m"))) {
    return text(messageCard([{ text: de ? "Der Zug muss kurz verschnaufen." : "The train needs a short break.", tone: "error" }]), 429);
  }
  if (!(await ringZug(token))) {
    return text(messageCard([
      { text: de ? "Diesen Code kenne ich nicht, oder er ist abgelaufen (zehn Minuten)." : "I don't know this code, or it expired (ten minutes).", tone: "error" },
      { text: de ? "Einen neuen gibt es auf johannesgrof.me/de/hi/ oder mit zug im Terminal der Seite." : "Get a new one on johannesgrof.me/hi/ or with train call in the site terminal.", tone: "muted" },
    ]), 404);
  }
  return withTrain(() =>
    messageCard([
      { text: de ? "Der Zug ist unterwegs. Schau in deinen Browser." : "The train is on its way. Look at your browser.", tone: "ok" },
      { text: de ? "Nochmal? Einfach den Befehl wiederholen, der Code gilt zehn Minuten." : "Again? Repeat the command, the code works for ten minutes.", tone: "muted" },
    ]),
  );
}

export async function handleHi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lang: Lang = /^\/de(\/|$)/.test(url.pathname) || url.searchParams.get("lang") === "de" ? "de" : "en";
  // /api/card?path=/oeffi/x lets the local dev server reach the sub-commands.
  const rest = (url.pathname.startsWith("/api/card") ? (url.searchParams.get("path") ?? "") : url.pathname.replace(/^\/(de\/)?hi/, "")).replace(/\/+$/, "");
  const [command = "", ...args] = rest.split("/").filter(Boolean);

  switch (command.toLowerCase()) {
    case "":
      return cardResponse(request, url, lang);
    case "oeffi":
    case "station":
    case "abfahrten":
      return stationResponse(request, args.join(" "), lang);
    case "sign":
    case "gaestebuch":
    case "guestbook":
      return signResponse(request, lang);
    case "who":
      return whoResponse(lang);
    case "zug":
    case "train":
      return zugResponse(request, (args[0] ?? "").toLowerCase(), lang);
    case "boo":
    case "halloween":
      return booResponse(request, url, lang);
    case "help":
      return text(helpCard(lang, isHalloween()));
    default:
      return text(helpCard(lang, isHalloween()), 404);
  }
}
