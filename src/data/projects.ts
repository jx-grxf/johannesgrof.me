export type ProjectStatus = "active" | "beta" | "experimental" | "preview" | "in development" | "coming soon" | "archived";

export interface ShowcaseImage {
  src: string;
  kind?: "image" | "video";
  cardSrc?: string;
  fallbackSrc?: string;
  posterSrc?: string;
  alt: string;
  fit?: "cover" | "contain" | "banner";
  width?: number;
  height?: number;
}

// Translatable, human-written copy. English lives on the Project directly;
// `de` carries the full German equivalent. getProjectCopy() merges them.
export interface ProjectCopy {
  tagline: string;
  description: string;
  audience: string;
  result: string;
  caseStudy: {
    problem: string;
    built: string;
    result: string;
  };
  highlights: string[];
  releaseHighlights?: string[];
  proofLabels?: string[];
}

export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
  logo?: ShowcaseImage;
  tagline: string;
  description: string;
  audience: string;
  result: string;
  caseStudy: {
    problem: string;
    built: string;
    result: string;
  };
  de?: ProjectCopy;
  stack: string[];
  featuredTier: "featured" | "project";
  repo: `jx-grxf/${string}`;
  githubUrl: string;
  releaseUrl: string;
  fallbackVersion: string;
  npmPackage?: string;
  downloadsDisabled?: boolean;
  platformLabels?: string[];
  proofLabels?: string[];
  fallbackDownload?: {
    assetName: string;
    assetUrl: string;
    size: number;
    kind: "macos" | "windows" | "archive";
  };
  fallbackDownloads?: {
    assetName: string;
    assetUrl: string;
    size: number;
    kind: "macos" | "windows" | "archive";
  }[];
  highlights: string[];
  releaseHighlights?: string[];
  showcase: ShowcaseImage[];
  visibility: "public" | "private" | "planned";
}

export const statusLabel = (status: ProjectStatus) => {
  const labels: Record<ProjectStatus, string> = {
    active: "active",
    beta: "beta release",
    experimental: "active experiment",
    preview: "shipped preview",
    "in development": "in development",
    "coming soon": "coming soon",
    archived: "archived",
  };

  return labels[status];
};

export type ProjectLang = "en" | "de";

// German status labels for the project badge.
export const statusLabelDe: Record<ProjectStatus, string> = {
  active: "aktiv",
  beta: "beta-release",
  experimental: "aktives experiment",
  preview: "preview",
  "in development": "in entwicklung",
  "coming soon": "bald verfügbar",
  archived: "archiviert",
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
    audience: project.audience,
    result: project.result,
    caseStudy: project.caseStudy,
    highlights: project.highlights,
    releaseHighlights: project.releaseHighlights,
    proofLabels: project.proofLabels,
  };
};

