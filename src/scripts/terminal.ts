// The hidden terminal. Opened with ~ (or a tap on the pixel terminal in the
// headline), closed with Escape. Everything it prints is set as text, never as
// HTML, so project data can't inject markup.

import { peopleHere } from "./presence";
import { callTrain } from "./remoteTrain";
import { expressTrain } from "./train";

interface TerminalProject {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  stack: string;
}

interface TerminalData {
  lang: "en" | "de";
  prefix: string;
  projects: TerminalProject[];
}

const data: TerminalData = JSON.parse(document.getElementById("terminal-data")?.textContent ?? "{}");
const de = data.lang === "de";
const t = (deText: string, enText: string) => (de ? deText : enText);

const links: Record<string, string> = {
  home: `${data.prefix}/`,
  projects: `${data.prefix}/projects/`,
  oeffigo: `${data.prefix}/oeffigo/`,
  kontobuch: "https://kontobuch.johannesgrof.me/",
  github: "https://github.com/jx-grxf",
  linkedin: "https://www.linkedin.com/in/johannes-grof",
  x: "https://x.com/johannesgrofdev",
  source: "https://github.com/jx-grxf/johannesgrof.me",
};

const commands = ["help", "ls", "open", "stack", "about", "contact", "ping", "status", "traceroute", "who", "uses", "zug", "call", "guestbook", "gaestebuch", "curl", "cv", "train", "theme", "clear", "exit"];

let root: HTMLElement | undefined;
let output: HTMLElement;
let input: HTMLInputElement;
let lastFocus: HTMLElement | null = null;
const history: string[] = [];
let historyIndex = 0;

function line(text = "", kind?: "dim" | "accent" | "error" | "cmd") {
  const row = document.createElement("p");
  row.className = kind ? `term-row term-row--${kind}` : "term-row";
  row.textContent = text;
  output.append(row);
  output.scrollTop = output.scrollHeight;
  return row;
}

