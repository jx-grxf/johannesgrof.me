// The hidden terminal. Opened with ~ (or a tap on the pixel terminal in the
// headline), closed with Escape. Everything it prints is set as text, never as
// HTML, so project data can't inject markup.

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

const commands = ["help", "ls", "open", "stack", "about", "contact", "train", "theme", "clear", "exit"];

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

const fortunes = de
  ? [
      "„Passt scho.“ (jedes Code-Review in der Steiermark)",
      "Bei mir am Mac geht's.",
      "Der Zug hat Verspätung. Der Build hoffentlich nicht.",
      "Wer git push --force sagt, muss auch git reflog sagen.",
      "Zuerst Kernöl, dann Commit.",
      "Es gibt zwei schwierige Dinge: Cache-Invalidierung, Namen vergeben und Off-by-one-Fehler.",
      "Ein Feature ist ein Bug, den jemand dokumentiert hat.",
    ]
  : [
      "\"Passt scho.\" (every code review in Styria)",
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
    ["", "johannes@kaindorf"],
    ["", "-----------------"],
    ["Site", "johannesgrof.me (Astro)"],
    ["Host", "Vercel"],
    [t("Ort", "Location"), t("Südost-Steiermark", "south-east Styria")],
    [t("Schule", "School"), "HTL Kaindorf"],
    ["Stack", "Swift, TypeScript, Rust"],
    [t("Projekte", "Projects"), String(data.projects.length + 2)],
    ["Theme", theme],
    ["Browser", `${browser}, ${window.innerWidth}×${window.innerHeight}`],
    [t("Uhrzeit", "Time"), `${time} Kaindorf`],
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
    case "git":
      line(t("Der Quelltext liegt hier:", "The source lives here:"), "dim");
      linkLine("github.com/jx-grxf/johannesgrof.me", links.source);
      break;
    case "date":
      line(new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Vienna" }).format(new Date()) + " (Kaindorf)");
      break;
    case "echo":
      line(arg);
      break;
    case "ping":
      line(t(`${arg || "johannesgrof.me"} antwortet. Du bist ja gerade hier.`, `${arg || "johannesgrof.me"} responds. You are on it right now.`));
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
  title.textContent = "johannes@kaindorf: ~";
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
    run(input.value);
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