export interface UpcomingProject {
  name: string;
  status: ProjectStatus;
  description: string;
  de?: { description: string };
  stack: string[];
  visibility: "public" | "private" | "planned";
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
    tagline: "macOS menu bar control for local dev ports.",
    description:
      "A Swift menu bar app that maps every listening port to its process, its repository, and the AI agent that started it, so localhost stays visible and exact processes can be stopped from one native surface.",
    audience: "For Mac developers who want localhost state, runtime warnings, and safe process control without digging through terminals.",
    result: "Turns messy local server state into a visible menu bar workflow.",
    caseStudy: {
      problem: "Local development servers keep running, ports collide, and it is hard to tell which process, repository, or agent owns a given listener.",
      built: "I built a native Swift menu bar app that scans listening TCP ports, links each one to its process, repo, and agent, and gates process control behind precise actions.",
      result: "PortPirate keeps localhost state visible while staying out of the main workspace.",
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    featuredTier: "featured",
    repo: "jx-grxf/PortPirate",
    githubUrl: "https://github.com/jx-grxf/PortPirate",
    releaseUrl: "https://github.com/jx-grxf/PortPirate/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["macOS"],
    proofLabels: ["Native macOS app", "Menu bar utility"],
    highlights: [
      "Runs as a native macOS menu bar utility with a dedicated runtime browser.",
      "Maps each listening TCP port to its process, repository, and the agent that started it.",
      "Opens localhost URLs and stops exact PIDs instead of using broad process commands.",
    ],
    showcase: [
      {
        src: "/projects/portpirate/showcase.webp",
        cardSrc: "/projects/portpirate/showcase-card.webp",
        fallbackSrc: "/projects/portpirate/showcase.png",
        alt: "PortPirate menu bar runtime panel with localhost runtimes, warnings, and diagnostics",
        fit: "contain",
        width: 1600,
        height: 900,
      },
    ],
    visibility: "planned",
  },
  {
    name: "OpenClaw-Discord-Voice",
    slug: "openclaw-discord-voice",
    status: "active",
    tagline: "Talk to a local OpenClaw agent through a Discord voice channel.",
    description:
      "Join a voice channel, speak one turn, and the bridge transcribes it locally with Whisper, hands it to your local OpenClaw session, and plays the reply back. The whole pipeline stays on your machine and in view.",
    audience: "For self-hosted agent setups that want voice in Discord without handing the runtime to a hosted bot.",
    result: "Discord voice in, local OpenClaw out — Opus to Whisper to agent to speech, all self-hosted.",
    caseStudy: {
      problem: "Voice-controlling a local agent over Discord usually means a hosted bot you can't see into and don't fully control.",
      built: "A self-hosted Discord.js bridge: Opus decode, ffmpeg to WAV, local whisper-cli transcription, one session per guild, and switchable Piper, macOS say, or ElevenLabs voices.",
      result: "Speech stays on your machine, the session is yours, and every step of the pipeline is inspectable.",
    },
    de: {
      tagline: "Sprich über einen Discord-Voice-Channel mit einem lokalen OpenClaw-Agenten.",
      description:
        "Tritt einem Voice-Channel bei, sprich einen Zug, und die Bridge transkribiert ihn lokal mit Whisper, gibt ihn an deine lokale OpenClaw-Session und spielt die Antwort zurück. Die ganze Pipeline bleibt auf deinem Rechner und sichtbar.",
      audience: "Für self-hosted Agent-Setups, die Voice in Discord wollen, ohne die Runtime an einen gehosteten Bot abzugeben.",
      result: "Discord-Voice rein, lokales OpenClaw raus — Opus zu Whisper zu Agent zu Sprache, komplett self-hosted.",
      caseStudy: {
        problem: "Einen lokalen Agenten per Discord-Voice zu steuern heißt meist: ein gehosteter Bot, in den du nicht reinsiehst und den du nicht kontrollierst.",
        built: "Eine self-hosted Discord.js-Bridge: Opus-Decode, ffmpeg zu WAV, lokale whisper-cli-Transkription, eine Session pro Guild und umschaltbare Stimmen (Piper, macOS say oder ElevenLabs).",
        result: "Die Sprache bleibt auf deinem Rechner, die Session gehört dir, und jeder Schritt der Pipeline ist einsehbar.",
      },
      proofLabels: ["GitHub-Release", "TypeScript-Bridge"],
      highlights: [
        "Nimmt einen gesprochenen Zug auf und transkribiert ihn lokal mit whisper-cli — kein Cloud-STT.",
        "Verbindet direkt mit deiner lokalen OpenClaw-Session, eine pro Discord-Guild.",
        "Umschaltbare Antworten: Piper, macOS say oder ElevenLabs.",
        "Eingebaute doctor- und /info-Checks für Env, Binaries, Modellpfad und Discord-Auth.",
      ],
    },
    stack: ["TypeScript", "Discord", "Voice"],
    featuredTier: "project",
    repo: "jx-grxf/OpenClaw-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    releaseUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice/releases/tag/v1.0.4",
    fallbackVersion: "v1.0.4",
    platformLabels: ["Node.js", "Discord"],
    proofLabels: ["GitHub release", "TypeScript bridge"],
    highlights: [
      "Captures one spoken turn and transcribes it locally with whisper-cli — no cloud STT.",
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
    visibility: "public",
  },
  {
    name: "DocxToPDF",
    slug: "docxtopdf",
    status: "active",
    tagline: "Batch-convert DOCX to PDF using Word itself as the engine.",
    description:
      "A keyboard-driven macOS tool that Spotlight-searches your whole Mac for DOCX files, lets you tick the ones you want, and exports them all in one Word session — so the PDFs match Word's own output, not a parser's guess.",
    audience: "For anyone on a Mac who has to turn a pile of Word documents into faithful PDFs.",
    result: "Pick files with the keyboard, hit export, and Word renders every PDF in one pass — optionally with a searchable OCR layer.",
    caseStudy: {
      problem: "Exporting DOCX to PDF by hand is tedious, and LibreOffice or library converters quietly mangle complex Word layouts.",
      built: "A TypeScript TUI that finds DOCX via Spotlight, offers keyboard multi-select, and drives Microsoft Word over AppleScript to export in a single batch session.",
      result: "Layout fidelity stays Word-exact, and the open-export-close loop disappears.",
    },
    de: {
      tagline: "DOCX stapelweise zu PDF — mit Word selbst als Engine.",
      description:
        "Ein tastaturgesteuertes macOS-Tool, das per Spotlight den ganzen Mac nach DOCX-Dateien durchsucht, dich die gewünschten anhaken lässt und sie alle in einer Word-Session exportiert — so passen die PDFs zu Words eigener Ausgabe, nicht zum Rateversuch eines Parsers.",
      audience: "Für alle am Mac, die einen Stapel Word-Dokumente in originalgetreue PDFs verwandeln müssen.",
      result: "Dateien per Tastatur wählen, exportieren, und Word rendert jedes PDF in einem Durchgang — optional mit durchsuchbarer OCR-Schicht.",
      caseStudy: {
        problem: "DOCX von Hand zu PDF zu exportieren ist mühsam, und LibreOffice oder Library-Konverter zerschießen komplexe Word-Layouts stillschweigend.",
        built: "Ein TypeScript-TUI, das DOCX per Spotlight findet, Mehrfachauswahl per Tastatur bietet und Microsoft Word über AppleScript zum Batch-Export in einer Session steuert.",
        result: "Die Layout-Treue bleibt Word-exakt, und die Öffnen-Exportieren-Schließen-Schleife verschwindet.",
      },
      proofLabels: ["GitHub-Release", "Word-Renderer"],
      highlights: [
        "Nutzt Microsoft Word selbst als Renderer, damit die PDFs zu Words eigenem Export passen.",
        "Durchsucht den ganzen Mac per Spotlight nach DOCX, mit Dateisystem-Fallback.",
        "Mehrfachauswahl und Filter per Tastatur; eine Word-Session exportiert den ganzen Stapel.",
        "Optionale OCRmyPDF-Schicht hält die Ausgabe durchsuchbar.",
      ],
    },
    stack: ["TypeScript", "macOS", "Word"],
    featuredTier: "project",
    repo: "jx-grxf/DocxToPDF",
    githubUrl: "https://github.com/jx-grxf/DocxToPDF",
    releaseUrl: "https://github.com/jx-grxf/DocxToPDF/releases/tag/v0.1.0",
    fallbackVersion: "v0.1.0",
    platformLabels: ["macOS", "Microsoft Word"],
    proofLabels: ["GitHub release", "Word renderer"],
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
    status: "active",
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
      "T+A dropped a usable internet-radio path for older Caruso units, so this turns your computer into a local UPnP/DLNA source: search stations on your laptop, save the ones that work, and browse them again from the Caruso — plus your own music folders.",
    audience: "For owners of a first-generation T+A Caruso whose built-in radio browsing stopped being usable.",
    result: "Search and save stations from a dashboard, then browse them on the Caruso through its own UPnP tree — no new hardware.",
    caseStudy: {
      problem: "First-gen Caruso systems still sound great, but T+A no longer offers a practical native internet-radio path, so everyday station browsing is broken.",
      built: "A local Fastify and UPnP/DLNA bridge that announces itself as a media server, resolves real stream URLs from TuneIn and Radio Browser, and exposes saved stations and local music under the Caruso's own tree, with a web dashboard and a keyboard TUI control room.",
      result: "The Caruso browses and plays stations again over the still-working local path — no replacement, no cloud.",
    },
    de: {
      tagline: "Internetradio zurück auf T+A-Caruso-Systeme der ersten Generation.",
      description:
        "T+A hat den brauchbaren Internetradio-Weg für ältere Caruso-Geräte fallengelassen — also macht das hier deinen Computer zur lokalen UPnP/DLNA-Quelle: Sender am Laptop suchen, die funktionierenden speichern und am Caruso wieder durchblättern, plus deine eigenen Musikordner.",
      audience: "Für Besitzer eines T+A Caruso der ersten Generation, deren eingebautes Radio-Browsing nicht mehr brauchbar ist.",
      result: "Sender im Dashboard suchen und speichern, dann am Caruso über dessen eigenen UPnP-Baum durchblättern — ohne neue Hardware.",
      caseStudy: {
        problem: "Caruso-Systeme der ersten Generation klingen noch immer top, aber T+A bietet keinen praktikablen nativen Internetradio-Weg mehr, also ist das alltägliche Sender-Browsing kaputt.",
        built: "Eine lokale Fastify-und-UPnP/DLNA-Bridge, die sich als Media-Server ankündigt, echte Stream-URLs aus TuneIn und Radio Browser auflöst und gespeicherte Sender und lokale Musik im Caruso-eigenen Baum bereitstellt — mit Web-Dashboard und tastaturgesteuertem TUI-Kontrollraum.",
        result: "Der Caruso blättert und spielt wieder Sender über den noch funktionierenden lokalen Weg — kein Ersatz, keine Cloud.",
      },
      proofLabels: ["GitHub-Release", "Lokales Dashboard"],
      highlights: [
        "Macht deinen Mac zum UPnP/DLNA-Media-Server, den der Caruso durchblättern kann.",
        "Löst spielbare Streams aus TuneIn auf, mit Radio-Browser als Fallback.",
        "Gespeicherte Sender und lokale Musikordner erscheinen im Caruso-eigenen Baum.",
        "Web-Dashboard plus tastaturgesteuertes Kontrollraum-TUI; bindet neu, wenn du LAN/WLAN wechselst.",
      ],
    },
    stack: ["TypeScript", "UPnP", "DLNA"],
    featuredTier: "project",
    repo: "jx-grxf/Caruso-Reborn",
    githubUrl: "https://github.com/jx-grxf/Caruso-Reborn",
    releaseUrl: "https://github.com/jx-grxf/Caruso-Reborn/releases/tag/v0.2.1",
    fallbackVersion: "v0.2.1",
    platformLabels: ["Browser", "UPnP/DLNA"],
    proofLabels: ["GitHub release", "Local dashboard"],
    highlights: [
      "Turns your Mac into a UPnP/DLNA media server the Caruso can browse.",
      "Resolves playable streams from TuneIn, with a Radio Browser fallback.",
      "Saved stations and local music folders appear in the Caruso's own tree.",
      "Web dashboard plus a keyboard control-room TUI; rebinds when you switch LAN/Wi-Fi.",
    ],
    showcase: [
      {
        src: "/projects/caruso-reborn/hero.webp",
        cardSrc: "/projects/caruso-reborn/hero-card.webp",
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
    name: "PatchPilot",
    slug: "patchpilot",
    status: "beta",
    tagline: "A coding agent that shows its work — every read, command, and token, in your terminal.",
    description:
      "PatchPilot runs coding-agent tasks inside your repo and keeps the whole run in the open: the transcript, the diff it wants to write, the command it wants to run, the model it's routing to, and what the tokens cost. Risky actions wait behind an approval box. Local Ollama by default — Gemini, OpenRouter, NVIDIA, and Codex when you want them.",
    audience: "For developers who don't trust a chat box that edits their code out of sight.",
    result: "Plan read-only, approve writes one at a time, check the diff, run tests, commit yourself — the agent never gets ahead of you.",
    caseStudy: {
      problem: "Most coding agents hide the run behind a chat bubble: you can't see which files it touched, what command it's about to run, which model answered, or what it cost — so you can't trust it on a real repo.",
      built: "An Ink terminal UI with sticky approval prompts, a live transcript, per-tool permissions, a workspace boundary that blocks secret files, and one setup flow across local and cloud models.",
      result: "Powerful actions stay boring and reviewable — you see every read, write, and command before it happens, and the diff before you commit.",
    },
    de: {
      tagline: "Ein Coding-Agent, der seine Arbeit zeigt — jeder Zugriff, jeder Befehl, jedes Token, im Terminal.",
      description:
        "PatchPilot führt Agent-Aufgaben direkt in deinem Repository aus und hält den ganzen Lauf offen: das Transcript, das geplante Diff, den Befehl, das gewählte Modell und die Token-Kosten. Riskante Aktionen warten hinter einer Freigabe. Standardmäßig lokales Ollama — Gemini, OpenRouter, NVIDIA und Codex, wenn du willst.",
      audience: "Für Entwickler, die einer Chatbox nicht trauen, die ihren Code unsichtbar bearbeitet.",
      result: "Erst lesen-only planen, Schreibzugriffe einzeln freigeben, Diff prüfen, Tests laufen lassen, selbst committen — der Agent läuft dir nie voraus.",
      caseStudy: {
        problem: "Die meisten Coding-Agents verstecken den Lauf hinter einer Chat-Blase: Du siehst nicht, welche Dateien angefasst wurden, welcher Befehl gleich läuft, welches Modell geantwortet hat oder was es gekostet hat — also kannst du ihm im echten Repo nicht trauen.",
        built: "Ein Ink-Terminal-UI mit klebenden Freigaben, Live-Transcript, Tool-Berechtigungen, einer Workspace-Grenze, die Secret-Dateien blockt, und einem Setup-Flow über lokale und Cloud-Modelle.",
        result: "Mächtige Aktionen bleiben langweilig und prüfbar — du siehst jeden Lese-, Schreib- und Shell-Schritt, bevor er passiert, und das Diff, bevor du committest.",
      },
      proofLabels: ["npm-Paket", "GitHub-Release", "Agent-TUI"],
      highlights: [
        "Local-first: läuft standardmäßig auf deinem eigenen Ollama; Gemini, OpenRouter, NVIDIA und Codex sind einen Umschalter entfernt.",
        "Jeder Dateizugriff, jedes geplante Schreiben und jeder Shell-Befehl landet im Transcript, bevor er läuft.",
        "Riskante Aktionen sitzen hinter einer klebenden Freigabe; Secret-Dateien wie .env werden komplett geblockt.",
        "Live-Telemetrie zu Tokens, Cache-Treffern, Latenz und Kosten — inklusive dem, was eine kostenlose Route über die bezahlte API gekostet hätte.",
      ],
      releaseHighlights: [
        "Standardmäßiger Vollbild-Shell mit echtem scrollbarem Transcript, Command-Palette und fixiertem Composer.",
        "Kombinierbare Ultra-Modi — ultrafast, ultracheap, ultrafocus — steuern Aufwand, Tempo und Umfang direkt aus dem Prompt.",
        "Gehärtete Shell-Freigaben, Risiko-Bestätigung beim ersten Start und Windows-Pfad-Fixes.",
      ],
    },
    stack: ["TypeScript", "Ink", "AI"],
    featuredTier: "featured",
    repo: "jx-grxf/PatchPilot",
    githubUrl: "https://github.com/jx-grxf/PatchPilot",
    releaseUrl: "https://github.com/jx-grxf/PatchPilot/releases/tag/v1.2.1",
    fallbackVersion: "v1.2.1",
    npmPackage: "@jx-grxf/patchpilot",
    platformLabels: ["npm", "Terminal"],
    proofLabels: ["npm package", "GitHub release", "Agent TUI"],
    logo: {
      src: "/projects/patchpilot/logo.png",
      alt: "PatchPilot logo",
      fit: "contain",
      width: 1254,
      height: 1254,
    },
    highlights: [
      "Local-first: runs on your own Ollama by default; Gemini, OpenRouter, NVIDIA, and Codex are one switch away.",
      "Every file read, proposed write, and shell command lands in the transcript before it runs.",
      "Risky actions sit behind a sticky approval box; secret files like .env are blocked outright.",
      "Live token, cache-hit, latency, and cost telemetry — including what a free route would have cost on the paid API.",
    ],
    releaseHighlights: [
      "Default fullscreen shell with a real scrolling transcript, command palette, and pinned composer.",
      "Composable ultra modes — ultrafast, ultracheap, ultrafocus — tune effort, speed, and scope from the prompt.",
      "Hardened shell approvals, first-run risk acceptance, and Windows path fixes.",
    ],
    showcase: [
      {
        src: "/projects/patchpilot/banner.png",
        alt: "PatchPilot product banner",
        fit: "banner",
        width: 2172,
        height: 724,
      },
      {
        src: "/projects/patchpilot/hero.webp",
        fallbackSrc: "/projects/patchpilot/hero.png",
        alt: "PatchPilot TUI session",
        fit: "contain",
        width: 2856,
        height: 1904,
      },
    ],
    visibility: "public",
  },
  {
    name: "Digi2PDF",
    slug: "digi2pdf",
    status: "archived",
    tagline: "Archived and not accessible anymore due to legal matters.",
    description:
      "This project has been archived and is no longer accessible or maintained due to legal matters.",
    audience: "No public downloads, binaries, source distribution, or support are available anymore.",
    result: "Project files and release access have been removed.",
    caseStudy: {
      problem: "The project is no longer publicly accessible.",
      built: "The public project page has been reduced to an archive notice.",
      result: "Downloads, release assets, usage claims, and support messaging are no longer shown.",
    },
    stack: ["Archived"],
    featuredTier: "project",
    repo: "jx-grxf/Digi2PDF",
    githubUrl: "https://github.com/jx-grxf/Digi2PDF",
    releaseUrl: "https://github.com/jx-grxf/Digi2PDF",
    fallbackVersion: "archived",
    downloadsDisabled: true,
    highlights: [
      "Archived and not accessible anymore due to legal matters.",
      "No binaries, installers, source distribution, usage instructions, or support are provided.",
      "Previous project files should not be mirrored, repackaged, redistributed, or requested.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "SlamX",
    slug: "slamx",
    status: "active",
    logo: {
      src: "/projects/slamx/logo.webp",
      fallbackSrc: "/projects/slamx/logo.png",
      alt: "SlamX app icon",
      fit: "contain",
      width: 256,
      height: 256,
    },
    tagline: "Slap your MacBook and it knows — real accelerometer, no microphone.",
    description:
      "A native macOS toy that reads the MacBook's built-in Apple SPU accelerometer over IOKit HID, spots a sharp impact spike, counts it, and plays a sound. No mic, no fake triggers — it reacts to the actual motion sensor, with live telemetry and a calibration wizard so you can see it working.",
    audience: "For Mac people who enjoy a weird native experiment wired to real hardware.",
    result: "Reads genuine accelerometer reports, detects the spike, and gives instant sound feedback — motion data never leaves the Mac.",
    caseStudy: {
      problem: "A joke 'slap detector' is easy to fake with the microphone or a fixed trigger. Apple also gives no clean public Core Motion API for the MacBook accelerometer.",
      built: "A SwiftUI app that taps the private AppleSPUHIDDevice stream through IOKit HID, with live telemetry (impact, peak, sample rate, raw bytes), Soft/Balanced/Hard presets, a calibration wizard, and local sound feedback.",
      result: "A genuinely fun toy that's also proof it reads real device telemetry — sensor-only, with no microphone access and nothing uploaded.",
    },
    de: {
      tagline: "Hau auf dein MacBook und es merkt's — echter Beschleunigungssensor, kein Mikrofon.",
      description:
        "Ein natives macOS-Spielzeug, das den eingebauten Apple-SPU-Beschleunigungssensor des MacBooks über IOKit HID ausliest, einen scharfen Impuls erkennt, ihn zählt und einen Sound spielt. Kein Mikro, keine gefälschten Trigger — es reagiert auf den echten Bewegungssensor, mit Live-Telemetrie und Kalibrier-Assistent, damit du es arbeiten siehst.",
      audience: "Für Mac-Leute, die ein schräges natives Experiment direkt an echter Hardware mögen.",
      result: "Liest echte Sensor-Reports, erkennt den Impuls und gibt sofort Sound-Feedback — die Bewegungsdaten verlassen den Mac nie.",
      caseStudy: {
        problem: "Ein Scherz-Schlagdetektor lässt sich leicht mit dem Mikrofon oder einem festen Trigger faken. Apple bietet auch keine saubere öffentliche Core-Motion-API für den MacBook-Beschleunigungssensor.",
        built: "Eine SwiftUI-App, die den privaten AppleSPUHIDDevice-Stream über IOKit HID anzapft — mit Live-Telemetrie (Impuls, Peak, Sample-Rate, Roh-Bytes), Soft/Balanced/Hard-Presets, Kalibrier-Assistent und lokalem Sound-Feedback.",
        result: "Ein wirklich lustiges Spielzeug, das zugleich beweist, dass es echte Geräte-Telemetrie liest — nur Sensor, ohne Mikrofonzugriff und ohne Upload.",
      },
      proofLabels: ["DMG-Release", "Nur Sensor", "GitHub-Release"],
      highlights: [
        "Liest den Apple-SPU-Beschleunigungssensor des MacBooks direkt über IOKit HID.",
        "Live-Telemetrie: Impuls, Peak, Sample-Rate, Achsen, Magnitude und Roh-HID-Bytes.",
        "Nur Sensor — kein Mikrofonzugriff, kein Audio-Fallback, kein Upload.",
        "Kalibrier-Assistent, Schwellen-Presets und eigene Sounds. Für den Spaß gebaut; bitte misshandle deinen Mac nicht wirklich.",
      ],
    },
    stack: ["Swift", "macOS", "Sensors"],
    featuredTier: "project",
    repo: "jx-grxf/SlamX",
    githubUrl: "https://github.com/jx-grxf/SlamX",
    releaseUrl: "https://github.com/jx-grxf/SlamX/releases/tag/v0.3.4",
    fallbackVersion: "v0.3.4",
    platformLabels: ["macOS"],
    proofLabels: ["DMG release", "Sensor-only", "GitHub release"],
    highlights: [
      "Reads the MacBook's Apple SPU accelerometer directly over IOKit HID.",
      "Live telemetry: impact, peak, sample rate, axes, magnitude, and raw HID bytes.",
      "Sensor-only by design — no microphone access, no audio fallback, nothing uploaded.",
      "Calibration wizard, threshold presets, and your own sounds. Built for fun; please don't actually abuse your Mac.",
    ],
    showcase: [
      {
        src: "/projects/slamx/monitor-dash.webp",
        cardSrc: "/projects/slamx/monitor-dash-card.webp",
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
    tagline: "A native macOS code editor that opens before your finger leaves the trackpad.",
    description:
      "A SwiftUI and AppKit editor — not Electron — that opens instantly, stays under 120 MB idle, and runs your code from one button that figures out the toolchain itself. No tasks.json, no extension host, no second runtime.",
    audience: "For developers tired of waiting on 2 GB of RAM and an extension host just to fix one typo.",
    result: "Opens C, Swift, Python, JS/TS, Rust, or Go and runs them from a button — using the language servers already on your machine, with no marketplace.",
    caseStudy: {
      problem: "You open VS Code to fix one typo and watch 2 GB of RAM vanish, an extension host pin a core, and a folder index spin for thirty seconds before you can type.",
      built: "A native editor on TextKit 2 and AppKit with an integrated SwiftTerm terminal, a toolchain-discovering Run button, Markdown preview, gitignore-aware find, and LSP completion from the servers already on your box — no Electron, no telemetry.",
      result: "A fast native surface that leans on the tools already installed instead of a marketplace of extensions.",
    },
    de: {
      tagline: "Ein nativer macOS-Code-Editor, der offen ist, bevor dein Finger das Trackpad verlässt.",
      description:
        "Ein SwiftUI- und AppKit-Editor — kein Electron — der sofort öffnet, im Leerlauf unter 120 MB bleibt und deinen Code aus einem Knopf startet, der die Toolchain selbst findet. Kein tasks.json, kein Extension-Host, keine zweite Runtime.",
      audience: "Für Entwickler, die es satthaben, auf 2 GB RAM und einen Extension-Host zu warten, nur um einen Tippfehler zu korrigieren.",
      result: "Öffnet C, Swift, Python, JS/TS, Rust oder Go und startet sie aus einem Knopf — mit den Language-Servern, die schon auf deinem Rechner sind, ohne Marketplace.",
      caseStudy: {
        problem: "Du öffnest VS Code für einen Tippfehler und siehst zu, wie 2 GB RAM verschwinden, ein Extension-Host einen Kern auslastet und ein Ordner-Index dreißig Sekunden dreht, bevor du tippen kannst.",
        built: "Ein nativer Editor auf TextKit 2 und AppKit mit integriertem SwiftTerm-Terminal, einem toolchain-erkennenden Run-Knopf, Markdown-Vorschau, gitignore-bewusster Suche und LSP-Vervollständigung aus den Servern, die schon auf deinem Rechner sind — kein Electron, keine Telemetrie.",
        result: "Eine schnelle native Oberfläche, die sich auf die bereits installierten Tools stützt statt auf einen Marktplatz voller Erweiterungen.",
      },
      proofLabels: ["Swift 6", "SwiftUI + AppKit", "Quelloffen"],
      highlights: [
        "Öffnet eine 100-MB-Datei sofort — TextKit-2-View, kein Indexieren beim Start.",
        "Ein Run-Knopf erkennt die Toolchain pro Datei (clang, swiftc, python3, node, cargo, go).",
        "Integriertes SwiftTerm-Terminal, Live-Markdown-Vorschau und gitignore-bewusste Suche im Ordner.",
        "LSP-Vervollständigung und Diagnosen aus deinen eigenen Language-Servern — kein Extension-Marketplace, keine Telemetrie, kein Electron.",
      ],
    },
    stack: ["Swift", "SwiftUI", "AppKit"],
    featuredTier: "featured",
    repo: "jx-grxf/BriskEdit",
    githubUrl: "https://github.com/jx-grxf/BriskEdit",
    releaseUrl: "https://github.com/jx-grxf/BriskEdit/releases",
    fallbackVersion: "v0.2.0",
    platformLabels: ["macOS"],
    proofLabels: ["Swift 6", "SwiftUI + AppKit", "Source available"],
    fallbackDownloads: [
      {
        assetName: "BriskEdit-0.2.0.dmg",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.2.0/BriskEdit-0.2.0.dmg",
        size: 5568173,
        kind: "macos",
      },
      {
        assetName: "BriskEdit-0.2.0.zip",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.2.0/BriskEdit-0.2.0.zip",
        size: 5642706,
        kind: "archive",
      },
    ],
    highlights: [
      "Opens a 100 MB file instantly — TextKit 2 view, no launch-time indexing.",
      "One Run button discovers the toolchain per file (clang, swiftc, python3, node, cargo, go).",
      "Integrated SwiftTerm terminal, live Markdown preview, and gitignore-aware find-in-folder.",
      "LSP completion and diagnostics from your own language servers — no marketplace, no telemetry, no Electron.",
    ],
    showcase: [
      {
        src: "/projects/briskedit/hero.webp",
        fallbackSrc: "/projects/briskedit/hero.png",
        alt: "BriskEdit editing a Swift file with the file tree, tabs, and integrated terminal",
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
    status: "in development",
    tagline: "Self-hosted voice for the Hermes agent, straight in a Discord call.",
    description:
      "The bot joins your Discord voice channel, captures a spoken turn, transcribes it locally with Whisper, sends the text to Hermes, and speaks the reply back through the TTS voice you pick. Personal servers only — no hosted service in the middle.",
    audience: "For personal or small trusted Discord servers that want to talk to a local Hermes agent without trusting a hosted bot.",
    result: "Speak in a Discord channel, hear Hermes answer — transcription is local, sessions are per-guild, and the speaker allowlist keeps it private.",
    caseStudy: {
      problem: "Talking to a local agent over Discord voice usually means trusting a hosted bot and giving up control of the speech pipeline.",
      built: "A self-hosted Discord.js bridge with local whisper-cli transcription, one Hermes session per guild, a per-guild speaker allowlist, and pluggable TTS — Piper, macOS say, ElevenLabs, or a custom command.",
      result: "Voice input stays private and on your machine, while the Hermes transport and every step of the pipeline stay explicit.",
    },
    de: {
      tagline: "Self-hosted Voice für den Hermes-Agenten, direkt im Discord-Call.",
      description:
        "Der Bot tritt deinem Discord-Voice-Channel bei, nimmt einen gesprochenen Zug auf, transkribiert ihn lokal mit Whisper, schickt den Text an Hermes und spricht die Antwort über die TTS-Stimme deiner Wahl zurück. Nur persönliche Server — kein gehosteter Dienst dazwischen.",
      audience: "Für persönliche oder kleine vertraute Discord-Server, die mit einem lokalen Hermes-Agenten reden wollen, ohne einem gehosteten Bot zu vertrauen.",
      result: "Im Discord-Channel sprechen, Hermes antworten hören — die Transkription ist lokal, Sessions laufen pro Guild, und die Sprecher-Allowlist hält es privat.",
      caseStudy: {
        problem: "Mit einem lokalen Agenten per Discord-Voice zu reden heißt meist: einem gehosteten Bot vertrauen und die Kontrolle über die Sprach-Pipeline abgeben.",
        built: "Eine self-hosted Discord.js-Bridge mit lokaler whisper-cli-Transkription, einer Hermes-Session pro Guild, einer Sprecher-Allowlist pro Guild und steckbarem TTS — Piper, macOS say, ElevenLabs oder ein eigener Befehl.",
        result: "Die Spracheingabe bleibt privat und auf deinem Rechner, während der Hermes-Transport und jeder Schritt der Pipeline explizit bleiben.",
      },
      proofLabels: ["Lokales STT/TTS", "Self-hosted", "Quelloffen"],
      highlights: [
        "Tritt Discord-Voice bei, nimmt einen Zug auf und transkribiert ihn lokal mit whisper-cli — kein Cloud-STT.",
        "Leitet Transkripte standardmäßig per CLI an Hermes, oder über dessen API/Gateway.",
        "Antwortet über Piper, macOS say, ElevenLabs oder deinen eigenen TTS-Befehl.",
        "Privat per Default: eine Session pro Guild mit einer Sprecher-Allowlist, die du kontrollierst.",
      ],
    },
    stack: ["TypeScript", "Discord", "Whisper"],
    featuredTier: "featured",
    repo: "jx-grxf/Hermes-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/Hermes-Discord-Voice",
    releaseUrl: "https://github.com/jx-grxf/Hermes-Discord-Voice/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["Node.js", "Discord"],
    proofLabels: ["Local STT/TTS", "Self-hosted", "Source available"],
    highlights: [
      "Joins Discord voice, records a turn, and transcribes it locally with whisper-cli — no cloud STT.",
      "Routes transcripts to Hermes over CLI by default, or its API/Gateway.",
      "Replies through Piper, macOS say, ElevenLabs, or your own TTS command.",
      "Private by default: one session per guild with a speaker allowlist you control.",
    ],
    showcase: [
      {
        src: "/projects/hermes-discord-voice/banner.webp",
        fallbackSrc: "/projects/hermes-discord-voice/banner.png",
        alt: "Hermes-Voice wordmark",
        fit: "contain",
        width: 1672,
        height: 941,
      },
    ],
    visibility: "public",
  },
];

export const upcomingProjects: UpcomingProject[] = [
  {
    name: "PortPirate",
    status: "coming soon",
    description: "macOS menu bar control for local dev ports, mapping every listener to its process, repository, and the agent that started it.",
    de: {
      description: "macOS-Menüleisten-Kontrolle für lokale Dev-Ports — verknüpft jeden Listener mit seinem Prozess, Repository und dem Agenten, der ihn gestartet hat.",
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    visibility: "public",
  },
  {
    name: "TypeBot",
    status: "coming soon",
    description: "A controlled typing automation tool for predictable browser and desktop workflows.",
    de: {
      description: "Ein kontrolliertes Tipp-Automationstool für vorhersehbare Browser- und Desktop-Abläufe.",
    },
    stack: ["TypeScript", "CLI", "Automation"],
    visibility: "private",
  },
];

export const projectsBySlug = new Map(featuredProjects.map((project) => [project.slug, project]));

const orderedProjects = (slugs: string[]) =>
  slugs.map((slug) => projectsBySlug.get(slug)).filter((project): project is Project => Boolean(project));

export const featuredShowcaseProjects = orderedProjects(["hermes-discord-voice", "patchpilot", "briskedit"]);

export const standardProjects = orderedProjects([
  "slamx",
  "openclaw-discord-voice",
  "caruso-reborn",
  "digi2pdf",
  "docxtopdf",
]);

export const publicProjects = [...featuredShowcaseProjects, ...standardProjects];

export const statusClass = (status: string) => status.replaceAll(" ", "-");