function linkLine(label: string, href: string) {
  const row = line();
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (href.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  row.append(link);
}

function findTarget(query: string): string | undefined {
  const q = query.toLowerCase().replace(/^\/+|\/+$/g, "");
  if (!q) return undefined;
  if (links[q]) return links[q];
  const project = data.projects.find((p) => p.slug === q || p.name.toLowerCase() === q) ??
    data.projects.find((p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q));
  return project ? `${data.prefix}/projects/${project.slug}/` : undefined;
}

function runTrain() {
  if (!document.querySelector(".hero-train")) {
    line(t("Der Zug fährt nur auf der Startseite. Probier: open home", "The train only runs on the home page. Try: open home"), "dim");
    return;
  }
  line(t("Achtung, Zug fährt ein.", "Stand back, train arriving."), "accent");
  close();
  expressTrain();
}

interface PingResult {
  ms: number;
  status: number;
  /** Vercel edge PoP that answered, e.g. "fra1". */
  edge: string | null;
  /** Region the function ran in, e.g. "fra1" or "iad1". */
  region: string | null;
  bytes: number;
  /** Server clock minus local clock, corrected for half the round trip. */
  skew: number | null;
}

async function measurePing(): Promise<PingResult> {
  const started = performance.now();
  const sentAt = Date.now();
  const response = await fetch(`/api/ping?nonce=${crypto.randomUUID()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });
  const body = await response.arrayBuffer();
  const ms = performance.now() - started;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  let payload: { at?: number; region?: string } = {};
  try {
    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {}
  // x-vercel-id reads "edge::function::id" for function calls, "edge::id" for cached files.
  const hops = (response.headers.get("x-vercel-id") ?? "").split("::");
  return {
    ms,
    status: response.status,
    edge: hops.length > 1 ? hops[0]! : null,
    region: payload.region ?? (hops.length > 2 ? hops[1]! : null),
    bytes: body.byteLength,
    skew: typeof payload.at === "number" ? payload.at - (sentAt + ms / 2) : null,
  };
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function formatMs(ms: number) {
  return `${ms.toFixed(1)} ms`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function kv(key: string, value: string, kind?: "dim" | "accent") {
  line(`  ${key.padEnd(13)} ${value}`, kind);
}

async function runPing(raw = "") {
  const parts = raw.split(/\s+/).filter(Boolean);
  let count = 4;
  const countFlag = parts.indexOf("-c");
  if (countFlag !== -1) {
    count = Math.min(Math.max(Number.parseInt(parts[countFlag + 1] ?? "", 10) || 4, 1), 10);
    parts.splice(countFlag, 2);
  }
  const target = (parts[0] ?? "").replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase();
  if (target && target !== "johannesgrof.me" && target !== "www.johannesgrof.me") {
    line(t(`ping: ${target}: aus dem Browser geht nur johannesgrof.me.`, `ping: ${target}: from a browser only johannesgrof.me works.`), "error");
    return;
  }

  line("Pong!", "accent");
  line(`PING johannesgrof.me (/api/ping): ${count} ${t("Pakete", "packets")}`, "dim");
  const results: PingResult[] = [];
  for (let seq = 1; seq <= count; seq++) {
    try {
      const result = await measurePing();
      results.push(result);
      const via = result.edge ? `${result.edge}${result.region && result.region !== result.edge ? ` → ${result.region}` : ""}` : location.hostname;
      line(`${result.bytes} bytes from ${via}: seq=${seq} time=${formatMs(result.ms)}`);
    } catch {
      line(`Request timeout for seq ${seq}`, "error");
    }
    if (seq < count) await sleep(250);
  }

  line();
  line("--- johannesgrof.me ping statistics ---", "accent");
  const loss = ((count - results.length) / count) * 100;
  line(`${count} packets transmitted, ${results.length} received, ${loss.toFixed(0)}% packet loss`);
  if (!results.length) return;
  const times = results.map((result) => result.ms);
  const avg = times.reduce((sum, value) => sum + value, 0) / times.length;
  const mdev = Math.sqrt(times.reduce((sum, value) => sum + (value - avg) ** 2, 0) / times.length);
  const jitter = times.length > 1
    ? times.slice(1).reduce((sum, value, index) => sum + Math.abs(value - times[index]!), 0) / (times.length - 1)
    : 0;
  line(`rtt min/avg/max/mdev = ${Math.min(...times).toFixed(1)}/${avg.toFixed(1)}/${Math.max(...times).toFixed(1)}/${mdev.toFixed(1)} ms`);
  line(`jitter ${formatMs(jitter)}`, "dim");
}

async function runStatus() {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const connection = (navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean };
  }).connection;

  line(t("johannesgrof.me, Verbindung", "johannesgrof.me, connection"), "accent");
  kv("online", navigator.onLine ? t("ja", "yes") : t("nein", "no"));

  const probe = line(t("  messe …", "  measuring …"), "dim");
  let ping: PingResult | null = null;
  try {
    ping = await measurePing();
  } catch {}
  probe.remove();

  if (ping) {
    kv("rtt", formatMs(ping.ms));
    kv("edge", ping.edge ?? t("unbekannt", "unknown"));
    kv(t("funktion", "function"), ping.region ?? t("unbekannt", "unknown"));
    if (ping.skew !== null) kv(t("uhr-drift", "clock skew"), `${ping.skew >= 0 ? "+" : ""}${ping.skew.toFixed(0)} ms ${t("gegen den Server", "vs. server")}`);
  } else {
    kv("rtt", t("keine Antwort", "no reply"));
  }

  if (nav) {
    kv(t("protokoll", "protocol"), nav.nextHopProtocol || t("unbekannt", "unknown"));
    const dns = nav.domainLookupEnd - nav.domainLookupStart;
    const tcp = nav.connectEnd - nav.connectStart;
    const tls = nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0;
    const ttfb = nav.responseStart - nav.requestStart;
    const download = nav.responseEnd - nav.responseStart;
    if (dns + tcp === 0) kv("dns/tcp/tls", t("Verbindung wiederverwendet", "connection reused"));
    else kv("dns/tcp/tls", `${dns.toFixed(0)} / ${tcp.toFixed(0)} / ${tls.toFixed(0)} ms`);
    kv("ttfb", formatMs(ttfb));
    kv("download", formatMs(download));
    kv("dom ready", formatMs(nav.domContentLoadedEventEnd));
    if (nav.transferSize === 0 && nav.decodedBodySize > 0) {
      kv("html", t(`${formatBytes(nav.decodedBodySize)}, aus dem Browser-Cache`, `${formatBytes(nav.decodedBodySize)}, from browser cache`));
    } else if (nav.encodedBodySize > 0) {
      const ratio = nav.decodedBodySize / nav.encodedBodySize;
      kv("html", `${formatBytes(nav.encodedBodySize)} ${t("über die Leitung", "on the wire")}, ${formatBytes(nav.decodedBodySize)} ${t("entpackt", "unpacked")} (${ratio.toFixed(1)}×)`);
    }
  }

  const transferred = resources.reduce((sum, entry) => sum + entry.transferSize, 0);
  const cached = resources.filter((entry) => entry.transferSize === 0 && entry.decodedBodySize > 0).length;
  kv(t("dateien", "requests"), `${resources.length} ${t("geladen", "loaded")}, ${cached} ${t("aus dem Cache", "from cache")}, ${formatBytes(transferred)}`);

  if (connection) {
    const parts = [
      connection.effectiveType,
      typeof connection.downlink === "number" ? `~${connection.downlink} Mbit/s` : "",
      connection.rtt ? `rtt ~${connection.rtt} ms` : "",
      connection.saveData ? "save-data" : "",
    ].filter(Boolean);
    if (parts.length) kv(t("netz", "network"), `${parts.join(", ")} ${t("(Schätzung des Browsers)", "(browser estimate)")}`);
  }
  kv(t("auf der seite", "on this page"), `${Math.round(performance.now() / 1000)} s`, "dim");
}

const hiBase = `johannesgrof.me${de ? "/de" : ""}/hi`;

async function runWho() {
  const count = await peopleHere();
  if (count === null) {
    line(t("who: weiß ich gerade nicht.", "who: can't tell right now."), "error");
    return;
  }
  line(
    count <= 1
      ? t("Nur du. Gerade ist sonst niemand auf der Seite.", "Just you. Nobody else is on the site right now.")
      : t(`${count} Leute sind gerade auf der Seite, du eingeschlossen.`, `${count} people are on the site right now, you included.`),
    "accent",
  );
  line(t("Gezählt werden offene Tabs, ohne Namen, IPs oder Cookies.", "Counting open tabs, with no names, IPs or cookies."), "dim");
}

async function runCallTrain() {
  line(t("Hole einen Code …", "Getting a code …"), "dim");
  await callTrain({
    onToken: (token) => {
      line(t("Tipp das in dein echtes Terminal:", "Type this into your real terminal:"));
      line(`curl -X POST https://${hiBase}/zug/${token}`, "accent");
      line(t("Ich warte hier. Der Code gilt zehn Minuten.", "I'll wait here. The code works for ten minutes."), "dim");
    },
    onRing: () => line(t("Zug kommt!", "Train incoming!"), "accent"),
    onExpire: () => line(t("Der Code ist abgelaufen. zug holt einen neuen.", "The code expired. call gets a new one."), "dim"),
    onError: () => line(t("Gerade gibt es keinen Code. Später nochmal.", "No code right now. Try again later."), "error"),
  });
}

