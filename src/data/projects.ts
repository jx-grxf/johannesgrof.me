export type ProjectStatus = "active" | "beta" | "experimental" | "preview" | "in development" | "coming soon" | "archived";

export interface ShowcaseImage {
  src: string;
  kind?: "image" | "video";
  fallbackSrc?: string;
  posterSrc?: string;
  alt: string;
  altDe?: string;
  fit?: "cover" | "contain" | "banner";
  width?: number;
  height?: number;
}

// Translatable, human-written copy. English lives on the Project directly;
// `de` carries the full German equivalent. getProjectCopy() merges them.
export interface ProjectCopy {
  tagline: string;
  description: string;
  caseStudy: {
    problem: string;
    built: string;
  };
  highlights: string[];
  releaseHighlights?: string[];
}

export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
  logo?: ShowcaseImage;
  tagline: string;
  description: string;
  caseStudy: {
    problem: string;
    built: string;
  };
  de?: ProjectCopy;
  stack: string[];
  repo: `jx-grxf/${string}`;
  githubUrl: string;
  releaseUrl: string;
  /** Deployed, publicly usable version of the project, when there is one. */
  liveUrl?: string;
  fallbackVersion: string;
  npmPackage?: string;
  /** One-line install command shown as a copy button, e.g. a curl installer. */
  installCommand?: string;
  /** Replaces installCommand for visitors on Windows, where brew or curl | sh do not apply. */
  installCommandWindows?: string;
  downloadsDisabled?: boolean;
  platformLabels?: string[];
  fallbackDownload?: {
    assetName: string;
    assetUrl: string;
    size: number;
    kind: "macos" | "windows" | "linux" | "archive";
  };
  fallbackDownloads?: {
    assetName: string;
    assetUrl: string;
    size: number;
    kind: "macos" | "windows" | "linux" | "archive";
  }[];
  highlights: string[];
  releaseHighlights?: string[];
  showcase: ShowcaseImage[];
  visibility: "public" | "private" | "planned";
}

export const statusLabel = (status: ProjectStatus) => {
  const labels: Record<ProjectStatus, string> = {
    active: "Active",
    beta: "Beta",
    experimental: "Experimental",
    preview: "Preview",
    "in development": "In development",
    "coming soon": "Coming soon",
    archived: "Archived",
  };

  return labels[status];
};

export type ProjectLang = "en" | "de";

// German status labels for the project badge.
export const statusLabelDe: Record<ProjectStatus, string> = {
  active: "Aktiv",
  beta: "Beta",
  experimental: "Experimentell",
  preview: "Vorschau",
  "in development": "In Entwicklung",
  "coming soon": "Bald verfügbar",
  archived: "Archiviert",
};

export const localizedStatusLabel = (status: ProjectStatus, lang: ProjectLang) =>
  lang === "de" ? statusLabelDe[status] : statusLabel(status);

// Returns the project's copy in the requested language, falling back to the
// English fields whenever a German translation is not provided.
export const getProjectCopy = (project: Project, lang: ProjectLang): ProjectCopy => {
  if (lang === "de" && project.de) {
    return project.de;
  }

  return {
    tagline: project.tagline,
    description: project.description,
    caseStudy: project.caseStudy,
    highlights: project.highlights,
    releaseHighlights: project.releaseHighlights,
  };
};

export interface ProjectSection {
  eyebrow: string;
  title: string;
  de: {
    eyebrow: string;
    title: string;
  };
  projects: Project[];
}

