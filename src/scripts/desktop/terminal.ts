import { locale, maybe, openWindow, t, windows } from "./core";

/** A small shell over the desktop itself. Every command does something real —
 *  opens a window, reads the same data the widgets read — rather than printing
 *  a joke. */

const MAX_OUTPUT_ENTRIES = 80;
const MAX_COMMAND_LENGTH = 500;

const history: string[] = [];
let historyIndex = 0;

function write(output: HTMLElement, command: string, reply: string) {
  const entry = document.createElement("div");
  entry.className = "terminal-entry";

  const prompt = document.createElement("strong");
  prompt.textContent = `guest@johannes ~ % ${command}\n`;
  entry.append(prompt, document.createTextNode(reply));
  output.append(entry);

  while (output.childElementCount > MAX_OUTPUT_ENTRIES) output.firstElementChild?.remove();
  entry.scrollIntoView({ block: "nearest" });
}

const HELP = [
  ["help", ["what you are reading", "was du gerade liest"]],
  ["ls", ["list the projects", "die Projekte auflisten"]],
  ["open <app>", ["finder, editor, preview, workshop, contact, settings", "finder, editor, preview, workshop, contact, settings"]],
  ["project <name>", ["open a project by name", "ein Projekt nach Namen öffnen"]],
  ["gh", ["what I pushed last", "was ich zuletzt gepusht habe"]],
  ["weather", ["where you are, and where I am", "bei dir und bei mir"]],
  ["whoami", ["short version", "die Kurzfassung"]],
  ["date", ["local time", "Ortszeit"]],
  ["clear", ["empty the terminal", "Terminal leeren"]],
] as const;

/** Project names come from the catalogue Astro rendered into the page. */
function projects(): { name: string; slug: string }[] {
  const raw = maybe("[data-project-index]")?.textContent ?? "[]";
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as { name: string; slug: string }[]) : [];
  } catch {
    return [];
  }
}

async function githubLine() {
  try {
    const response = await fetch("/api/github", { signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error(String(response.status));

    const data = (await response.json()) as { commits?: { repo: string; message: string; at: string }[] };
    const commits = data.commits ?? [];
    if (!commits.length) return t("Nothing pushed recently.", "Zuletzt nichts gepusht.");

    return commits
      .slice(0, 4)
      .map((commit) => `${new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(new Date(commit.at))}  ${commit.repo}: ${commit.message}`)
      .join("\n");
  } catch {
    return t("GitHub is not reachable right now.", "GitHub ist gerade nicht erreichbar.");
  }
}

async function weatherLine() {
  try {
    const response = await fetch("/api/weather", { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(String(response.status));

    const data = (await response.json()) as {
      visitor: { city: string; temperature: number | null } | null;
      home: { city: string; temperature: number | null };
    };

    const line = (place: { city: string; temperature: number | null }) => `${place.city || "?"}: ${place.temperature === null ? "—" : `${place.temperature}°C`}`;

    return [data.visitor ? `${t("you", "du")}   ${line(data.visitor)}` : "", `${t("me", "ich")}  ${line(data.home)}`].filter(Boolean).join("\n");
  } catch {
    return t("No weather right now.", "Gerade kein Wetter.");
  }
}

async function run(command: string): Promise<string> {
  const [verb = "", ...args] = command.split(/\s+/);

  switch (verb.toLowerCase()) {
    case "help":
      return HELP.map(([name, [en, german]]) => `${name.padEnd(16)}${t(en, german)}`).join("\n");

    case "ls":
    case "projects": {
      const list = projects();
      if (!list.length) {
        openWindow("finder");
        return t("Opening the project folder…", "Projektordner wird geöffnet…");
      }
      return list.map((project) => project.slug).join("\n");
    }

    case "open": {
      const app = args[0]?.toLowerCase() ?? "";
      if (windows.has(app)) {
        openWindow(app);
        return `${t("Opening", "Öffne")} ${app}…`;
      }
      return t("Try: open finder / editor / preview / workshop / contact", "Versuch: open finder / editor / preview / workshop / contact");
    }

    case "project": {
      const query = args.join(" ").toLowerCase();
      const match = projects().find((project) => project.slug === query || project.name.toLowerCase() === query);
      if (!match) return t("No project by that name. Try ls.", "Kein Projekt mit dem Namen. Versuch ls.");

      const { openProject } = await import("./core");
      openProject(match.slug);
      return `${t("Opening", "Öffne")} ${match.name}…`;
    }

    case "gh":
    case "github":
      return githubLine();

    case "weather":
    case "wetter":
      return weatherLine();

    case "whoami":
      return t(
        "Johannes Grof, developer, HTL Kaindorf, south-east Styria.\nSwift and TypeScript mostly. ÖffiGo, Mac apps, developer tools and websites.",
        "Johannes Grof, Entwickler, HTL Kaindorf, Südost-Steiermark.\nMeistens Swift und TypeScript. ÖffiGo, Mac-Apps, Developer-Tools und Websites.",
      );

    case "contact":
    case "mail":
      openWindow("contact");
      return t("Opening the contact window…", "Kontaktfenster wird geöffnet…");

    case "date":
      return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Vienna" }).format(new Date());

    case "echo":
      return args.join(" ");

    default:
      return `${t("Command not found", "Befehl nicht gefunden")}: ${verb}. ${t("Try help.", "Versuch help.")}`;
  }
}

export function init() {
  const form = maybe("[data-terminal-form]");
  const input = maybe<HTMLInputElement>("[data-terminal-input]");
  const output = maybe("[data-terminal-output]");
  if (!form || !input || !output) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = input.value.trim().slice(0, MAX_COMMAND_LENGTH);
    input.value = "";
    if (!command) return;

    history.push(command);
    if (history.length > 100) history.shift();
    historyIndex = history.length;

    if (command.toLowerCase() === "clear") {
      output.replaceChildren();
      return;
    }

    // Commands that need the network print a placeholder first, then replace it,
    // so the prompt never appears to hang.
    void run(command).then((reply) => write(output, command, reply));
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    event.preventDefault();
    historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === "ArrowUp" ? -1 : 1)));
    input.value = history[historyIndex] ?? "";
  });

  input.focus();
}