async function runGuestbook() {
  try {
    const response = await fetch("/api/hi/guestbook", { headers: { Accept: "application/json" } });
    const { entries } = (await response.json()) as { entries: { text: string; at: string }[] };
    if (entries.length) {
      const date = new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", { day: "numeric", month: "short", timeZone: "Europe/Vienna" });
      line(t("Gästebuch:", "Guestbook:"), "accent");
      for (const entry of entries) line(`  ${date.format(new Date(entry.at)).padEnd(8)} »${entry.text}«`);
    } else {
      line(t("Noch leer. Du könntest der Erste sein.", "Still empty. You could be the first."), "dim");
    }
  } catch {
    line(t("Das Gästebuch lädt gerade nicht.", "The guestbook won't load right now."), "error");
  }
  line(t("Unterschreiben geht im echten Terminal:", "Sign it from a real terminal:"), "dim");
  line(`curl -d "servus" https://${hiBase}/sign`, "accent");
}

async function runTrace() {
  line(t("traceroute to johannesgrof.me, 3 hops max", "traceroute to johannesgrof.me, 3 hops max"), "accent");
  line(t(" 1  dein Browser  0.0 ms", " 1  your browser  0.0 ms"));
  try {
    const result = await measurePing();
    line(` 2  ${result.edge ? `vercel edge ${result.edge}` : location.hostname}  ${formatMs(result.ms)}`);
    if (result.region) line(` 3  function ${result.region}  ${formatMs(result.ms)}`);
    line(t("Echte Router-Hops (TTL, ICMP) gibt der Browser nicht her.", "Real router hops (TTL, ICMP) are not exposed to browsers."), "dim");
  } catch {
    line(t("traceroute: Server nicht erreichbar.", "traceroute: server unreachable."), "error");
  }
}