export const featuredProjects: Project[] = [
  {
    name: "PortPirate",
    slug: "portpirate",
    status: "coming soon",
    logo: {
      src: "/projects/portpirate/app-icon.webp",
      fallbackSrc: "/projects/portpirate/app-icon.png",
      alt: "PortPirate app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "Local dev servers on your Mac, run by you and your coding agents without collisions.",
    description:
      "A macOS menu bar app for developers who work with Claude Code or Codex. It shows every local dev server, which agent session started it in which worktree, and what that session is doing right now. Agents get their own tools: one call starts a dev server on a free port and returns the URL, and they can read its logs, find the local database and stop only what is theirs. You see all of it in one panel.",
    caseStudy: {
      problem: "With several coding agents in parallel worktrees, dev servers pile up, two agents reach for port 3000, and nobody can tell which process belongs to which session. Agents fall back to sleep loops, curl polling and kill -9.",
      built: "A native Swift menu bar app that maps every listening TCP port to its process, repo, branch and agent session, with hooks for live session status. A bundled MCP server and the pp command give agents eleven tools. start_server reserves a port block per worktree, detects the package manager and framework, starts the server, waits until it answers and keeps its output in a log. wait_for_port, server_logs, list_services and project_context cover the rest. Every stop goes through one validated path in the app.",
    },
    de: {
      tagline: "Lokale Dev-Server auf deinem Mac, gestartet von dir und deinen Coding-Agents, ohne Port-Kollisionen.",
      description:
        "Eine macOS-Menüleisten-App für alle, die mit Claude Code oder Codex arbeiten. Sie zeigt jeden lokalen Dev-Server, welche Agent-Session ihn in welchem Worktree gestartet hat und was diese Session gerade tut. Agents bekommen eigene Werkzeuge: Ein Aufruf startet einen Dev-Server auf einem freien Port und liefert die URL zurück. Danach lesen sie seine Logs, finden die lokale Datenbank und stoppen nur, was ihnen gehört. Du siehst alles in einem Panel.",
      caseStudy: {
        problem: "Arbeiten mehrere Coding-Agents parallel in Worktrees, stapeln sich die Dev-Server, zwei Agents greifen nach Port 3000, und niemand weiß, welcher Prozess zu welcher Session gehört. Die Agents behelfen sich mit sleep-Schleifen, curl-Polling und kill -9.",
        built: "Eine native Swift-Menüleisten-App, die jeden lauschenden TCP-Port seinem Prozess, Repo, Branch und seiner Agent-Session zuordnet, mit Hooks für den Live-Status der Sessions. Ein mitgelieferter MCP-Server und der Befehl pp geben Agents elf Werkzeuge. start_server reserviert pro Worktree einen Portblock, erkennt Paketmanager und Framework, startet den Server, wartet, bis er antwortet, und schreibt seine Ausgabe in ein Log. wait_for_port, server_logs, list_services und project_context decken den Rest ab. Jeder Stopp läuft über einen einzigen geprüften Pfad in der App.",
      },
      highlights: [
        "Jede Claude-Code- und Codex-Session nach Projekt und Branch, mit Live-Status: arbeitet, wartet auf dich, braucht Freigabe.",
        "Agents starten Dev-Server mit einem MCP-Aufruf: freier Port pro Worktree, passender Paketmanager, --port für Vite, Astro, Next.js und Nuxt, zurück kommen URL und Log.",
        "Lokale Datenbanken und Dienste wie PostgreSQL, Redis oder MongoDB erscheinen mit ihrer Verbindungs-URL, für dich und für Agents.",
        "pp im Terminal: pp start, pp logs -f, pp who 3000, pp stop, eval \"$(pp env)\". pp setup richtet Hooks, MCP und einen kurzen Abschnitt in CLAUDE.md und AGENTS.md ein.",
        "Derselbe MCP-Server funktioniert auch in Cursor, Windsurf, VS Code, Zed und Claude Desktop.",
        "Agents stoppen nur eigene Server. PID, Port, Befehl und Ordner werden vor jedem Signal neu geprüft, und in den Einstellungen legst du fest, was Agents dürfen.",
      ],
    },
    stack: ["Swift", "SwiftUI", "MCP"],
    repo: "jx-grxf/PortPirate",
    githubUrl: "https://github.com/jx-grxf/PortPirate",
    releaseUrl: "https://github.com/jx-grxf/PortPirate/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["macOS"],
    highlights: [
      "Every Claude Code and Codex session by project and branch, with live status: working, waiting for you, needs approval.",
      "Agents start dev servers with one MCP call: a free port per worktree, the right package manager, --port for Vite, Astro, Next.js and Nuxt, and the URL and log come back.",
      "Local databases and services such as PostgreSQL, Redis or MongoDB show up with their connection URL, for you and for agents.",
      "pp in the terminal: pp start, pp logs -f, pp who 3000, pp stop, eval \"$(pp env)\". pp setup installs hooks, MCP and a short section in CLAUDE.md and AGENTS.md.",
      "The same MCP server works in Cursor, Windsurf, VS Code, Zed and Claude Desktop.",
      "Agents only stop their own servers. PID, port, command and folder are checked again before any signal, and Settings decide what agents may do.",
    ],
    showcase: [
      {
        src: "/projects/portpirate/showcase.webp",
        fallbackSrc: "/projects/portpirate/showcase.png",
        alt: "PortPirate menu bar panel with four Claude Code sessions and two dev servers an agent started through PortPirate",
        altDe: "PortPirate-Menüleistenpanel mit vier Claude-Code-Sessions und zwei Dev-Servern, die ein Agent über PortPirate gestartet hat",
        fit: "contain",
        width: 944,
        height: 1166,
      },
    ],
    visibility: "planned",
  },
  {
    name: "BottleLite",
    slug: "bottlelite",
    status: "preview",
    logo: {
      src: "/projects/bottlelite/logo.webp",
      fallbackSrc: "/projects/bottlelite/logo.png",
      alt: "BottleLite app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "A lightweight native macOS runner for Windows apps.",
    description:
      "BottleLite is a SwiftUI Wine front-end for running Windows apps on macOS without Electron, accounts, telemetry, or a bundled runtime. It detects your existing Wine install, keeps bottles persistent, imports .exe files safely, and gives each program logs, settings, and stop controls.",
    caseStudy: {
      problem: "Wine workflows on macOS tend to sprawl across Terminal commands, prefixes, logs, and runtime assumptions.",
      built: "A SwiftUI app that manages bottles, validates PE executables, runs GUI and console programs through existing Wine, captures logs, and wires Sparkle update feeds for preview releases.",
    },
    de: {
      tagline: "Ein schlanker nativer macOS-Runner für Windows-Apps.",
      description:
        "BottleLite ist ein SwiftUI-Wine-Frontend für Windows-Apps auf macOS, ohne Electron, Konto, Telemetrie oder mitgelieferte Runtime. Es erkennt dein vorhandenes Wine, hält Bottles persistent, importiert .exe-Dateien sauber und gibt jedem Programm Logs, Einstellungen und Stop-Kontrollen.",
      caseStudy: {
        problem: "Wine-Workflows auf macOS zerfallen schnell in Terminal-Befehle, Prefixes, Logs und Runtime-Vermutungen.",
        built: "Eine SwiftUI-App, die Bottles verwaltet, PE-Dateien validiert, GUI- und Konsolenprogramme über vorhandenes Wine startet, Logs erfasst und Sparkle-Update-Feeds für Preview-Releases verdrahtet.",
      },
      highlights: [
        "Verwaltet persistente Wine-Bottles mit Import, Umbenennen, Löschen und Programm-Settings.",
        "Validiert .exe-Dateien über Endung und MZ-Header, bevor sie in eine Bottle übernommen werden.",
        "Startet GUI-Apps leise und Konsolenprogramme sichtbar in Terminal.app, jeweils mit Logs.",
        "Preview-Distribution mit DMG, Sparkle-Appcast und SHA256-Prüfsummen.",
      ],
    },
    stack: ["Swift", "SwiftUI", "Wine"],
    repo: "jx-grxf/BottleLite",
    githubUrl: "https://github.com/jx-grxf/BottleLite",
    releaseUrl: "https://github.com/jx-grxf/BottleLite/releases/tag/v0.2.0",
    fallbackVersion: "v0.2.0",
    platformLabels: ["macOS", "Wine"],
    fallbackDownloads: [
      {
        assetName: "BottleLite-0.2.0.dmg",
        assetUrl: "https://github.com/jx-grxf/BottleLite/releases/download/v0.2.0/BottleLite-0.2.0.dmg",
        size: 3611850,
        kind: "macos",
      },
      {
        assetName: "BottleLite-0.2.0.zip",
        assetUrl: "https://github.com/jx-grxf/BottleLite/releases/download/v0.2.0/BottleLite-0.2.0.zip",
        size: 2676195,
        kind: "archive",
      },
    ],
    highlights: [
      "Manages persistent Wine bottles with import, rename, delete, and per-program settings.",
      "Validates .exe files by extension and MZ header before adding them to a bottle.",
      "Runs GUI apps quietly and console tools visibly in Terminal.app, with logs for each launch.",
      "Preview distribution includes a DMG, Sparkle appcast, and SHA256 checksums.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "MacPhone",
    slug: "macphone",
    status: "active",
    logo: {
      src: "/projects/macphone/logo.webp",
      fallbackSrc: "/projects/macphone/logo.png",
      alt: "MacPhone app icon",
      fit: "contain",
      width: 512,
      height: 512,
    },
    tagline: "Real Bluetooth LE devices in the Android emulator on your Mac.",
    description:
      "MacPhone connects to a Bluetooth LE device over the Mac's built-in radio and publishes it inside the Android emulator. The app you are testing scans, connects, reads, writes and subscribes as it would on a phone, with no USB dongle and no change to its code. The same window runs your Android emulators and Xcode simulators.",
    caseStudy: {
      problem: "The Android emulator has a virtual Bluetooth controller but no way to reach real hardware. The usual workarounds are a USB dongle passed through to the emulator, or a library compiled into the app that only exists for testing.",
      built: "A SwiftUI app that acts as a CoreBluetooth central, reads the device's GATT table and hands it over a token-protected localhost socket to a Bumble process. That process publishes the same services, name and manufacturer data on netsim, the emulator's controller, and forwards every read, write and notification to the real device.",
    },
    de: {
      tagline: "Echte Bluetooth-LE-Geräte im Android-Emulator auf dem Mac.",
      description:
        "MacPhone verbindet sich über das eingebaute Bluetooth des Mac mit einem BLE-Gerät und stellt es im Android-Emulator bereit. Die App, die du testest, sucht, verbindet, liest, schreibt und abonniert wie auf einem Handy, ohne USB-Dongle und ohne Änderung am Code. Im selben Fenster laufen deine Android-Emulatoren und Xcode-Simulatoren.",
      caseStudy: {
        problem: "Der Android-Emulator hat einen virtuellen Bluetooth-Controller, kommt aber nicht an echte Hardware. Die üblichen Umwege sind ein USB-Dongle, der in den Emulator durchgereicht wird, oder eine Bibliothek in der App, die es nur zum Testen gibt.",
        built: "Eine SwiftUI-App, die als CoreBluetooth-Central die GATT-Tabelle des Geräts liest und sie über einen per Token geschützten Localhost-Socket an einen Bumble-Prozess gibt. Der stellt dieselben Services, denselben Namen und dieselben Herstellerdaten auf netsim bereit, dem Controller des Emulators, und leitet jedes Lesen, Schreiben und jede Notification an das echte Gerät weiter.",
      },
      highlights: [
        "Echte BLE-Geräte im Android-Emulator, über das Bluetooth des Mac, ohne Dongle.",
        "Die getestete App nutzt die normale Android-Bluetooth-API. Keine zusätzliche Bibliothek.",
        "Lesen, Schreiben und Notifications in beide Richtungen, Abos bleiben nach einem Reconnect bestehen.",
        "Android-Emulatoren (Android 14 bis 17) und Xcode-Simulatoren aller Apple-Plattformen anlegen, starten und verwalten.",
        "Apps per Drag-and-drop installieren, URLs öffnen, Screenshots, Hell- und Dunkelmodus.",
        "Grenzen: nur Bluetooth LE, keine Geräte mit Bluetooth-Pairing, kein Bluetooth im iOS-Simulator.",
      ],
    },
    stack: ["Swift", "SwiftUI", "Bluetooth LE", "Android"],
    repo: "jx-grxf/MacPhone",
    githubUrl: "https://github.com/jx-grxf/MacPhone",
    releaseUrl: "https://github.com/jx-grxf/MacPhone/releases/tag/v0.3.1",
    fallbackVersion: "v0.3.1",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "MacPhone-0.3.1.dmg",
        assetUrl: "https://github.com/jx-grxf/MacPhone/releases/download/v0.3.1/MacPhone-0.3.1.dmg",
        size: 4317436,
        kind: "macos",
      },
      {
        assetName: "MacPhone-0.3.1.zip",
        assetUrl: "https://github.com/jx-grxf/MacPhone/releases/download/v0.3.1/MacPhone-0.3.1.zip",
        size: 4350142,
        kind: "archive",
      },
    ],
    highlights: [
      "Real BLE devices in the Android emulator, through the Mac's own Bluetooth, no dongle.",
      "The app under test uses the normal Android Bluetooth API. No extra library.",
      "Reads, writes and notifications both ways; subscriptions survive a reconnect.",
      "Create, run and manage Android emulators (Android 14 to 17) and Xcode simulators for every Apple platform.",
      "Install apps by drag and drop, open URLs, take screenshots, switch light and dark mode.",
      "Limits: Bluetooth LE only, no devices that need Bluetooth pairing, no Bluetooth in the iOS Simulator.",
    ],
    showcase: [
      {
        src: "/projects/macphone/overview.webp",
        fallbackSrc: "/projects/macphone/overview.png",
        alt: "MacPhone overview dashboard listing connected Android emulators and iOS simulators",
        altDe: "MacPhone mit verbundenen Android-Emulatoren und iOS-Simulatoren",
        fit: "cover",
        width: 2000,
        height: 1450,
      },
      {
        src: "/projects/macphone/how-it-works.svg",
        alt: "How the bridge works: BLE device, the Mac's radio, MacPhone, a local Bumble bridge, netsim, and the app in the Android emulator",
        altDe: "So funktioniert die Bridge: BLE-Gerät, Bluetooth des Mac, MacPhone, lokale Bumble-Bridge, netsim und die App im Android-Emulator",
        fit: "contain",
        width: 960,
        height: 300,
      },
    ],
    visibility: "public",
  },
  {
    name: "OpenClaw-Discord-Voice",
    slug: "openclaw-discord-voice",
    status: "archived",
    tagline: "Talk to a local OpenClaw agent through a Discord voice channel.",
    description:
      "Join a voice channel, speak one turn, and the bridge transcribes it locally with Whisper, hands it to your local OpenClaw session, and plays the reply back. The whole pipeline stays on your machine and in view.",
    caseStudy: {
      problem: "Voice-controlling a local agent over Discord usually means a hosted bot you can't see into and don't fully control.",
      built: "A self-hosted Discord.js bridge: Opus decode, ffmpeg to WAV, local whisper-cli transcription, one session per guild, and switchable Piper, macOS say, or ElevenLabs voices.",
    },
    de: {
      tagline: "Sprich über einen Discord-Voice-Channel mit einem lokalen OpenClaw-Agenten.",
      description:
        "Tritt einem Voice-Channel bei, sprich einen Zug, und die Bridge transkribiert ihn lokal mit Whisper, gibt ihn an deine lokale OpenClaw-Session und spielt die Antwort zurück. Die ganze Pipeline bleibt auf deinem Rechner und sichtbar.",
      caseStudy: {
        problem: "Einen lokalen Agenten per Discord-Voice zu steuern heißt meist: ein gehosteter Bot, in den du nicht reinsiehst und den du nicht kontrollierst.",
        built: "Eine self-hosted Discord.js-Bridge: Opus-Decode, ffmpeg zu WAV, lokale whisper-cli-Transkription, eine Session pro Guild und umschaltbare Stimmen (Piper, macOS say oder ElevenLabs).",
      },
      highlights: [
        "Nimmt einen gesprochenen Zug auf und transkribiert ihn lokal mit whisper-cli, ohne Cloud-Spracherkennung.",
        "Verbindet direkt mit deiner lokalen OpenClaw-Session, eine pro Discord-Guild.",
        "Umschaltbare Antworten: Piper, macOS say oder ElevenLabs.",
        "Eingebaute doctor- und /info-Checks für Env, Binaries, Modellpfad und Discord-Auth.",
      ],
    },
    stack: ["TypeScript", "Discord", "Voice"],
    repo: "jx-grxf/OpenClaw-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    releaseUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    fallbackVersion: "archived",
    downloadsDisabled: true,
    platformLabels: ["Node.js", "Discord"],
    highlights: [
      "Captures one spoken turn and transcribes it locally with whisper-cli, no cloud speech recognition.",
      "Bridges straight into your local OpenClaw session, one per Discord guild.",
      "Switchable replies: Piper, macOS say, or ElevenLabs.",
      "Built-in doctor and /info checks for env, binaries, model path, and Discord auth.",
    ],
    showcase: [
      {
        src: "/projects/openclaw-discord-voice/pipeline.webp",
        fallbackSrc: "/projects/openclaw-discord-voice/pipeline.png",
        alt: "Pipeline diagram for OpenClaw Discord Voice",
        fit: "contain",
        width: 1600,
        height: 900,
      },
    ],
    visibility: "private",
  },
  {
    name: "dirhop",
    slug: "dirhop",
    status: "beta",
    logo: {
      src: "/projects/dirhop/logo.webp",
      fallbackSrc: "/projects/dirhop/logo.png",
      alt: "dirhop icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "Jump to any folder from the terminal in a few keystrokes.",
    description:
      "A fuzzy folder picker for the terminal, written in Rust. It searches every folder in your home directory while you type, ranks your projects and the places you visit most at the top, and drops you there with Enter. You choose the command name and the shortcut in a small settings screen, and it keeps itself up to date from GitHub releases.",
    caseStudy: {
      problem: "Getting into a project meant tabbing through four or five folders every time, and jump tools like zoxide only know folders you have already visited.",
      built: "A parallel directory walk built on the ignore crate (the one ripgrep uses) streams folders into the UI in batches, so results show up before the scan is done. The Helix editor's nucleo matcher scores every keystroke, plus a bonus for git repos, project folders and frecency. The UI draws on stderr and prints the chosen path on stdout, so a small zsh, bash, fish or PowerShell function can cd into it. Release builds cover macOS, Linux and Windows on x64 and arm64.",
    },
    de: {
      tagline: "Mit ein paar Tastendrücken in jeden Ordner springen, direkt im Terminal.",
      description:
        "Ein Fuzzy-Ordnerwähler fürs Terminal, in Rust geschrieben. Er durchsucht beim Tippen jeden Ordner im Home-Verzeichnis, reiht deine Projekte und die meistbesuchten Orte nach oben und bringt dich mit Enter hin. Befehlsname und Tastenkürzel stellst du in einem kleinen Einstellungsbildschirm ein, Updates holt er sich selbst aus den GitHub-Releases.",
      caseStudy: {
        problem: "Um in ein Projekt zu kommen, musste ich mich jedes Mal durch vier, fünf Ordner tabben, und Sprung-Tools wie zoxide kennen nur Ordner, in denen man schon war.",
        built: "Ein paralleler Verzeichnis-Scan auf Basis des ignore-Crates (das auch ripgrep nutzt) schickt Ordner stapelweise an die Oberfläche, Ergebnisse erscheinen also schon vor Ende des Scans. Der nucleo-Matcher aus dem Helix-Editor bewertet jeden Tastendruck, dazu kommt ein Bonus für Git-Repos, Projektordner und häufig besuchte Orte. Die Oberfläche zeichnet auf stderr und gibt den gewählten Pfad auf stdout aus, damit eine kleine zsh-, bash-, fish- oder PowerShell-Funktion hineinwechseln kann. Release-Builds gibt es für macOS, Linux und Windows, jeweils für x64 und arm64.",
      },
      highlights: [
        "Durchsucht rund 10.000 Ordner in unter 100 ms und startet sofort mit dem Index vom letzten Mal, neue Ordner kommen beim Tippen dazu.",
        "Git-Repos, Projektordner und oft besuchte Orte stehen oben, Strg-B pinnt Ordner fest. hop dirhop springt direkt hin, wenn ein Treffer klar vorne liegt.",
        "Vorschau mit Git-Branch, erkannter Sprache und Ordnerinhalt; Strg-E öffnet im Editor, Strg-O im Dateimanager.",
        "Läuft auf macOS, Linux und Windows mit zsh, bash, fish oder PowerShell. Installation mit einem Befehl, Updates mit SHA-256-Prüfung.",
      ],
    },
    stack: ["Rust", "ratatui", "nucleo"],
    repo: "jx-grxf/dirhop",
    githubUrl: "https://github.com/jx-grxf/dirhop",
    releaseUrl: "https://github.com/jx-grxf/dirhop/releases/latest",
    installCommand: "curl -fsSL https://raw.githubusercontent.com/jx-grxf/dirhop/main/install.sh | sh",
    installCommandWindows: "irm https://raw.githubusercontent.com/jx-grxf/dirhop/main/install.ps1 | iex",
    fallbackVersion: "v0.2.0",
    platformLabels: ["macOS", "Windows", "Linux"],
    highlights: [
      "Searches around 10,000 folders in under 100 ms and opens instantly with the index from last time, adding new folders while you type.",
      "Git repos, project folders and the places you visit most rank first, Ctrl-B pins a folder. hop dirhop jumps straight there when one match clearly wins.",
      "Preview with git branch, detected language and folder contents; Ctrl-E opens your editor, Ctrl-O opens your file manager.",
      "Runs on macOS, Linux and Windows with zsh, bash, fish or PowerShell. One-line install, self-updates checked against SHA-256.",
    ],
    showcase: [
      {
        src: "/projects/dirhop/dirhop-demo.mp4",
        kind: "video",
        posterSrc: "/projects/dirhop/showcase.webp",
        fallbackSrc: "/projects/dirhop/showcase.png",
        alt: "dirhop demo: typing hop, searching for wea and jumping into the weather-app project",
        altDe: "dirhop-Demo: hop tippen, nach wea suchen und ins Projekt weather-app springen",
        fit: "contain",
        width: 1280,
        height: 720,
      },
      {
        src: "/projects/dirhop/showcase.webp",
        fallbackSrc: "/projects/dirhop/showcase.png",
        alt: "dirhop picker with ranked folder matches and a preview showing the git branch and language",
        altDe: "dirhop-Auswahl mit gereihten Ordner-Treffern und einer Vorschau mit Git-Branch und Sprache",
        fit: "contain",
        width: 1280,
        height: 720,
      },
      {
        src: "/projects/dirhop/settings.webp",
        fallbackSrc: "/projects/dirhop/settings.png",
        alt: "dirhop settings screen with command name, shortcut, folders, editor and automatic updates",
        altDe: "dirhop-Einstellungen mit Befehlsname, Tastenkürzel, Ordnern, Editor und automatischen Updates",
        fit: "contain",
        width: 1280,
        height: 720,
      },
    ],
    visibility: "public",
  },
  {
    name: "HealthKit-MCP",
    slug: "healthkit-mcp",
    status: "experimental",
    tagline: "Read-only Apple Health context for MCP-capable agents.",
    description:
      "A bridge that syncs Apple Health aggregates from an iPhone app into a scoped backend and exposes sleep, workouts, training load, and trends through a read-only Model Context Protocol server.",
    caseStudy: {
      problem: "Apple Health has rich personal context, but there is no normal server API an agent can read from safely.",
      built: "A TypeScript MCP server, Supabase schema, and iOS HealthKit sync plan that move aggregate summaries instead of raw health samples.",
    },
    de: {
      tagline: "Read-only Apple-Health-Kontext für MCP-fähige Agents.",
      description:
        "Eine Brücke, die Apple-Health-Aggregate aus einer iPhone-App in ein abgegrenztes Backend synchronisiert und Schlaf, Workouts, Trainingslast und Trends über einen read-only Model-Context-Protocol-Server verfügbar macht.",
      caseStudy: {
        problem: "Apple Health enthält wertvollen persönlichen Kontext, aber es gibt keine normale Server-API, aus der ein Agent sicher lesen kann.",
        built: "Einen TypeScript-MCP-Server, ein Supabase-Schema und einen iOS-HealthKit-Sync-Plan, der Aggregate statt roher Health-Samples bewegt.",
      },
      highlights: [
        "Read-only MCP-Tools für tägliche Zusammenfassungen, Schlaf, Workouts, Trainingslast und Trends.",
        "Demo-Modus läuft ohne Backend; Supabase-Pfad ist für echte Nutzertrennung vorbereitet.",
        "iPhone liest HealthKit lokal und synchronisiert Aggregate statt Rohsamples.",
        "Für ChatGPT, Claude, Codex und Claude Code als MCP-Connector gedacht.",
      ],
    },
    stack: ["TypeScript", "MCP", "HealthKit"],
    repo: "jx-grxf/HealthKit-MCP",
    githubUrl: "https://github.com/jx-grxf/HealthKit-MCP",
    releaseUrl: "https://github.com/jx-grxf/HealthKit-MCP/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["MCP", "iOS", "Supabase"],
    highlights: [
      "Read-only MCP tools for daily summaries, sleep, workouts, training load, and trends.",
      "Demo mode runs without a backend; the Supabase path is prepared for real user isolation.",
      "The iPhone side reads HealthKit locally and syncs aggregates instead of raw samples.",
      "Built for ChatGPT, Claude, Codex, and Claude Code as MCP-capable clients.",
    ],
    showcase: [],
    visibility: "private",
  },
  {
    name: "DocxToPDF",
    slug: "docxtopdf",
    status: "archived",
    tagline: "Batch-convert DOCX to PDF using Word itself as the engine.",
    description:
      "A keyboard-driven macOS tool that Spotlight-searches your whole Mac for DOCX files, lets you tick the ones you want, and exports them all in one Word session, so the PDFs match Word's own output, not a parser's guess.",
    caseStudy: {
      problem: "Exporting DOCX to PDF by hand is tedious, and LibreOffice or library converters quietly mangle complex Word layouts.",
      built: "A TypeScript TUI that finds DOCX via Spotlight, offers keyboard multi-select, and drives Microsoft Word over AppleScript to export in a single batch session.",
    },
    de: {
      tagline: "DOCX stapelweise zu PDF, mit Word selbst als Engine.",
      description:
        "Ein tastaturgesteuertes macOS-Tool, das per Spotlight den ganzen Mac nach DOCX-Dateien durchsucht, dich die gewünschten anhaken lässt und sie alle in einer Word-Session exportiert. So passen die PDFs zu Words eigener Ausgabe, nicht zum Rateversuch eines Parsers.",
      caseStudy: {
        problem: "DOCX von Hand zu PDF zu exportieren ist mühsam, und LibreOffice oder Library-Konverter zerschießen komplexe Word-Layouts stillschweigend.",
        built: "Ein TypeScript-TUI, das DOCX per Spotlight findet, Mehrfachauswahl per Tastatur bietet und Microsoft Word über AppleScript zum Batch-Export in einer Session steuert.",
      },
      highlights: [
        "Nutzt Microsoft Word selbst als Renderer, damit die PDFs zu Words eigenem Export passen.",
        "Durchsucht den ganzen Mac per Spotlight nach DOCX, mit Dateisystem-Fallback.",
        "Mehrfachauswahl und Filter per Tastatur; eine Word-Session exportiert den ganzen Stapel.",
        "Optionale OCRmyPDF-Schicht hält die Ausgabe durchsuchbar.",
      ],
    },
    stack: ["TypeScript", "macOS", "Word"],
    repo: "jx-grxf/DocxToPDF",
    githubUrl: "https://github.com/jx-grxf/DocxToPDF",
    releaseUrl: "https://github.com/jx-grxf/DocxToPDF/releases/tag/v0.1.0",
    fallbackVersion: "v0.1.0",
    platformLabels: ["macOS", "Microsoft Word"],
    highlights: [
      "Uses Microsoft Word itself as the renderer, so PDFs match Word's own export.",
      "Spotlight-searches the whole Mac for DOCX, with a filesystem fallback.",
      "Keyboard multi-select and filter; one Word session exports the whole batch.",
      "Optional OCRmyPDF layer keeps the output searchable.",
    ],
    showcase: [
      {
        src: "/projects/docxtopdf/hero.webp",
        fallbackSrc: "/projects/docxtopdf/hero.png",
        alt: "DocxToPDF terminal export flow",
        fit: "contain",
        width: 1600,
        height: 900,
      },
    ],
    visibility: "public",
  },
  {
    name: "Caruso-Reborn",
    slug: "caruso-reborn",
    status: "beta",
    logo: {
      src: "/projects/caruso-reborn/logo.webp",
      fallbackSrc: "/projects/caruso-reborn/logo.png",
      alt: "Caruso Reborn app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "Internet radio, brought back to first-gen T+A Caruso systems.",
    description:
      "T+A dropped a usable internet-radio path for older Caruso units, so this turns your computer into a local UPnP/DLNA source: search stations on your laptop, save the ones that work, and browse them again from the Caruso, along with your own music folders.",
    caseStudy: {
      problem: "First-gen Caruso systems still sound great, but T+A no longer offers a practical native internet-radio path, so everyday station browsing is broken.",
      built: "A local Fastify and UPnP/DLNA bridge that announces itself as a media server, resolves real stream URLs from TuneIn and Radio Browser, and exposes saved stations and local music under the Caruso's own tree, with a web dashboard and a keyboard TUI control room.",
    },
    de: {
      tagline: "Internetradio zurück auf T+A-Caruso-Systeme der ersten Generation.",
      description:
        "T+A hat den brauchbaren Internetradio-Weg für ältere Caruso-Geräte fallengelassen, also macht das hier deinen Computer zur lokalen UPnP/DLNA-Quelle: Sender am Laptop suchen, die funktionierenden speichern und am Caruso wieder durchblättern, plus deine eigenen Musikordner.",
      caseStudy: {
        problem: "Caruso-Systeme der ersten Generation klingen noch immer top, aber T+A bietet keinen praktikablen nativen Internetradio-Weg mehr, also ist das alltägliche Sender-Browsing kaputt.",
        built: "Eine lokale Fastify-und-UPnP/DLNA-Bridge, die sich als Media-Server ankündigt, echte Stream-URLs aus TuneIn und Radio Browser auflöst und gespeicherte Sender und lokale Musik im Caruso-eigenen Baum bereitstellt, dazu ein Web-Dashboard und ein tastaturgesteuerter TUI-Kontrollraum.",
      },
      highlights: [
        "Macht deinen Mac zum UPnP/DLNA-Media-Server, den der Caruso durchblättern kann.",
        "Löst spielbare Streams aus TuneIn auf, mit Radio-Browser als Fallback.",
        "Gespeicherte Sender und lokale Musikordner erscheinen im Caruso-eigenen Baum.",
        "Web-Dashboard plus tastaturgesteuertes Kontrollraum-TUI; bindet neu, wenn du LAN/WLAN wechselst.",
      ],
    },
    stack: ["TypeScript", "UPnP", "DLNA"],
    repo: "jx-grxf/Caruso-Reborn",
    githubUrl: "https://github.com/jx-grxf/Caruso-Reborn",
    releaseUrl: "https://github.com/jx-grxf/Caruso-Reborn/releases/tag/v0.2.1",
    fallbackVersion: "v0.2.1",
    fallbackDownloads: [
      {
        assetName: "Caruso.Reborn.Beta-0.2.1-arm64.dmg",
        assetUrl: "https://github.com/jx-grxf/Caruso-Reborn/releases/download/v0.2.1/Caruso.Reborn.Beta-0.2.1-arm64.dmg",
        size: 135028808,
        kind: "macos"
      }
    ],
    platformLabels: ["macOS", "Web"],
    highlights: [
      "Turns your Mac into a UPnP/DLNA media server the Caruso can browse.",
      "Resolves playable streams from TuneIn, with a Radio Browser fallback.",
      "Saved stations and local music folders appear in the Caruso's own tree.",
      "Web dashboard plus a keyboard control-room TUI; rebinds when you switch LAN/Wi-Fi.",
    ],
    showcase: [
      {
        src: "/projects/caruso-reborn/hero.webp",
        fallbackSrc: "/projects/caruso-reborn/hero.png",
        alt: "Caruso Reborn dashboard",
        fit: "cover",
        width: 1600,
        height: 900,
      },
    ],
    visibility: "public",
  },
  {
    name: "ip-multitool",
    slug: "ip-multitool",
    status: "active",
    tagline: "A focused terminal toolkit for IP, DNS, RDAP, HTTP, and subnet diagnostics.",
    description:
      "A Python CLI/TUI for practical network checks: IP and domain lookup, privacy indicators, DNS records, RDAP/WHOIS, HTTP response inspection, subnet math, local network discovery, and authorized port checks.",
    caseStudy: {
      problem: "Network debugging often jumps between web lookups, dig, whois, curl, subnet calculators, and local scan tools.",
      built: "A Python package with a full-screen TUI, scriptable commands, JSON output, optional dig/nmap/arp-scan integration, and explicit safety boundaries.",
    },
    de: {
      tagline: "Ein fokussiertes Terminal-Toolkit für IP-, DNS-, RDAP-, HTTP- und Subnetz-Diagnostik.",
      description:
        "Ein Python-CLI/TUI für praktische Netzwerkchecks: IP- und Domain-Lookup, Privacy-Indikatoren, DNS-Records, RDAP/WHOIS, HTTP-Inspection, Subnetz-Rechnung, lokale Netzwerkerkennung und autorisierte Port-Checks.",
      caseStudy: {
        problem: "Netzwerkdebugging springt oft zwischen Web-Lookups, dig, whois, curl, Subnetzrechnern und lokalen Scan-Tools.",
        built: "Ein Python-Package mit Fullscreen-TUI, scriptbaren Commands, JSON-Ausgabe, optionaler dig/nmap/arp-scan-Integration und expliziten Sicherheitsgrenzen.",
      },
      highlights: [
        "IP-/Domain-Lookups mit Geo, ISP, ASN, Reverse DNS, RDAP und Privacy-Indikatoren.",
        "DNS-, WHOIS/RDAP-, HTTP- und TLS-Checks mit JSON-Ausgabe für Automation.",
        "Subnetzrechner, Telefonnummern-Parsing, LAN-Erkennung und autorisierte Port-Checks.",
        "Klare Grenzen: keine Personalisierung aus IPs, keine Scans ohne Berechtigung.",
      ],
    },
    stack: ["Python", "CLI", "Networking"],
    repo: "jx-grxf/ip-multitool",
    githubUrl: "https://github.com/jx-grxf/ip-multitool",
    releaseUrl: "https://github.com/jx-grxf/ip-multitool/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["Terminal", "Python"],
    highlights: [
      "IP and domain lookups with geo, ISP, ASN, reverse DNS, RDAP, and privacy indicators.",
      "DNS, WHOIS/RDAP, HTTP, and TLS checks with JSON output for automation.",
      "Subnet calculator, phone parsing, LAN discovery, and authorized port checks.",
      "Clear limits: no person identification from IPs and no scans without authorization.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "PatchPilot",
    slug: "patchpilot",
    status: "beta",
    tagline: "A terminal coding agent for local models, with configurable permissions.",
    description:
      "PatchPilot works inside a repository with a model you run yourself: Ollama, LM Studio, MLX, llama.cpp or vLLM. Every file edit and shell command shows up in the transcript first, and the risky ones wait for your approval. Since 2.0 there are no cloud providers and no API keys.",
    caseStudy: {
      problem: "Most coding agents send your code to someone else's server and hide the run behind a chat bubble. Small local models, on the other hand, tend to break tool calls and loop until the run is wasted.",
      built: "A TypeScript terminal UI with nine focused tools, native function calling plus a validated fallback for smaller models, isolated child agents with narrow permissions, and a context meter that shows when the window is about to fill up.",
    },
    de: {
      tagline: "Ein Coding-Agent für lokale Modelle im Terminal, mit konfigurierbaren Berechtigungen.",
      description:
        "PatchPilot arbeitet direkt im Repository, mit einem Modell, das du selbst betreibst: Ollama, LM Studio, MLX, llama.cpp oder vLLM. Jede Dateiänderung und jeder Shell-Befehl steht zuerst im Transcript, die riskanten warten auf deine Freigabe. Seit 2.0 gibt es keine Cloud-Anbieter und keine API-Keys mehr.",
      caseStudy: {
        problem: "Die meisten Coding-Agents schicken deinen Code an fremde Server und verstecken den Ablauf hinter einer Chat-Blase. Kleine lokale Modelle wiederum zerschießen gern Tool-Aufrufe und drehen sich im Kreis, bis der Lauf verloren ist.",
        built: "Eine TypeScript-Terminal-Oberfläche mit neun klar abgegrenzten Tools, nativem Function Calling plus geprüftem Fallback für kleinere Modelle, isolierten Sub-Agents mit engen Rechten und einer Kontext-Anzeige, die zeigt, wann das Fenster voll wird.",
      },
      highlights: [
        "Nur lokal: Ollama auf dem eigenen Rechner, im LAN oder über Tailscale, dazu OpenAI-kompatible Server wie LM Studio, MLX, llama.cpp und vLLM.",
        "Jeder Dateizugriff und jeder Shell-Befehl landet im Transcript, bevor er läuft; plan-, build- und bypass-Modus mit Workspace-Grenzen.",
        "Kleine Modelle bleiben brauchbar: Tool-Aufrufe werden geprüft und bei Fehlern schrittweise repariert.",
        "Sessions lassen sich fortsetzen, Kontext anpinnen und verdichten, Sub-Agents arbeiten mit eigenem Kontext.",
      ],
      releaseHighlights: [
        "2.0 entfernt Gemini, OpenRouter, NVIDIA und Codex und baut den Agenten rund um lokale Inferenz neu.",
        "Modellerkennung über alle unterstützten Runtimes, inklusive Messung des Kontextfensters.",
        "2.0.1 härtet Session-IDs und das Auslesen von DOCX-Dateien.",
      ],
    },
    stack: ["TypeScript", "Ink", "Ollama"],
    repo: "jx-grxf/PatchPilot",
    githubUrl: "https://github.com/jx-grxf/PatchPilot",
    releaseUrl: "https://github.com/jx-grxf/PatchPilot/releases/tag/v2.0.1",
    fallbackVersion: "v2.0.1",
    fallbackDownloads: [
      {
        assetName: "jx-grxf-patchpilot-2.0.1.tgz",
        assetUrl: "https://github.com/jx-grxf/PatchPilot/releases/download/v2.0.1/jx-grxf-patchpilot-2.0.1.tgz",
        size: 347306,
        kind: "archive"
      }
    ],
    npmPackage: "@jx-grxf/patchpilot",
    platformLabels: ["npm", "Terminal"],
    highlights: [
      "Local only: Ollama on your machine, your LAN or over Tailscale, plus OpenAI-compatible servers like LM Studio, MLX, llama.cpp and vLLM.",
      "Every file read and shell command lands in the transcript before it runs, with plan, build and bypass modes and a workspace boundary.",
      "Small models stay usable: tool calls are validated and repaired step by step when they break.",
      "Resumable sessions, pinned and compacted context, and child agents that work in their own context.",
    ],
    releaseHighlights: [
      "2.0 removes Gemini, OpenRouter, NVIDIA and Codex and rebuilds the agent around local inference.",
      "Model discovery across every supported runtime, including a measured context window.",
      "2.0.1 hardens session IDs and DOCX text extraction.",
    ],
    // The 1.x screenshot showed the old cloud providers; 2.0 is local-only, so
    // the page shows the terminal card until there is a current capture.
    showcase: [],
    visibility: "public",
  },
  {
    name: "SlamX",
    slug: "slamx",
    status: "archived",
    logo: {
      src: "/projects/slamx/logo.webp",
      fallbackSrc: "/projects/slamx/logo.png",
      alt: "SlamX app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "Slap your MacBook and it knows. Real accelerometer, no microphone.",
    description:
      "A native macOS toy that reads the MacBook's built-in Apple SPU accelerometer over IOKit HID, spots a sharp impact spike, counts it, and plays a sound. No mic, no fake triggers: it reacts to the actual motion sensor, with live telemetry and a calibration wizard so you can see it working.",
    caseStudy: {
      problem: "A joke 'slap detector' is easy to fake with the microphone or a fixed trigger. Apple also gives no clean public Core Motion API for the MacBook accelerometer.",
      built: "A SwiftUI app that taps the private AppleSPUHIDDevice stream through IOKit HID, with live telemetry (impact, peak, sample rate, raw bytes), Soft/Balanced/Hard presets, a calibration wizard, and local sound feedback.",
    },
    de: {
      tagline: "Hau auf dein MacBook und es merkt's. Echter Beschleunigungssensor, kein Mikrofon.",
      description:
        "Ein natives macOS-Spielzeug, das den eingebauten Apple-SPU-Beschleunigungssensor des MacBooks über IOKit HID ausliest, einen scharfen Impuls erkennt, ihn zählt und einen Sound spielt. Kein Mikro, keine gefälschten Trigger: es reagiert auf den echten Bewegungssensor, mit Live-Telemetrie und Kalibrier-Assistent, damit du es arbeiten siehst.",
      caseStudy: {
        problem: "Ein Scherz-Schlagdetektor lässt sich leicht mit dem Mikrofon oder einem festen Trigger faken. Apple bietet auch keine saubere öffentliche Core-Motion-API für den MacBook-Beschleunigungssensor.",
        built: "Eine SwiftUI-App, die den privaten AppleSPUHIDDevice-Stream über IOKit HID anzapft, mit Live-Telemetrie (Impuls, Peak, Sample-Rate, Roh-Bytes), Soft/Balanced/Hard-Presets, Kalibrier-Assistent und lokalem Sound-Feedback.",
      },
      highlights: [
        "Liest den Apple-SPU-Beschleunigungssensor des MacBooks direkt über IOKit HID.",
        "Live-Telemetrie: Impuls, Peak, Sample-Rate, Achsen, Magnitude und Roh-HID-Bytes.",
        "Nur der Sensor: kein Mikrofonzugriff, kein Audio-Fallback, kein Upload.",
        "Kalibrier-Assistent, Schwellen-Presets und eigene Sounds. Für den Spaß gebaut; bitte misshandle deinen Mac nicht wirklich.",
      ],
    },
    stack: ["Swift", "macOS", "Sensors"],
    repo: "jx-grxf/SlamX",
    githubUrl: "https://github.com/jx-grxf/SlamX",
    releaseUrl: "https://github.com/jx-grxf/SlamX/releases/tag/v0.3.5",
    fallbackVersion: "v0.3.5",
    fallbackDownloads: [
      {
        assetName: "SlamX-0.3.5.dmg",
        assetUrl: "https://github.com/jx-grxf/SlamX/releases/download/v0.3.5/SlamX-0.3.5.dmg",
        size: 5713557,
        kind: "macos"
      }
    ],
    platformLabels: ["macOS"],
    highlights: [
      "Reads the MacBook's Apple SPU accelerometer directly over IOKit HID.",
      "Live telemetry: impact, peak, sample rate, axes, magnitude, and raw HID bytes.",
      "Sensor only: no microphone access, no audio fallback, nothing uploaded.",
      "Calibration wizard, threshold presets, and your own sounds. Built for fun; please don't actually abuse your Mac.",
    ],
    showcase: [
      {
        src: "/projects/slamx/monitor-dash.webp",
        fallbackSrc: "/projects/slamx/monitor-dash.jpeg",
        alt: "SlamX live dashboard",
        fit: "contain",
        width: 1600,
        height: 900,
      },
      {
        src: "/projects/slamx/monitor-calibration.webp",
        fallbackSrc: "/projects/slamx/monitor-calibration.jpeg",
        alt: "SlamX calibration view",
        fit: "contain",
        width: 1600,
        height: 900,
      },
      {
        src: "/projects/slamx/monitor-slamx.webp",
        fallbackSrc: "/projects/slamx/monitor-slamx.jpeg",
        alt: "SlamX onboarding view",
        fit: "contain",
        width: 1600,
        height: 900,
      },
    ],
    visibility: "public",
  },
  {
    name: "BriskEdit",
    slug: "briskedit",
    status: "in development",
    logo: {
      src: "/projects/briskedit/logo.webp",
      fallbackSrc: "/projects/briskedit/logo.png",
      alt: "BriskEdit app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "A native Mac editor with a terminal and Markdown preview.",
    description:
      "BriskEdit is a native editor built with SwiftUI and AppKit. It has an integrated terminal, Markdown preview and a Run button that finds the right toolchain for the file you are editing.",
    caseStudy: {
      problem: "I wanted a Mac editor for small coding tasks, with a terminal and Markdown preview already built in.",
      built: "A native editor on TextKit 2 and AppKit with an integrated SwiftTerm terminal, a toolchain-discovering Run button, Markdown preview, gitignore-aware find, and LSP completion from the servers already on your machine. No Electron, no telemetry.",
    },
    de: {
      tagline: "Ein nativer Mac-Editor mit Terminal und Markdown-Vorschau.",
      description:
        "BriskEdit ist ein nativer Editor auf SwiftUI und AppKit. Mit integriertem Terminal, Markdown-Vorschau und einem Run-Knopf, der die passende Toolchain für die geöffnete Datei findet.",
      caseStudy: {
        problem: "Ich wollte einen Mac-Editor für kleine Programmieraufgaben, mit Terminal und Markdown-Vorschau direkt dabei.",
        built: "Ein nativer Editor auf TextKit 2 und AppKit mit integriertem SwiftTerm-Terminal, einem toolchain-erkennenden Run-Knopf, Markdown-Vorschau, gitignore-bewusster Suche und LSP-Vervollständigung aus den Servern, die schon auf deinem Rechner sind. Kein Electron, keine Telemetrie.",
      },
      highlights: [
        "Native Textbearbeitung mit TextKit 2 und AppKit.",
        "Ein Run-Knopf erkennt die Toolchain pro Datei (clang, swiftc, python3, node, cargo, go).",
        "Integriertes SwiftTerm-Terminal, Live-Markdown-Vorschau und gitignore-bewusste Suche im Ordner.",
        "LSP-Vervollständigung und Diagnosen aus deinen eigenen Language-Servern. Kein Extension-Marketplace, keine Telemetrie, kein Electron.",
      ],
    },
    stack: ["Swift", "SwiftUI", "AppKit"],
    repo: "jx-grxf/BriskEdit",
    githubUrl: "https://github.com/jx-grxf/BriskEdit",
    releaseUrl: "https://github.com/jx-grxf/BriskEdit/releases/tag/v0.6.2",
    fallbackVersion: "v0.6.2",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "BriskEdit-0.6.2.dmg",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.6.2/BriskEdit-0.6.2.dmg",
        size: 8775746,
        kind: "macos",
      },
      {
        assetName: "BriskEdit-0.6.2.zip",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.6.2/BriskEdit-0.6.2.zip",
        size: 7942754,
        kind: "archive",
      },
    ],
    highlights: [
      "Native text editing with TextKit 2 and AppKit.",
      "One Run button discovers the toolchain per file (clang, swiftc, python3, node, cargo, go).",
      "Integrated SwiftTerm terminal, live Markdown preview, and gitignore-aware find-in-folder.",
      "LSP completion and diagnostics from your own language servers. No marketplace, no telemetry, no Electron.",
    ],
    showcase: [
      {
        src: "/projects/briskedit/hero.webp",
        fallbackSrc: "/projects/briskedit/hero.png",
        alt: "BriskEdit editing a Swift file with the file tree, tabs, and integrated terminal",
        altDe: "BriskEdit mit Swift-Code, Dateibaum und integriertem Terminal",
        fit: "cover",
        width: 2000,
        height: 1176,
      },
      {
        src: "/projects/briskedit/briskedit-promo.mp4",
        kind: "video",
        posterSrc: "/projects/briskedit/hero.webp",
        fallbackSrc: "/projects/briskedit/hero.png",
        alt: "BriskEdit demo video showing native editing, project navigation, and the integrated terminal",
        fit: "contain",
        width: 1920,
        height: 1080,
      },
    ],
    visibility: "public",
  },
  {
    name: "Hermes-Discord-Voice",
    slug: "hermes-discord-voice",
    status: "archived",
    tagline: "Self-hosted voice for the Hermes agent, straight in a Discord call.",
    description:
      "The bot joins your Discord voice channel, captures a spoken turn, transcribes it locally with Whisper, sends the text to Hermes, and speaks the reply back through the TTS voice you pick. Personal servers only, with no hosted service in the middle.",
    caseStudy: {
      problem: "Talking to a local agent over Discord voice usually means trusting a hosted bot and giving up control of the speech pipeline.",
      built: "A self-hosted Discord.js bridge with local whisper-cli transcription, one Hermes session per guild, a per-guild speaker allowlist, and pluggable TTS: Piper, macOS say, ElevenLabs or a custom command.",
    },
    de: {
      tagline: "Self-hosted Voice für den Hermes-Agenten, direkt im Discord-Call.",
      description:
        "Der Bot tritt deinem Discord-Voice-Channel bei, nimmt einen gesprochenen Zug auf, transkribiert ihn lokal mit Whisper, schickt den Text an Hermes und spricht die Antwort über die TTS-Stimme deiner Wahl zurück. Nur für eigene Server, ohne gehosteten Dienst dazwischen.",
      caseStudy: {
        problem: "Mit einem lokalen Agenten per Discord-Voice zu reden heißt meist: einem gehosteten Bot vertrauen und die Kontrolle über die Sprach-Pipeline abgeben.",
        built: "Eine self-hosted Discord.js-Bridge mit lokaler whisper-cli-Transkription, einer Hermes-Session pro Guild, einer Sprecher-Allowlist pro Guild und austauschbarer Sprachausgabe: Piper, macOS say, ElevenLabs oder ein eigener Befehl.",
      },
      highlights: [
        "Tritt Discord-Voice bei, nimmt einen Zug auf und transkribiert ihn lokal mit whisper-cli, ohne Cloud-Spracherkennung.",
        "Leitet Transkripte standardmäßig per CLI an Hermes, oder über dessen API/Gateway.",
        "Antwortet über Piper, macOS say, ElevenLabs oder deinen eigenen TTS-Befehl.",
        "Privat per Default: eine Session pro Guild mit einer Sprecher-Allowlist, die du kontrollierst.",
      ],
    },
    stack: ["TypeScript", "Discord", "Whisper"],
    repo: "jx-grxf/Hermes-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/Hermes-Discord-Voice",
    releaseUrl: "https://github.com/jx-grxf/Hermes-Discord-Voice/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["Node.js", "Discord"],
    highlights: [
      "Joins Discord voice, records a turn, and transcribes it locally with whisper-cli, no cloud speech recognition.",
      "Routes transcripts to Hermes over CLI by default, or its API/Gateway.",
      "Replies through Piper, macOS say, ElevenLabs, or your own TTS command.",
      "Private by default: one session per guild with a speaker allowlist you control.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "poise",
    slug: "poise",
    logo: { src: "/projects/poise/logo.webp", fallbackSrc: "/projects/poise/logo.png", alt: "poise app icon", width: 256, height: 256 },
    status: "active",
    tagline: "Your AirPods as a posture coach, fully on-device.",
    description:
      "A native macOS menu bar app that reads head motion from your AirPods' built-in sensors, learns your upright baseline, and nudges you when you start to slouch. No camera, no cloud. The motion data never leaves your Mac.",
    caseStudy: {
      problem: "Posture apps usually mean a webcam watching you all day, or a wearable you have to remember to charge and put on.",
      built: "A SwiftUI menu bar app that taps the AirPods' CMHeadphoneMotionManager, calibrates an upright baseline, and watches for sustained forward tilt. Everything stays local.",
    },
    de: {
      tagline: "Deine AirPods als Haltungscoach, komplett auf dem Gerät.",
      description:
        "Eine native macOS-Menüleisten-App, die die Kopfbewegung aus den eingebauten AirPods-Sensoren liest, deine aufrechte Ausgangshaltung lernt und dich stupst, wenn du anfängst zu sacken. Keine Kamera, keine Cloud. Die Bewegungsdaten verlassen deinen Mac nie.",
      caseStudy: {
        problem: "Haltungs-Apps bedeuten meist eine Webcam, die dich den ganzen Tag beobachtet, oder ein Wearable, das man laden und anlegen muss.",
        built: "Eine SwiftUI-Menüleisten-App, die den CMHeadphoneMotionManager der AirPods anzapft, eine aufrechte Ausgangshaltung kalibriert und auf anhaltendes Nach-vorne-Kippen achtet. Alles bleibt lokal.",
      },
      highlights: [
        "Liest die Kopfbewegung direkt aus den AirPods-Sensoren über CMHeadphoneMotionManager.",
        "Kalibriert deine aufrechte Ausgangshaltung und stupst dich erst bei anhaltendem Sacken.",
        "Läuft komplett lokal: keine Kamera, kein Upload, keine Bewegungsdaten, die den Mac verlassen.",
        "Sitzt leise in der Menüleiste mit DMG-Release und Sparkle-Update-Feed.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    repo: "jx-grxf/poise",
    githubUrl: "https://github.com/jx-grxf/poise",
    releaseUrl: "https://github.com/jx-grxf/poise/releases/tag/v0.1.0",
    fallbackVersion: "v0.1.0",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "Poise-0.1.0.dmg",
        assetUrl: "https://github.com/jx-grxf/poise/releases/download/v0.1.0/Poise-0.1.0.dmg",
        size: 3178864,
        kind: "macos",
      },
      {
        assetName: "Poise-0.1.0.zip",
        assetUrl: "https://github.com/jx-grxf/poise/releases/download/v0.1.0/Poise-0.1.0.zip",
        size: 2782194,
        kind: "archive",
      },
    ],
    highlights: [
      "Reads head motion straight from the AirPods sensors via CMHeadphoneMotionManager.",
      "Calibrates your upright baseline and only nudges you on sustained slouching.",
      "Runs entirely on-device: no camera, no cloud upload, no motion data leaving the Mac.",
      "Sits quietly in the menu bar with a DMG release and Sparkle update feed.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "CSwap",
    slug: "cswap",
    logo: { src: "/projects/cswap/logo.webp", fallbackSrc: "/projects/cswap/logo.png", alt: "CSwap app icon", width: 256, height: 256 },
    status: "active",
    tagline: "Run several Claude Code accounts side by side, and move a session to another account with /swap.",
    description:
      "A macOS menu bar app and the cswap command for people with more than one Claude Code account. Every account keeps its own login and shows its live usage. When one runs out, /swap continues the same conversation on another account in the same terminal tab.",
    caseStudy: {
      problem: "Switching Claude Code accounts meant logging out and back in, and tools that swap one shared login around end up logging you out, because Claude Code's refresh tokens are single-use.",
      built: "A Swift menu bar app and CLI that give every account its own configuration folder, share settings, skills and transcripts between them, and only ever read a login, never write one.",
    },
    de: {
      tagline: "Mehrere Claude-Code-Accounts nebeneinander nutzen und eine Session per /swap auf einen anderen Account schieben.",
      description:
        "Eine macOS-Menüleisten-App mit dem Befehl cswap für alle mit mehr als einem Claude-Code-Account. Jeder Account bleibt angemeldet und zeigt seinen Verbrauch live. Ist einer leer, setzt /swap dieselbe Unterhaltung im selben Terminal-Tab mit einem anderen Account fort.",
      caseStudy: {
        problem: "Account wechseln hieß in Claude Code ab- und wieder anmelden. Tools, die einen gemeinsamen Login hin- und herkopieren, melden einen irgendwann ab, weil die Refresh-Tokens nur einmal gültig sind.",
        built: "Eine Swift-Menüleisten-App mit CLI, die jedem Account einen eigenen Konfigurationsordner gibt, Einstellungen, Skills und Transkripte zwischen ihnen teilt und einen Login nur liest, nie schreibt.",
      },
      highlights: [
        "Jeder Account läuft in seinem eigenen Claude-Code-Ordner und bleibt angemeldet, auch parallel in zwei Terminals.",
        "/swap setzt eine laufende Session mit einem anderen Account fort, auch wenn das Limit schon erreicht ist.",
        "Die Menüleiste zeigt 5-Stunden-, Wochen- und Modell-Verbrauch jedes Accounts und die laufenden Sessions.",
        "Einstellungen, Skills, Plugins, Hooks, Memory und Transkripte teilen sich alle Accounts mit ~/.claude.",
      ],
      releaseHighlights: [
        "2.0 heißt CSwap und ersetzt das Login-Tauschen durch eigene Ordner pro Account.",
        "Neuer Befehl cswap für zsh und bash, mit Setup-Assistent und /swap.",
        "Laufende Sessions in der Menüleiste, mit Verschieben auf einen anderen Account.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar", "CLI"],
    repo: "jx-grxf/cswap",
    githubUrl: "https://github.com/jx-grxf/cswap",
    releaseUrl: "https://github.com/jx-grxf/cswap/releases/tag/v2.0.0",
    fallbackVersion: "v2.0.0",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "CSwap-2.0.0.zip",
        assetUrl: "https://github.com/jx-grxf/cswap/releases/download/v2.0.0/CSwap-2.0.0.zip",
        size: 8119437,
        kind: "macos",
      },
    ],
    highlights: [
      "Every account runs in its own Claude Code folder and stays logged in, side by side in two terminals if you like.",
      "/swap continues a running session on another account, even after the current one hit its limit.",
      "The menu bar shows 5-hour, weekly and per-model usage for every account, plus its running sessions.",
      "Settings, skills, plugins, hooks, memory and transcripts are shared with ~/.claude across all accounts.",
    ],
    releaseHighlights: [
      "2.0 is renamed to CSwap and replaces login swapping with one folder per account.",
      "New cswap command for zsh and bash, with guided setup and /swap.",
      "Running sessions in the menu bar, with a button to move them to another account.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "NotchTray",
    slug: "notchtray",
    logo: { src: "/projects/notchtray/logo.webp", fallbackSrc: "/projects/notchtray/logo.png", alt: "NotchTray app icon", width: 256, height: 256 },
    status: "active",
    tagline: "Reach menu bar icons hidden behind the notch on older macOS versions.",
    description:
      "A native macOS utility that surfaces status items hidden behind the MacBook notch and shows them in a Dynamic Island-style dropdown, so overflow menu bar icons stay reachable instead of disappearing under the camera housing.",
    caseStudy: {
      problem: "On notched MacBooks, extra menu bar icons get pushed under the notch and become unclickable once the bar fills up.",
      built: "A Swift menu bar utility that detects overflow status items and presents them in a Dynamic Island-style dropdown anchored to the notch.",
    },
    de: {
      tagline: "Menüleisten-Icons hinter der MacBook-Notch auf älteren macOS-Versionen erreichen.",
      description:
        "Ein natives macOS-Tool, das hinter der MacBook-Notch versteckte Status-Items sichtbar macht und sie in einem Dropdown im Dynamic-Island-Stil zeigt. So bleiben überzählige Menüleisten-Icons erreichbar, statt unter dem Kameragehäuse zu verschwinden.",
      caseStudy: {
        problem: "Auf MacBooks mit Notch werden zusätzliche Menüleisten-Icons unter die Notch geschoben und sind nicht mehr klickbar, sobald die Leiste voll ist.",
        built: "Ein Swift-Menüleisten-Tool, das überzählige Status-Items erkennt und sie in einem an der Notch verankerten Dropdown im Dynamic-Island-Stil anzeigt.",
      },
      highlights: [
        "Erkennt Status-Items, die hinter die MacBook-Notch geschoben wurden.",
        "Zeigt sie in einem Dropdown im Dynamic-Island-Stil, verankert an der Notch.",
        "Hält überzählige Menüleisten-Icons erreichbar, ohne Apps zu entfernen.",
        "Natives Swift-Tool, seit v1.0.0 als signiertes DMG.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    repo: "jx-grxf/NotchTray",
    githubUrl: "https://github.com/jx-grxf/NotchTray",
    releaseUrl: "https://github.com/jx-grxf/NotchTray/releases/tag/v1.0.0",
    fallbackVersion: "v1.0.0",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "NotchTray-1.0.0.dmg",
        assetUrl: "https://github.com/jx-grxf/NotchTray/releases/download/v1.0.0/NotchTray-1.0.0.dmg",
        size: 1863258,
        kind: "macos",
      },
    ],
    highlights: [
      "Detects status items pushed behind the MacBook notch.",
      "Presents them in a Dynamic Island-style dropdown anchored to the notch.",
      "Keeps overflow menu bar icons reachable without removing apps.",
      "Native Swift utility, shipping as a signed DMG since v1.0.0.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "agent-presence",
    slug: "agent-presence",
    status: "active",
    tagline: "Discord Rich Presence for Claude Code and Codex. One static binary, no bot token.",
    description:
      "A small Rust tool that shows what your coding agent is doing live in your Discord status. It ships as a single static binary, needs no bot token, and shows little by default, so you decide what is visible.",
    caseStudy: {
      problem: "Showing agent activity in Discord usually means standing up a bot with a token and trusting whatever it decides to broadcast.",
      built: "A single static Rust binary that talks to Discord's local Rich Presence IPC. No bot token, no hosted service, and conservative defaults for what it shows.",
    },
    de: {
      tagline: "Discord Rich Presence für Claude Code und Codex. Ein statisches Binary, kein Bot-Token.",
      description:
        "Ein kleines Rust-Tool, das live in deinem Discord-Status zeigt, was dein Coding-Agent gerade tut. Es kommt als einzelnes statisches Binary, braucht kein Bot-Token und zeigt standardmäßig nur wenig. Was sichtbar wird, entscheidest du.",
      caseStudy: {
        problem: "Agent-Aktivität in Discord zu zeigen heißt meist: einen Bot mit Token aufsetzen und darauf vertrauen, was er broadcastet.",
        built: "Ein einzelnes statisches Rust-Binary, das mit Discords lokalem Rich-Presence-IPC spricht. Kein Bot-Token, kein gehosteter Dienst, und standardmäßig wird wenig gezeigt.",
      },
      highlights: [
        "Zeigt live in Discord, was deine Claude-Code- oder Codex-Session gerade macht.",
        "Ein einzelnes statisches Rust-Binary, kein Bot-Token, kein gehosteter Dienst.",
        "Zurückhaltende Standardwerte: du entscheidest, was im Status auftaucht.",
        "Läuft auf macOS, Windows und Linux, mit signierten Release-Artefakten.",
      ],
    },
    stack: ["Rust", "Discord", "CLI"],
    repo: "jx-grxf/agent-presence",
    githubUrl: "https://github.com/jx-grxf/agent-presence",
    releaseUrl: "https://github.com/jx-grxf/agent-presence/releases/tag/v0.3.0",
    installCommand: "brew install jx-grxf/tap/agent-presence && agent-presence",
    installCommandWindows: "scoop bucket add jx-grxf https://github.com/jx-grxf/scoop-bucket; scoop install agent-presence",
    fallbackVersion: "v0.3.0",
    fallbackDownloads: [
      {
        assetName: "agent-presence-v0.3.0-aarch64-apple-darwin.tar.gz",
        assetUrl: "https://github.com/jx-grxf/agent-presence/releases/download/v0.3.0/agent-presence-v0.3.0-aarch64-apple-darwin.tar.gz",
        size: 947663,
        kind: "macos"
      },
      {
        assetName: "agent-presence-v0.3.0-x86_64-apple-darwin.tar.gz",
        assetUrl: "https://github.com/jx-grxf/agent-presence/releases/download/v0.3.0/agent-presence-v0.3.0-x86_64-apple-darwin.tar.gz",
        size: 1006574,
        kind: "macos"
      },
      {
        assetName: "agent-presence-v0.3.0-x86_64-pc-windows-msvc.zip",
        assetUrl: "https://github.com/jx-grxf/agent-presence/releases/download/v0.3.0/agent-presence-v0.3.0-x86_64-pc-windows-msvc.zip",
        size: 910570,
        kind: "windows"
      },
      {
        assetName: "agent-presence-v0.3.0-x86_64-unknown-linux-gnu.tar.gz",
        assetUrl: "https://github.com/jx-grxf/agent-presence/releases/download/v0.3.0/agent-presence-v0.3.0-x86_64-unknown-linux-gnu.tar.gz",
        size: 1118610,
        kind: "linux"
      }
    ],
    platformLabels: ["macOS", "Windows", "Linux"],
    highlights: [
      "Shows live in Discord what your Claude Code or Codex session is doing.",
      "One static Rust binary, no bot token, no hosted service.",
      "Conservative defaults: you control what surfaces in your status.",
      "Runs on macOS, Windows, and Linux with signed release artifacts.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "claude-code-todo-fix",
    slug: "claude-code-todo-fix",
    status: "active",
    logo: { src: "/projects/claude-code-todo-fix/logo.svg", alt: "claude-code-todo-fix icon: a pixel checklist with two ticked items", width: 512, height: 512 },
    tagline: "Brings the task list back to Claude Code on newer models.",
    description:
      "Newer Claude Code releases switched the todo and task tools off on current models, so the checklist Claude used to tick off step by step is gone and Ctrl+T shows nothing. The fix sets the opt-in flag from the changelog and adds one rule to CLAUDE.md so Claude actually loads the tools. Paste one prompt into Claude Code, or run the script for macOS, Linux or Windows.",
    caseStudy: {
      problem: "Setting CLAUDE_CODE_ENABLE_TODO_TOOLS=1 only gets you halfway. The tools come back as deferred tools: Claude sees their names but not their instructions, so it rarely uses them.",
      built: "Two changes: the flag in settings.json, and a short CLAUDE.md rule that loads TaskCreate, TaskUpdate and TaskList through tool search on any job with three or more steps. The bash and PowerShell installers write identical files, back up everything they touch, keep symlinks, line endings and BOMs intact, and refuse to edit an invalid settings.json.",
    },
    de: {
      tagline: "Holt die Aufgabenliste in Claude Code auf neueren Modellen zurück.",
      description:
        "Neuere Versionen von Claude Code haben die Todo- und Task-Tools auf aktuellen Modellen abgeschaltet. Die Checkliste, die Claude Schritt für Schritt abhakt, fehlt, und Ctrl+T zeigt nichts. Der Fix setzt das Opt-in-Flag aus dem Changelog und ergänzt eine Regel in der CLAUDE.md, damit Claude die Tools auch lädt. Du fügst einen Prompt in Claude Code ein oder startest das Skript für macOS, Linux oder Windows.",
      caseStudy: {
        problem: "CLAUDE_CODE_ENABLE_TODO_TOOLS=1 allein reicht nicht. Die Tools kommen als deferred Tools zurück: Claude sieht ihre Namen, aber nicht ihre Anleitung, und benutzt sie deshalb kaum.",
        built: "Zwei Änderungen: das Flag in der settings.json und eine kurze Regel in der CLAUDE.md, die TaskCreate, TaskUpdate und TaskList bei Aufgaben ab drei Schritten über die Tool-Suche lädt. Die Installer für Bash und PowerShell schreiben identische Dateien, sichern jede Datei vorher, lassen Symlinks, Zeilenenden und BOM in Ruhe und fassen eine ungültige settings.json nicht an.",
      },
      highlights: [
        "Für Opus 5.5, Sonnet 5.5, Haiku 5.5, Opus 5, Fable und Mythos, geprüft mit Claude Code 2.1.302.",
        "Der Schnellstart ist ein Prompt zum Einfügen in Claude Code. Kein Klonen, kein Download.",
        "Die Installer kann man öfter laufen lassen: Sie schreiben nur, wenn sich etwas ändert, und sichern jede Datei mit Zeitstempel.",
        "Das README nennt auch die Kosten: rund 2k Tokens Kontext pro Session und ab und zu eine Erinnerung von Claude Code.",
      ],
    },
    stack: ["Shell", "PowerShell", "Claude Code"],
    repo: "jx-grxf/claude-code-todo-fix",
    githubUrl: "https://github.com/jx-grxf/claude-code-todo-fix",
    releaseUrl: "https://github.com/jx-grxf/claude-code-todo-fix/releases/tag/v0.2.1",
    installCommand: "git clone https://github.com/jx-grxf/claude-code-todo-fix.git && cd claude-code-todo-fix && ./install.sh",
    installCommandWindows: "git clone https://github.com/jx-grxf/claude-code-todo-fix.git; cd claude-code-todo-fix; powershell -ExecutionPolicy Bypass -File .\\install.ps1",
    fallbackVersion: "v0.2.1",
    platformLabels: ["macOS", "Linux", "Windows"],
    highlights: [
      "Covers Opus 5.5, Sonnet 5.5, Haiku 5.5, Opus 5, Fable and Mythos, checked against Claude Code 2.1.302.",
      "The quickstart is a prompt you paste into Claude Code. No clone, no download.",
      "The installers are safe to run again: they only write when something changes and back up every file with a timestamp.",
      "The README states the cost as well: about 2k tokens of context per session and an occasional reminder from Claude Code.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "DriveTech",
    slug: "beamng-drivetech",
    status: "active",
    logo: { src: "/projects/beamng-drivetech/logo.svg", alt: "DriveTech icon: a pixel rev counter with the needle near the red line", width: 512, height: 512 },
    tagline: "BMW-style driving electronics for BeamNG.drive.",
    description:
      "A BeamNG.drive mod that loads into every car and adds what a current BMW does on the road: drive profiles from ECO PRO to SPORT+, DSC, DTC and DSC OFF, xDrive, launch control, auto start-stop, auto hold and coasting. Each feature checks whether the car has the hardware for it and stays off otherwise. For the ETK 800 it adds a 330d xDrive and a 320d Touring tuned to the real cars' figures. A fan project, not affiliated with BMW or BeamNG.",
    caseStudy: {
      problem: "BeamNG simulates the drivetrain in great detail, but the stock cars drive without the electronics around it: automatics hang in gear after you lift off, there is no launch control and no proper DSC modes.",
      built: "Lua on BeamNG's vehicle extension system, one file per feature. Every feature runs isolated: if one throws, it is logged, switched off and its changes are undone while the rest keeps running. Nothing runs on AI or traffic cars, no stock file is overwritten, and 29 scenario tests run against BeamNG mocks under LuaJIT.",
    },
    de: {
      tagline: "Fahrelektronik wie bei BMW für BeamNG.drive.",
      description:
        "Eine Mod für BeamNG.drive, die sich in jedes Auto lädt und nachrüstet, was ein aktueller BMW auf der Straße macht: Fahrprofile von ECO PRO bis SPORT+, DSC, DTC und DSC OFF, xDrive, Launch Control, Start-Stopp, Auto Hold und Segeln. Jede Funktion prüft, ob das Auto die Hardware dafür hat, und bleibt sonst aus. Für den ETK 800 kommen ein 330d xDrive und ein 320d Touring dazu, abgestimmt auf die Werte der echten Autos. Ein Fanprojekt, nicht mit BMW oder BeamNG verbunden.",
      caseStudy: {
        problem: "BeamNG simuliert den Antrieb sehr genau, die Serienautos fahren aber ohne die Elektronik drumherum: Automatikgetriebe bleiben nach dem Gaswegnehmen im Gang hängen, es gibt keine Launch Control und keine richtigen DSC-Modi.",
        built: "Lua auf BeamNGs Vehicle-Extension-System, eine Datei pro Funktion. Jede Funktion läuft isoliert: Wirft eine einen Fehler, wird sie geloggt, abgeschaltet und ihre Änderungen werden zurückgenommen, der Rest läuft weiter. Auf KI- und Verkehrsautos läuft nichts, keine Originaldatei wird überschrieben, und 29 Szenario-Tests laufen gegen BeamNG-Mocks unter LuaJIT.",
      },
      highlights: [
        "Schaltlogik, die in D nach dem Gaswegnehmen hochschaltet, in SPORT den Gang hält und in der Kurve nie hochschaltet.",
        "Launch Control für Automatik, Doppelkupplung und Handschalter; beim Wandlerautomaten wird der Wandler entlastet, damit der Motor die Startdrehzahl erreicht.",
        "ETK-800-Setups mit den Übersetzungen der ZF 8HP, die Werte abgeglichen mit BMW-Pressemappe und ADAC-Katalog.",
        "Zeitmessung für 0-100, 0-200, 100-200 km/h und die Viertelmeile als UI-App im Spiel.",
      ],
    },
    stack: ["Lua", "LuaJIT", "BeamNG.drive"],
    repo: "jx-grxf/beamng-drivetech",
    githubUrl: "https://github.com/jx-grxf/beamng-drivetech",
    releaseUrl: "https://github.com/jx-grxf/beamng-drivetech/releases/tag/v1.0.0",
    fallbackVersion: "v1.0.0",
    fallbackDownload: {
      assetName: "DriveTech.zip",
      assetUrl: "https://github.com/jx-grxf/beamng-drivetech/releases/download/v1.0.0/DriveTech.zip",
      size: 27512,
      kind: "archive",
    },
    platformLabels: ["BeamNG.drive 0.39"],
    highlights: [
      "Shift logic that upshifts after you lift off in D, holds the gear in SPORT and never upshifts mid-corner.",
      "Launch control for automatic, DCT and manual; on torque converter automatics the converter is unloaded so the engine reaches launch rpm.",
      "ETK 800 setups with the ZF 8HP ratios, figures checked against the BMW press kit and the ADAC catalogue.",
      "0-100, 0-200, 100-200 km/h and quarter-mile timer as an in-game UI app.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "CCrab",
    slug: "ccrab",
    status: "experimental",
    tagline: "A small desktop companion that shows what Claude Code is doing.",
    description:
      "A native macOS desktop companion for Claude Code: a pixel crab on a floating panel that reacts to what your agent sessions are doing, plus a menu bar item with your 5-hour and weekly usage bars, every live session, and recent projects. Written in Swift against AppKit and Core Animation. No Electron, no WebView.",
    caseStudy: {
      problem: "I wanted to see when a coding agent is busy without keeping its terminal or a browser tab in front.",
      built: "Every animation is a Core Animation keyframe over layer contents, so the render server owns the timeline and the process gets no per-frame wakeups. The resting pose is parsed from vector rects into CALayers instead of decoded bitmaps, and animations are removed, not paused, the moment the panel is occluded, the display sleeps, or the screen locks.",
    },
    de: {
      tagline: "Ein kleiner Desktop-Begleiter, der zeigt, was Claude Code gerade macht.",
      description:
        "Ein nativer macOS-Desktop-Begleiter für Claude Code: eine Pixel-Krabbe auf einem schwebenden Panel, die darauf reagiert, was deine Agent-Sessions gerade tun, dazu ein Menüleisten-Eintrag mit 5-Stunden- und Wochen-Verbrauchsbalken, allen aktiven Sessions und zuletzt genutzten Projekten. In Swift mit AppKit und Core Animation geschrieben. Kein Electron, kein WebView.",
      caseStudy: {
        problem: "Ich wollte sehen, wann ein Coding-Agent arbeitet, ohne ständig das Terminal oder einen Browser-Tab im Vordergrund zu haben.",
        built: "Jede Animation ist eine Core-Animation-Keyframe-Animation über Layer-Contents, damit der Render-Server die Zeitachse besitzt und der Prozess keine Wakeups pro Frame bekommt. Die Ruhepose wird aus Vektor-Rects in CALayer geparst statt als Bitmap dekodiert, und Animationen werden entfernt statt pausiert, sobald das Panel verdeckt ist, das Display schläft oder der Bildschirm sperrt.",
      },
      highlights: [
        "Core Animation übernimmt die Animation, ohne einen eigenen Timer für jeden Frame.",
        "Menüleiste mit 5-Stunden- und Wochen-Verbrauchsbalken, Reset-Countdown und jeder aktiven Session.",
        "Status kommt über Claude-Code-Hooks an einen Loopback-Endpunkt: kein Polling, keine zusätzlichen API-Aufrufe, kein Token wird gelesen.",
        "Der Verbinden-Schritt sichert deine settings.json vorher weg und lässt fremde Hook-Einträge unangetastet.",
      ],
    },
    stack: ["Swift", "AppKit", "Core Animation"],
    repo: "jx-grxf/CCrab",
    githubUrl: "https://github.com/jx-grxf/CCrab",
    releaseUrl: "https://github.com/jx-grxf/CCrab",
    fallbackVersion: "unreleased",
    platformLabels: ["macOS 14+"],
    highlights: [
      "Core Animation handles the animation timeline, without an application timer for every frame.",
      "Menu bar with 5-hour and weekly usage bars, reset countdowns, and every live session.",
      "State arrives over Claude Code hooks on a loopback endpoint: nothing polls, no extra API calls, no token is read.",
      "Connecting backs up your settings.json first and leaves other tools' hook entries alone.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "Tools",
    slug: "tools",
    status: "active",
    tagline: "Merge, split, rotate and convert PDFs and images, entirely in your browser.",
    description:
      "A small web app that does the everyday PDF and image jobs without an upload: merge, split, extract or delete pages, rotate, PDF to images, images to PDF, and format conversion. Every file is processed in the browser, so nothing is sent anywhere and there is no size limit beyond your own memory.",
    caseStudy: {
      problem: "Free online PDF tools want an upload, which is the one thing you do not want for a contract, a payslip or a scan.",
      built: "Vite and TypeScript with no UI framework, conversions written as pure functions with no DOM access so they can be unit tested in Node, and a tool registry that makes adding a new operation a one-entry change. pdf-lib writes, pdf.js reads and renders, fflate zips, all bundled, nothing loaded from a CDN at runtime.",
    },
    de: {
      tagline: "PDFs und Bilder zusammenführen, teilen, drehen und konvertieren, komplett im Browser.",
      description:
        "Eine kleine Web-App für die alltäglichen PDF- und Bild-Aufgaben, ganz ohne Upload: zusammenführen, teilen, Seiten extrahieren oder löschen, drehen, PDF zu Bildern, Bilder zu PDF und Formatkonvertierung. Jede Datei wird im Browser verarbeitet. Es wird nichts verschickt, und es gibt kein Größenlimit außer deinem eigenen Arbeitsspeicher.",
      caseStudy: {
        problem: "Kostenlose Online-PDF-Tools wollen einen Upload, und genau das, was man bei einem Vertrag, einer Lohnabrechnung oder einem Scan nicht will.",
        built: "Vite und TypeScript ohne UI-Framework, die Konvertierungen als reine Funktionen ohne DOM-Zugriff geschrieben, damit sie in Node testbar sind, und eine Tool-Registry, in der ein neues Werkzeug ein einziger Eintrag ist. pdf-lib schreibt, pdf.js liest und rendert, fflate zippt, alles gebündelt, zur Laufzeit wird nichts von einem CDN geladen.",
      },
      highlights: [
        "Zusammenführen, teilen, Seiten extrahieren und löschen, drehen, PDF zu Bildern, Bilder zu PDF, Bildformate konvertieren.",
        "Alles läuft im Browser: keine Datei wird hochgeladen, kein Konto, kein Größenlimit außer dem Arbeitsspeicher.",
        "Ergebnisse einzeln oder als ZIP; die Grenzen (kein OCR, keine verschlüsselten PDFs) stehen offen im README.",
        "Deployment aus GitHub Actions über OIDC und SSM, ohne langlebigen AWS-Key im Repository.",
      ],
    },
    stack: ["TypeScript", "Vite", "pdf-lib"],
    repo: "jx-grxf/tools",
    githubUrl: "https://github.com/jx-grxf/tools",
    releaseUrl: "https://github.com/jx-grxf/tools",
    liveUrl: "https://tools.johannesgrof.me",
    fallbackVersion: "unreleased",
    platformLabels: ["Web"],
    highlights: [
      "Merge, split, extract and delete pages, rotate, PDF to images, images to PDF, and image format conversion.",
      "Everything runs in the browser: no upload, no account, no size limit beyond your own memory.",
      "Results download individually or as a ZIP, and the limits (no OCR, no encrypted PDFs) are stated openly in the README.",
      "Deployed from GitHub Actions over OIDC and SSM, with no long-lived AWS key in the repository.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "johannesgrof.me",
    slug: "johannesgrof-me",
    logo: { src: "/icon-512.png", alt: "johannesgrof.me icon", width: 512, height: 512 },
    status: "active",
    tagline: "This site: a portfolio that reads its own release data from GitHub.",
    description:
      "An Astro site with no client framework, where every project row pulls its version, release assets and download counts from the GitHub API at build time and a daily rebuild keeps them current. Bilingual EN/DE, static except for one contact function.",
    caseStudy: {
      problem: "A portfolio goes out of date the moment a release ships: versions, download counts and dates get typed in by hand and are quietly wrong a week later.",
      built: "A static Astro site that resolves each repository once per build and renders the numbers it gets back, with verified fallbacks for the case where GitHub is unreachable. A scheduled deploy hook rebuilds it daily; the contact form is the only server-side surface.",
    },
    de: {
      tagline: "Diese Seite: ein Portfolio, das seine eigenen Release-Daten von GitHub liest.",
      description:
        "Eine Astro-Seite ohne Client-Framework: Jede Projektzeile holt Version, Release-Assets und Download-Zahlen zur Build-Zeit aus der GitHub-API, ein täglicher Rebuild hält sie aktuell. Zweisprachig EN/DE, statisch bis auf eine Kontakt-Funktion.",
      caseStudy: {
        problem: "Ein Portfolio ist veraltet, sobald ein Release rausgeht: Versionen, Download-Zahlen und Daten werden von Hand eingetragen und stimmen eine Woche später nicht mehr.",
        built: "Eine statische Astro-Seite, die jedes Repository einmal pro Build auflöst und die Zahlen rendert, die zurückkommen, mit geprüften Fallbacks, falls GitHub nicht erreichbar ist. Ein geplanter Deploy-Hook baut täglich neu; das Kontaktformular ist die einzige serverseitige Fläche.",
      },
      highlights: [
        "GitHub-Daten zur Build-Zeit mit geprüften Fallbacks: ein gedrosselter Build degradiert, statt Falsches zu behaupten.",
        "Zweisprachig DE/EN mit hreflang auf jeder Route, inklusive aller Projektseiten.",
        "Eine einzige Serverless-Funktion für das Kontaktformular: Origin-Prüfung, IP-Ratelimit, Honeypot.",
      ],
    },
    stack: ["Astro", "TypeScript", "Vercel"],
    repo: "jx-grxf/johannesgrof.me",
    githubUrl: "https://github.com/jx-grxf/johannesgrof.me",
    releaseUrl: "https://github.com/jx-grxf/johannesgrof.me",
    fallbackVersion: "unreleased",
    platformLabels: ["Web"],
    highlights: [
      "Build-time GitHub data with verified fallbacks, so a rate-limited build degrades instead of lying.",
      "Bilingual EN/DE with hreflang alternates on every route, project pages included.",
      "One serverless function for the contact form: origin check, per-IP rate limit, honeypot.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "ÖffiGo Website",
    slug: "oeffigo-website",
    logo: { src: "/projects/oeffigo/icon.webp", fallbackSrc: "/projects/oeffigo/icon.png", alt: "ÖffiGo app icon", width: 256, height: 256 },
    status: "active",
    tagline: "The product site behind oeffigo.app, with a public data status page.",
    description:
      "The marketing and status site for ÖffiGo: what the app does, which parts are beta, and a status page that reports the state of the transport data instead of leaving it to a screenshot.",
    caseStudy: {
      problem: "A transport app that mixes official realtime, timetable data and its own beta measurements has to say which is which, and a landing page that only markets the app cannot do that.",
      built: "A product site that carries the same status discipline as the app: every capability is labelled with what it actually delivers today, and a public status page reports the data situation live.",
    },
    de: {
      tagline: "Die Produktseite hinter oeffigo.app, samt öffentlicher Datenstatus-Seite.",
      description:
        "Die Marketing- und Status-Seite für ÖffiGo: was die App kann, welche Teile Beta sind, und eine Status-Seite, die den Zustand der Verkehrsdaten meldet, statt ihn einem Screenshot zu überlassen.",
      caseStudy: {
        problem: "Eine Verkehrs-App, die offizielle Echtzeit, Fahrplandaten und eigene Beta-Messungen mischt, muss sagen, was wovon kommt, und eine Landingpage, die nur die App bewirbt, kann das nicht.",
        built: "Eine Produktseite mit derselben Status-Disziplin wie die App: Jede Fähigkeit ist damit beschriftet, was sie heute wirklich liefert, und eine öffentliche Status-Seite meldet die Datenlage live.",
      },
      highlights: [
        "Öffentliche Status-Seite für die Datenlage statt Marketing-Versprechen.",
        "Dasselbe Papier-System wie diese Seite, in ÖffiGos eigenen Farben.",
        "Zweisprachig, statisch ausgeliefert, eigene Domain.",
      ],
    },
    stack: ["Astro", "TypeScript", "Cloudflare"],
    repo: "jx-grxf/oeffigo-website",
    githubUrl: "https://github.com/jx-grxf/oeffigo-website",
    releaseUrl: "https://github.com/jx-grxf/oeffigo-website",
    liveUrl: "https://oeffigo.app",
    fallbackVersion: "unreleased",
    platformLabels: ["Web"],
    highlights: [
      "A public status page for the data situation instead of a marketing claim.",
      "The same paper system as this site, in ÖffiGo's own colours.",
      "Bilingual, statically served, on its own domain.",
    ],
    showcase: [],
    visibility: "private",
  },
];

export const projectsBySlug = new Map(featuredProjects.map((project) => [project.slug, project]));

const orderedProjects = (slugs: string[]) =>
  slugs.map((slug) => projectsBySlug.get(slug)).filter((project): project is Project => Boolean(project));

// The "highlights" group that opens the project index — the flagship projects,
// rendered as the same text rows as every other group, just first. Each project
// appears here OR in a section below, never both.
export const featuredShowcaseProjects = orderedProjects(["portpirate", "patchpilot", "briskedit", "macphone"]);

export const homepageProjects = orderedProjects(["portpirate", "briskedit", "dirhop", "cswap", "notchtray", "claude-code-todo-fix", "agent-presence", "beamng-drivetech"]);

export const projectSections: ProjectSection[] = [
  {
    eyebrow: "mac apps",
    title: "Mac apps",
    de: {
      eyebrow: "mac-apps",
      title: "Mac-Apps",
    },
    projects: orderedProjects(["bottlelite", "poise", "cswap", "notchtray", "ccrab", "slamx"]),
  },
  {
    eyebrow: "agents & tools",
    title: "Agents and developer tools",
    de: {
      eyebrow: "agents & tools",
      title: "Agent- und Entwickler-Tools",
    },
    projects: orderedProjects(["dirhop", "claude-code-todo-fix", "agent-presence", "healthkit-mcp", "hermes-discord-voice", "openclaw-discord-voice"]),
  },
  {
    eyebrow: "more",
    title: "More projects",
    de: {
      eyebrow: "mehr",
      title: "Weitere Projekte",
    },
    projects: orderedProjects(["beamng-drivetech", "caruso-reborn", "tools", "ip-multitool", "johannesgrof-me", "oeffigo-website", "docxtopdf"]),
  },
];

const uniqueProjects = (projects: Project[]) => Array.from(new Map(projects.map((project) => [project.slug, project])).values());

export const publicProjects = uniqueProjects([...featuredShowcaseProjects, ...projectSections.flatMap((section) => section.projects)]);

/** The project before and after this one in catalogue order, wrapping at both
 *  ends so a detail page always offers somewhere to go next. */
export const adjacentProjects = (slug: string): { previous?: Project; next?: Project } => {
  const index = publicProjects.findIndex((project) => project.slug === slug);

  if (index === -1 || publicProjects.length < 2) {
    return {};
  }

  return {
    previous: publicProjects[(index - 1 + publicProjects.length) % publicProjects.length],
    next: publicProjects[(index + 1) % publicProjects.length],
  };
};

export const statusClass = (status: string) => status.replaceAll(" ", "-");