const fortunes = de
  ? [
      "Bei mir am Mac geht's.",
      "Der Zug hat Verspätung. Der Build hoffentlich nicht.",
      "Wer git push --force sagt, muss auch git reflog sagen.",
      "Zuerst Kernöl, dann Commit.",
      "Es gibt zwei schwierige Dinge: Cache-Invalidierung, Namen vergeben und Off-by-one-Fehler.",
      "Ein Feature ist ein Bug, den jemand dokumentiert hat.",
    ]
  : [
      "Works on my Mac.",
      "The train is late. Hopefully the build isn't.",
      "Whoever says git push --force must also say git reflog.",
      "Pumpkin seed oil first, then commit.",
      "There are two hard things: cache invalidation, naming things and off-by-one errors.",
      "A feature is a bug somebody documented.",
    ];

function neofetch() {
  const theme = document.documentElement.dataset.theme === "light" ? t("helles Papier", "light paper") : t("dunkles Papier", "dark paper");
  const time = new Intl.DateTimeFormat("de-AT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" }).format(new Date());
  const ua = navigator.userAgent;
  const browser = /Firefox\//.test(ua) ? "Firefox" : /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "?";
  const logo = ["+---------+", "| >       |", "|  >      |", "| >  __   |", "|         |", "+---------+", "", "", "", "", ""];
  const info: [string, string][] = [
    ["", "johannes@johannesgrof.me"],
    ["", "------------------------"],
    ["Site", "johannesgrof.me (Astro)"],
    ["Host", "Vercel"],
    [t("Ort", "Location"), t("Südost-Steiermark", "south-east Styria")],
    [t("Schule", "School"), "HTL Kaindorf"],
    ["Stack", "Swift, TypeScript, Rust"],
    [t("Projekte", "Projects"), String(data.projects.length + 2)],
    ["Theme", theme],
    ["Browser", `${browser}, ${window.innerWidth}×${window.innerHeight}`],
    [t("Uhrzeit", "Time"), `${time} Europe/Vienna`],
  ];
  info.forEach(([key, value], i) => {
    const row = line(`${(logo[i] ?? "").padEnd(13)}`, i < 6 ? "error" : undefined);
    const text = document.createElement("span");
    text.className = i === 0 ? "term-accent" : "";
    text.textContent = key ? `${key}: ${value}` : value;
    row.append(text);
  });
}

function run(raw: string) {
  const value = raw.trim();
  line(`~ $ ${value}`, "cmd");
  if (!value) return;
  history.push(value);
  historyIndex = history.length;
  const [cmd, ...args] = value.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd.toLowerCase()) {
    case "help":
      line(t("Befehle:", "Commands:"), "accent");
      line(`  ls               ${t("alle Projekte", "every project")}`);
      line(`  open <name>      ${t("Projekt oder Seite öffnen (Tab ergänzt)", "open a project or page (Tab completes)")}`);
      line(`  stack            ${t("womit ich arbeite", "what I work with")}`);
      line(`  about            ${t("wer das hier gebaut hat", "who built this")}`);
      line(`  contact          ${t("wie du mich erreichst", "how to reach me")}`);
      line(`  ping [-c n]      ${t("Latenz, Verlust und Jitter zum Server", "latency, loss and jitter to the server")}`);
      line(`  status           ${t("Verbindung im Detail: Edge, Protokoll, Timings", "connection details: edge, protocol, timings")}`);
      line(`  traceroute       ${t("Weg bis zum Server", "path to the server")}`);
      line(`  curl             ${t("die Seite im echten Terminal", "this site in a real terminal")}`);
      line(`  cv               ${t("einseitiger Lebenslauf zum Drucken", "one-page CV to print")}`);
      line(`  who              ${t("wer gerade auf der Seite ist", "who is on the site right now")}`);
      line(`  uses             ${t("womit ich arbeite, das ganze Setup", "my whole setup")}`);
      line(`  ${t("zug             ", "call            ")} ${t("Zug per curl aus deinem Terminal rufen", "call the train with curl from your terminal")}`);
      line(`  ${t("gästebuch       ", "guestbook       ")} ${t("Einträge lesen und per curl unterschreiben", "read entries and sign with curl")}`);
      line(`  train            ${t("ruft den Zug", "calls the train")}`);
      line(`  theme light|dark ${t("Papier wechseln", "switch the paper")}`);
      line("  clear, exit");
      line(t("Es gibt noch ein paar mehr. Viel Spaß beim Suchen.", "There are a few more. Have fun looking."), "dim");
      break;
    case "ls":
    {
      if (/^-[a-z]*a/.test(arg)) {
        line("drwxr-xr-x  ./", "dim");
        line(`-rw-------  .secrets      ${t("Netter Versuch.", "Nice try.")}`, "dim");
        line(`-rw-r--r--  .kernoel      ${t("tipp irgendwo auf der Seite: kernoel", "type anywhere on the page: kernoel")}`, "dim");
        line(`-rw-r--r--  .trainrc      ${t("tipp irgendwo auf der Seite: train", "type anywhere on the page: train")}`, "dim");
      }
      const width = Math.max(...data.projects.map((p) => p.slug.length)) + 3;
      const name = (slug: string) => `${slug}/`.padEnd(width);
      line(`${name("oeffigo")}${t("Öffi-App für Österreich", "transit app for Austria")}`);
      line(`${name("kontobuch")}${t("Rechnungswesen, wie im Heft", "accounting, like a notebook")}`);
      data.projects.forEach((p) => line(`${name(p.slug)}${p.tagline}  [${p.status}]`));
      line(t(`${data.projects.length + 2} Projekte. open <name> zum Öffnen.`, `${data.projects.length + 2} projects. open <name> to open one.`), "dim");
      break;
    }
    case "open":
    case "cd": {
      const target = findTarget(arg);
      if (!target) {
        line(arg ? t(`Nichts gefunden für "${arg}". Tipp: ls`, `Nothing found for "${arg}". Try: ls`) : "open <name>", "error");
        break;
      }
      line(`→ ${target}`, "dim");
      if (target.startsWith("http")) window.open(target, "_blank", "noreferrer");
      else window.location.href = target;
      break;
    }
    case "stack":
      line("Swift, SwiftUI, AppKit      " + t("iPhone und Mac", "iPhone and Mac"));
      line("TypeScript, Astro, Vite     Web");
      line("Rust, Python, Node          " + t("CLI und Tools", "CLI and tools"));
      line("Codesign, Notarisierung, Sparkle, GitHub Actions".replace("Codesign, Notarisierung", t("Codesign, Notarisierung", "Codesign, notarisation")));
      break;
    case "about":
    case "whoami":
      line("Johannes Grof", "accent");
      line(t("HTL Kaindorf, Südost-Steiermark. Baut Apps für iPhone und Mac und die Tools, die er dabei braucht.", "HTL Kaindorf, south-east Styria. Builds apps for iPhone and Mac and the tools he needs along the way."));
      break;
    case "contact":
    case "mail":
      linkLine("contact@johannesgrof.me", "mailto:contact@johannesgrof.me");
      linkLine("github.com/jx-grxf", links.github);
      linkLine("linkedin.com/in/johannes-grof", links.linkedin);
      linkLine("x.com/johannesgrofdev", links.x);
      break;
    case "train":
    case "sl":
      runTrain();
      break;
    case "theme": {
      const next = arg === "light" || arg === "dark" ? arg : document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.dispatchEvent(new MouseEvent("click"));
      if ((document.documentElement.dataset.theme ?? "dark") !== next) {
        document.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.dispatchEvent(new MouseEvent("click"));
      }
      line(t(`Papier: ${next === "light" ? "hell" : "dunkel"}`, `Paper: ${next}`), "dim");
      break;
    }
    case "clear":
      output.replaceChildren();
      break;
    case "exit":
    case "quit":
    case ":q":
    case ":wq":
      close();
      break;
    case "sudo":
      line(t("Netter Versuch. Hier hast du keine Rechte, nur Lesezugriff.", "Nice try. You only get read access here."), "error");
      break;
    case "rm":
      line(t("Nein.", "No."), "error");
      break;
    case "vim":
    case "nano":
    case "emacs":
      line(t("Du kommst hier mit :q wieder raus. Versprochen.", "You can leave with :q. Promise."), "dim");
      break;
    case "neofetch":
    case "fastfetch":
      neofetch();
      break;
    case "fortune":
      line(fortunes[Math.floor(Math.random() * fortunes.length)], "accent");
      break;
    case "coffee":
    case "kaffee":
      line("418 I'm a teapot", "accent");
      break;
    case "uses":
      line(t("MacBook Pro M5 Pro · Ghostty · Claude Code · Codex · Xcode · VS Code", "MacBook Pro M5 Pro · Ghostty · Claude Code · Codex · Xcode · VS Code"), "accent");
      line(t("Die ganze Liste:", "The whole list:"), "dim");
      linkLine(`${data.prefix}/uses/`, `${data.prefix}/uses/`);
      break;
    case "cv":
    case "lebenslauf":
    case "lpr":
      line(t("Schicke den Lebenslauf an den Drucker …", "Sending the CV to the printer …"), "dim");
      window.setTimeout(() => window.print(), 300);
      break;
    case "who":
    case "w":
      void runWho();
      break;
    case "zug":
    case "call":
      void runCallTrain();
      break;
    case "guestbook":
    case "gaestebuch":
    case "gästebuch":
    case "gb":
      void runGuestbook();
      break;
    case "curl":
    case "wget":
      line(t("Im echten Terminal ausprobieren:", "Try it in a real terminal:"), "dim");
      line(`curl -sL johannesgrof.me${de ? "/de" : ""}/hi`, "accent");
      break;
    case "git":
      line(t("Der Quelltext liegt hier:", "The source lives here:"), "dim");
      linkLine("github.com/jx-grxf/johannesgrof.me", links.source);
      break;
    case "date":
      line(new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Vienna" }).format(new Date()));
      break;
    case "echo":
      line(arg);
      break;
    case "ping":
      void runPing(arg);
      break;
    case "status":
    case "stats":
      void runStatus();
      break;
    case "traceroute":
    case "trace":
      void runTrace();
      break;
    default:
      line(t(`Befehl nicht gefunden: ${cmd}. Tipp: help`, `command not found: ${cmd}. Try: help`), "error");
  }
}

function complete() {
  const value = input.value;
  const [cmd, ...rest] = value.split(" ");
  if (rest.length === 0) {
    const match = commands.find((c) => c.startsWith(cmd.toLowerCase()));
    if (match) input.value = `${match} `;
    return;
  }
  if (cmd === "open" || cmd === "cd") {
    const q = rest.join(" ").toLowerCase();
    const names = [...Object.keys(links), ...data.projects.map((p) => p.slug)];
    const match = names.find((n) => n.startsWith(q));
    if (match) input.value = `${cmd} ${match}`;
  }
}

function build() {
  root = document.createElement("div");
  root.className = "term";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Terminal");

  const bar = document.createElement("div");
  bar.className = "term-bar";
  const lights = document.createElement("span");
  lights.className = "term-lights";
  for (let i = 0; i < 3; i++) {
    const light = document.createElement("span");
    light.className = "tl";
    lights.append(light);
  }
  const title = document.createElement("span");
  title.textContent = "johannes@johannesgrof.me: ~";
  const left = document.createElement("span");
  left.className = "term-title";
  left.append(lights, title);
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "term-close";
  closeButton.textContent = t("esc schließt", "esc to close");
  closeButton.addEventListener("click", close);
  bar.append(left, closeButton);

  output = document.createElement("div");
  output.className = "term-out";
  output.setAttribute("aria-live", "polite");

  const form = document.createElement("form");
  form.className = "term-line";
  const prompt = document.createElement("label");
  prompt.className = "term-prompt";
  prompt.htmlFor = "term-input";
  prompt.textContent = "~ $";
  input = document.createElement("input");
  input.id = "term-input";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("enterkeyhint", "send");
  form.append(prompt, input);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void run(input.value);
    input.value = "";
    output.scrollTop = output.scrollHeight;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      complete();
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    } else if (event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] ?? "";
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  root.addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest("a, button")) input.focus();
  });

  root.append(bar, output, form);
  document.body.append(root);

  line(t("Servus. Das hier ist ein kleines Terminal für die Seite.", "Hi. This is a small terminal for the site."), "accent");
  line(t("Tipp help für alle Befehle.", "Type help for the commands."), "dim");
  line(t("Im echten Terminal: curl -sL johannesgrof.me/de/hi", "In a real terminal: curl -sL johannesgrof.me/hi"), "dim");
}

export function openTerminal() {
  if (!root) build();
  if (!root || root.classList.contains("is-open")) {
    input?.focus();
    return;
  }
  lastFocus = document.activeElement as HTMLElement | null;
  root.classList.add("is-open");
  input.focus();
}

function close() {
  if (!root) return;
  root.classList.remove("is-open");
  lastFocus?.focus?.();
}
