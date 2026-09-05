export type ProjectStatus = "active" | "beta" | "experimental" | "preview" | "in development" | "coming soon" | "archived";

export interface ShowcaseImage {
  src: string;
  kind?: "image" | "video";
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
  featuredTier: "featured" | "project";
  repo: `jx-grxf/${string}`;
  githubUrl: string;
  releaseUrl: string;
  /** Deployed, publicly usable version of the project, when there is one. */
  liveUrl?: string;
  fallbackVersion: string;
  npmPackage?: string;
  downloadsDisabled?: boolean;
  platformLabels?: string[];
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
    beta: "beta",
    experimental: "experimental",
    preview: "preview",
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
  beta: "beta",
  experimental: "experimentell",
  preview: "preview",
  "in development": "In Entwicklung",
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
    caseStudy: project.caseStudy,
    highlights: project.highlights,
    releaseHighlights: project.releaseHighlights,
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
    tagline: "macOS menu bar control for local dev ports.",
    description:
      "A Swift menu bar app that maps every listening port to its process, its repository, and the AI agent that started it, so localhost stays visible and exact processes can be stopped from one native surface.",
    caseStudy: {
      problem: "Local development servers keep running, ports collide, and it is hard to tell which process, repository, or agent owns a given listener.",
      built: "I built a native Swift menu bar app that scans listening TCP ports, links each one to its process, repo, and agent, and gates process control behind precise actions.",
    },
    de: {
      tagline: "Menüleisten-Steuerung für lokale Dev-Ports auf macOS.",
      description:
        "Eine Swift-Menüleisten-App, die jeden lauschenden Port seinem Prozess, seinem Repository und dem AI-Agenten zuordnet, der ihn gestartet hat — damit localhost sichtbar bleibt und einzelne Prozesse aus einer nativen Oberfläche gestoppt werden können.",
      caseStudy: {
        problem: "Lokale Dev-Server laufen weiter, Ports kollidieren, und es ist schwer zu erkennen, welchem Prozess, Repository oder Agent ein Listener gehört.",
        built: "Ich habe eine native Swift-Menüleisten-App gebaut, die lauschende TCP-Ports scannt, jeden Port seinem Prozess, Repo und Agent zuordnet und Prozesskontrolle hinter präzise Aktionen legt.",
      },
      highlights: [
        "Läuft als native macOS-Menüleisten-Utility mit eigenem Runtime-Browser.",
        "Ordnet jeden lauschenden TCP-Port seinem Prozess, Repository und dem Agenten zu, der ihn gestartet hat.",
        "Öffnet localhost-URLs und stoppt exakte PIDs statt mit groben Prozessbefehlen.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    featuredTier: "featured",
    repo: "jx-grxf/PortPirate",
    githubUrl: "https://github.com/jx-grxf/PortPirate",
    releaseUrl: "https://github.com/jx-grxf/PortPirate/releases",
    fallbackVersion: "unreleased",
    platformLabels: ["macOS"],
    highlights: [
      "Runs as a native macOS menu bar utility with a dedicated runtime browser.",
      "Maps each listening TCP port to its process, repository, and the agent that started it.",
      "Opens localhost URLs and stops exact PIDs instead of using broad process commands.",
    ],
    showcase: [
      {
        src: "/projects/portpirate/showcase.webp",
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
    name: "BottleLite",
    slug: "bottlelite",
    status: "preview",
    logo: {
      src: "/projects/bottlelite/logo.png",
      alt: "BottleLite app icon",
      fit: "contain",
      width: 1024,
      height: 1024,
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
        "BottleLite ist ein SwiftUI-Wine-Frontend für Windows-Apps auf macOS — ohne Electron, Accounts, Telemetrie oder gebündelte Runtime. Es erkennt dein vorhandenes Wine, hält Bottles persistent, importiert .exe-Dateien sauber und gibt jedem Programm Logs, Einstellungen und Stop-Kontrollen.",
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
    featuredTier: "featured",
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
    showcase: [
      {
        src: "/projects/bottlelite/logo.png",
        alt: "BottleLite app icon",
        fit: "contain",
        width: 1024,
        height: 1024,
      },
    ],
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
    tagline: "A native macOS device lab that bridges a real Bluetooth LE device into an emulator.",
    description:
      "MacPhone runs and controls many Android emulators and iOS simulators from one Mac, and bridges a real Bluetooth LE device straight into an emulator — mirroring its full GATT tree onto the emulator's virtual controller so on-device apps see the real services, characteristics, and advertisement with no dongle.",
    caseStudy: {
      problem: "The hard part of testing a hardware-talking mobile app isn't the app — it's getting a real BLE device in front of code running inside an emulator.",
      built: "A SwiftUI app that manages AVDs and Xcode simulators, connects to a physical BLE device over CoreBluetooth, mirrors its full GATT tree, and re-broadcasts it on the Android emulator's netsim controller via a Bumble virtual peripheral, forwarding reads, writes, and notifications both ways.",
    },
    de: {
      tagline: "Ein natives macOS-Device-Lab, das ein echtes Bluetooth-LE-Gerät in einen Emulator bridgt.",
      description:
        "MacPhone startet und steuert viele Android-Emulatoren und iOS-Simulatoren von einem Mac aus und bridgt ein echtes Bluetooth-LE-Gerät direkt in einen Emulator — es spiegelt den vollständigen GATT-Baum auf den virtuellen Controller des Emulators, sodass On-Device-Apps die echten Services, Characteristics und das Advertisement sehen, ganz ohne Dongle.",
      caseStudy: {
        problem: "Das Schwierige beim Testen einer hardwarenahen Mobile-App ist nicht die App — es ist, ein echtes BLE-Gerät vor Code zu bringen, der in einem Emulator läuft.",
        built: "Eine SwiftUI-App, die AVDs und Xcode-Simulatoren verwaltet, sich über CoreBluetooth mit einem physischen BLE-Gerät verbindet, dessen vollständigen GATT-Baum spiegelt und ihn über ein virtuelles Bumble-Peripheral auf dem netsim-Controller des Android-Emulators neu broadcastet — Lese-, Schreib- und Notify-Verkehr wird in beide Richtungen weitergeleitet.",
      },
      highlights: [
        "Verwaltet Android-Emulatoren (AVDs) und Xcode-iOS-Simulatoren parallel in einer Oberfläche.",
        "Bridgt ein echtes BLE-Gerät über CoreBluetooth in den Emulator und spiegelt den vollständigen GATT-Baum.",
        "Leitet Lese-/Schreibzugriffe und Notifications in beide Richtungen weiter — die App unter Test sieht die echte Hardware.",
        "Baut Sessions sauber ab: trennt abgestandene Clients und räumt das Bridge mit dem Elternprozess auf.",
      ],
    },
    stack: ["Swift", "SwiftUI", "Bluetooth LE"],
    featuredTier: "featured",
    repo: "jx-grxf/MacPhone",
    githubUrl: "https://github.com/jx-grxf/MacPhone",
    releaseUrl: "https://github.com/jx-grxf/MacPhone/releases/tag/v0.2.1",
    fallbackVersion: "v0.2.1",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "MacPhone-0.2.1.dmg",
        assetUrl: "https://github.com/jx-grxf/MacPhone/releases/download/v0.2.1/MacPhone-0.2.1.dmg",
        size: 4243692,
        kind: "macos",
      },
      {
        assetName: "MacPhone-0.2.1.zip",
        assetUrl: "https://github.com/jx-grxf/MacPhone/releases/download/v0.2.1/MacPhone-0.2.1.zip",
        size: 4294532,
        kind: "archive",
      },
    ],
    highlights: [
      "Manages Android emulators (AVDs) and Xcode iOS simulators in parallel from one panel.",
      "Bridges a real BLE device into the emulator over CoreBluetooth, mirroring the full GATT tree.",
      "Forwards reads, writes, and notifications both ways — the app under test sees the real hardware.",
      "Keeps sessions clean: disconnects stale clients and tears the bridge down with its parent process.",
    ],
    showcase: [
      {
        src: "/projects/macphone/overview.webp",
        fallbackSrc: "/projects/macphone/overview.png",
        alt: "MacPhone overview dashboard listing connected Android emulators and iOS simulators",
        fit: "cover",
        width: 2000,
        height: 1450,
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
    releaseUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    fallbackVersion: "archived",
    downloadsDisabled: true,
    platformLabels: ["Node.js", "Discord"],
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
    visibility: "private",
  },
  {
    name: "HealthKit-MCP",
    slug: "healthkit-mcp",
    status: "experimental",
    tagline: "Read-only Apple Health context for MCP-capable agents.",
    description:
      "A privacy-first bridge that syncs Apple Health aggregates from an iPhone app into a scoped backend and exposes sleep, workouts, training load, and trends through a read-only Model Context Protocol server.",
    caseStudy: {
      problem: "Apple Health has rich personal context, but there is no normal server API an agent can read from safely.",
      built: "A TypeScript MCP server, Supabase schema, and iOS HealthKit sync plan that move aggregate summaries instead of raw health samples.",
    },
    de: {
      tagline: "Read-only Apple-Health-Kontext für MCP-fähige Agents.",
      description:
        "Eine privacy-first Bridge, die Apple-Health-Aggregate aus einer iPhone-App in ein abgegrenztes Backend synchronisiert und Schlaf, Workouts, Trainingslast und Trends über einen read-only Model-Context-Protocol-Server verfügbar macht.",
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
    featuredTier: "project",
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
    visibility: "public",
  },
  {
    name: "DocxToPDF",
    slug: "docxtopdf",
    status: "archived",
    tagline: "Batch-convert DOCX to PDF using Word itself as the engine.",
    description:
      "A keyboard-driven macOS tool that Spotlight-searches your whole Mac for DOCX files, lets you tick the ones you want, and exports them all in one Word session — so the PDFs match Word's own output, not a parser's guess.",
    caseStudy: {
      problem: "Exporting DOCX to PDF by hand is tedious, and LibreOffice or library converters quietly mangle complex Word layouts.",
      built: "A TypeScript TUI that finds DOCX via Spotlight, offers keyboard multi-select, and drives Microsoft Word over AppleScript to export in a single batch session.",
    },
    de: {
      tagline: "DOCX stapelweise zu PDF — mit Word selbst als Engine.",
      description:
        "Ein tastaturgesteuertes macOS-Tool, das per Spotlight den ganzen Mac nach DOCX-Dateien durchsucht, dich die gewünschten anhaken lässt und sie alle in einer Word-Session exportiert — so passen die PDFs zu Words eigener Ausgabe, nicht zum Rateversuch eines Parsers.",
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
    featuredTier: "project",
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
    caseStudy: {
      problem: "First-gen Caruso systems still sound great, but T+A no longer offers a practical native internet-radio path, so everyday station browsing is broken.",
      built: "A local Fastify and UPnP/DLNA bridge that announces itself as a media server, resolves real stream URLs from TuneIn and Radio Browser, and exposes saved stations and local music under the Caruso's own tree, with a web dashboard and a keyboard TUI control room.",
    },
    de: {
      tagline: "Internetradio zurück auf T+A-Caruso-Systeme der ersten Generation.",
      description:
        "T+A hat den brauchbaren Internetradio-Weg für ältere Caruso-Geräte fallengelassen — also macht das hier deinen Computer zur lokalen UPnP/DLNA-Quelle: Sender am Laptop suchen, die funktionierenden speichern und am Caruso wieder durchblättern, plus deine eigenen Musikordner.",
      caseStudy: {
        problem: "Caruso-Systeme der ersten Generation klingen noch immer top, aber T+A bietet keinen praktikablen nativen Internetradio-Weg mehr, also ist das alltägliche Sender-Browsing kaputt.",
        built: "Eine lokale Fastify-und-UPnP/DLNA-Bridge, die sich als Media-Server ankündigt, echte Stream-URLs aus TuneIn und Radio Browser auflöst und gespeicherte Sender und lokale Musik im Caruso-eigenen Baum bereitstellt — mit Web-Dashboard und tastaturgesteuertem TUI-Kontrollraum.",
      },
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
    featuredTier: "project",
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
    tagline: "A coding agent that shows its work — every read, command, and token, in your terminal.",
    description:
      "PatchPilot runs coding-agent tasks inside your repo and keeps the whole run in the open: the transcript, the diff it wants to write, the command it wants to run, the model it's routing to, and what the tokens cost. Risky actions wait behind an approval box. Local Ollama by default — Gemini, OpenRouter, NVIDIA, and Codex when you want them.",
    caseStudy: {
      problem: "Most coding agents hide the run behind a chat bubble: you can't see which files it touched, what command it's about to run, which model answered, or what it cost — so you can't trust it on a real repo.",
      built: "An Ink terminal UI with sticky approval prompts, a live transcript, per-tool permissions, a workspace boundary that blocks secret files, and one setup flow across local and cloud models.",
    },
    de: {
      tagline: "Ein Coding-Agent, der seine Arbeit zeigt — jeder Zugriff, jeder Befehl, jedes Token, im Terminal.",
      description:
        "PatchPilot führt Agent-Aufgaben direkt in deinem Repository aus und hält den ganzen Lauf offen: das Transcript, das geplante Diff, den Befehl, das gewählte Modell und die Token-Kosten. Riskante Aktionen warten hinter einer Freigabe. Standardmäßig lokales Ollama — Gemini, OpenRouter, NVIDIA und Codex, wenn du willst.",
      caseStudy: {
        problem: "Die meisten Coding-Agents verstecken den Lauf hinter einer Chat-Blase: Du siehst nicht, welche Dateien angefasst wurden, welcher Befehl gleich läuft, welches Modell geantwortet hat oder was es gekostet hat — also kannst du ihm im echten Repo nicht trauen.",
        built: "Ein Ink-Terminal-UI mit klebenden Freigaben, Live-Transcript, Tool-Berechtigungen, einer Workspace-Grenze, die Secret-Dateien blockt, und einem Setup-Flow über lokale und Cloud-Modelle.",
      },
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
    releaseUrl: "https://github.com/jx-grxf/PatchPilot/releases/tag/v1.2.2",
    fallbackVersion: "v1.2.2",
    npmPackage: "@jx-grxf/patchpilot",
    platformLabels: ["npm", "Terminal"],
    logo: {
      src: "/projects/patchpilot/logo.webp",
      fallbackSrc: "/projects/patchpilot/logo.png",
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
        src: "/projects/patchpilot/banner.webp",
        fallbackSrc: "/projects/patchpilot/banner.png",
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
    tagline: "Slap your MacBook and it knows — real accelerometer, no microphone.",
    description:
      "A native macOS toy that reads the MacBook's built-in Apple SPU accelerometer over IOKit HID, spots a sharp impact spike, counts it, and plays a sound. No mic, no fake triggers — it reacts to the actual motion sensor, with live telemetry and a calibration wizard so you can see it working.",
    caseStudy: {
      problem: "A joke 'slap detector' is easy to fake with the microphone or a fixed trigger. Apple also gives no clean public Core Motion API for the MacBook accelerometer.",
      built: "A SwiftUI app that taps the private AppleSPUHIDDevice stream through IOKit HID, with live telemetry (impact, peak, sample rate, raw bytes), Soft/Balanced/Hard presets, a calibration wizard, and local sound feedback.",
    },
    de: {
      tagline: "Hau auf dein MacBook und es merkt's — echter Beschleunigungssensor, kein Mikrofon.",
      description:
        "Ein natives macOS-Spielzeug, das den eingebauten Apple-SPU-Beschleunigungssensor des MacBooks über IOKit HID ausliest, einen scharfen Impuls erkennt, ihn zählt und einen Sound spielt. Kein Mikro, keine gefälschten Trigger — es reagiert auf den echten Bewegungssensor, mit Live-Telemetrie und Kalibrier-Assistent, damit du es arbeiten siehst.",
      caseStudy: {
        problem: "Ein Scherz-Schlagdetektor lässt sich leicht mit dem Mikrofon oder einem festen Trigger faken. Apple bietet auch keine saubere öffentliche Core-Motion-API für den MacBook-Beschleunigungssensor.",
        built: "Eine SwiftUI-App, die den privaten AppleSPUHIDDevice-Stream über IOKit HID anzapft — mit Live-Telemetrie (Impuls, Peak, Sample-Rate, Roh-Bytes), Soft/Balanced/Hard-Presets, Kalibrier-Assistent und lokalem Sound-Feedback.",
      },
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
    releaseUrl: "https://github.com/jx-grxf/SlamX/releases/tag/v0.3.5",
    fallbackVersion: "v0.3.5",
    platformLabels: ["macOS"],
    highlights: [
      "Reads the MacBook's Apple SPU accelerometer directly over IOKit HID.",
      "Live telemetry: impact, peak, sample rate, axes, magnitude, and raw HID bytes.",
      "Sensor-only by design — no microphone access, no audio fallback, nothing uploaded.",
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
    tagline: "A native macOS code editor that opens instantly, without the Electron bloat.",
    description:
      "A SwiftUI and AppKit editor — not Electron — that opens instantly, stays under 120 MB idle, and runs your code from one button that figures out the toolchain itself. No tasks.json, no extension host, no second runtime.",
    caseStudy: {
      problem: "You open VS Code to fix one typo and watch 2 GB of RAM vanish, an extension host pin a core, and a folder index spin for thirty seconds before you can type.",
      built: "A native editor on TextKit 2 and AppKit with an integrated SwiftTerm terminal, a toolchain-discovering Run button, Markdown preview, gitignore-aware find, and LSP completion from the servers already on your box — no Electron, no telemetry.",
    },
    de: {
      tagline: "Ein nativer macOS-Editor, der sofort startet, ohne den Electron-Ballast.",
      description:
        "Ein SwiftUI- und AppKit-Editor — kein Electron — der sofort öffnet, im Leerlauf unter 120 MB bleibt und deinen Code aus einem Knopf startet, der die Toolchain selbst findet. Kein tasks.json, kein Extension-Host, keine zweite Runtime.",
      caseStudy: {
        problem: "Du öffnest VS Code für einen Tippfehler und siehst zu, wie 2 GB RAM verschwinden, ein Extension-Host einen Kern auslastet und ein Ordner-Index dreißig Sekunden dreht, bevor du tippen kannst.",
        built: "Ein nativer Editor auf TextKit 2 und AppKit mit integriertem SwiftTerm-Terminal, einem toolchain-erkennenden Run-Knopf, Markdown-Vorschau, gitignore-bewusster Suche und LSP-Vervollständigung aus den Servern, die schon auf deinem Rechner sind — kein Electron, keine Telemetrie.",
      },
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
    releaseUrl: "https://github.com/jx-grxf/BriskEdit/releases/tag/v0.5.2",
    fallbackVersion: "v0.5.2",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "BriskEdit-0.5.2.dmg",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.5.2/BriskEdit-0.5.2.dmg",
        size: 8339840,
        kind: "macos",
      },
      {
        assetName: "BriskEdit-0.5.2.zip",
        assetUrl: "https://github.com/jx-grxf/BriskEdit/releases/download/v0.5.2/BriskEdit-0.5.2.zip",
        size: 8423038,
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
    status: "archived",
    tagline: "Self-hosted voice for the Hermes agent, straight in a Discord call.",
    description:
      "The bot joins your Discord voice channel, captures a spoken turn, transcribes it locally with Whisper, sends the text to Hermes, and speaks the reply back through the TTS voice you pick. Personal servers only — no hosted service in the middle.",
    caseStudy: {
      problem: "Talking to a local agent over Discord voice usually means trusting a hosted bot and giving up control of the speech pipeline.",
      built: "A self-hosted Discord.js bridge with local whisper-cli transcription, one Hermes session per guild, a per-guild speaker allowlist, and pluggable TTS — Piper, macOS say, ElevenLabs, or a custom command.",
    },
    de: {
      tagline: "Self-hosted Voice für den Hermes-Agenten, direkt im Discord-Call.",
      description:
        "Der Bot tritt deinem Discord-Voice-Channel bei, nimmt einen gesprochenen Zug auf, transkribiert ihn lokal mit Whisper, schickt den Text an Hermes und spricht die Antwort über die TTS-Stimme deiner Wahl zurück. Nur persönliche Server — kein gehosteter Dienst dazwischen.",
      caseStudy: {
        problem: "Mit einem lokalen Agenten per Discord-Voice zu reden heißt meist: einem gehosteten Bot vertrauen und die Kontrolle über die Sprach-Pipeline abgeben.",
        built: "Eine self-hosted Discord.js-Bridge mit lokaler whisper-cli-Transkription, einer Hermes-Session pro Guild, einer Sprecher-Allowlist pro Guild und steckbarem TTS — Piper, macOS say, ElevenLabs oder ein eigener Befehl.",
      },
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
  {
    name: "poise",
    slug: "poise",
    status: "active",
    tagline: "Turn your AirPods into a posture coach — fully on-device.",
    description:
      "A native macOS menu bar app that reads head motion from your AirPods' built-in sensors, learns your upright baseline, and nudges you when you start to slouch. No camera, no cloud — the motion data never leaves your Mac.",
    caseStudy: {
      problem: "Posture apps usually mean a webcam watching you all day, or a wearable you have to remember to charge and put on.",
      built: "A SwiftUI menu bar app that taps the AirPods' CMHeadphoneMotionManager, calibrates an upright baseline, and watches for sustained forward tilt — everything stays local.",
    },
    de: {
      tagline: "Mach deine AirPods zum Haltungscoach — komplett on-device.",
      description:
        "Eine native macOS-Menüleisten-App, die die Kopfbewegung aus den eingebauten AirPods-Sensoren liest, deine aufrechte Ausgangshaltung lernt und dich stupst, wenn du anfängst zu sacken. Keine Kamera, keine Cloud — die Bewegungsdaten verlassen deinen Mac nie.",
      caseStudy: {
        problem: "Haltungs-Apps bedeuten meist eine Webcam, die dich den ganzen Tag beobachtet, oder ein Wearable, das man laden und anlegen muss.",
        built: "Eine SwiftUI-Menüleisten-App, die den CMHeadphoneMotionManager der AirPods anzapft, eine aufrechte Ausgangshaltung kalibriert und auf anhaltendes Nach-vorne-Kippen achtet — alles bleibt lokal.",
      },
      highlights: [
        "Liest die Kopfbewegung direkt aus den AirPods-Sensoren über CMHeadphoneMotionManager.",
        "Kalibriert deine aufrechte Ausgangshaltung und stupst dich erst bei anhaltendem Sacken.",
        "Läuft komplett lokal — keine Kamera, kein Cloud-Upload, keine Bewegungsdaten, die den Mac verlassen.",
        "Sitzt leise in der Menüleiste mit DMG-Release und Sparkle-Update-Feed.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    featuredTier: "project",
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
      "Runs entirely on-device — no camera, no cloud upload, no motion data leaving the Mac.",
      "Sits quietly in the menu bar with a DMG release and Sparkle update feed.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "claude-swap-bar",
    slug: "claude-swap-bar",
    status: "active",
    tagline: "Switch between Claude Code accounts from the menu bar, with live usage meters.",
    description:
      "A native macOS menu bar app for anyone running more than one Claude Code account. Swap the active account in one click and watch live usage meters for each, so you can see what's left before you hit a limit.",
    caseStudy: {
      problem: "Running multiple Claude Code accounts means manual re-auth and no visibility into how much of each plan you've used.",
      built: "A SwiftUI menu bar app that stores and switches between accounts and surfaces live per-account usage meters right in the dropdown.",
    },
    de: {
      tagline: "Zwischen Claude-Code-Accounts aus der Menüleiste wechseln — mit Live-Verbrauchsanzeigen.",
      description:
        "Eine native macOS-Menüleisten-App für alle, die mehr als einen Claude-Code-Account nutzen. Wechsle den aktiven Account mit einem Klick und behalte die Live-Verbrauchsanzeigen jedes Accounts im Blick, damit du siehst, was noch übrig ist, bevor du an ein Limit stößt.",
      caseStudy: {
        problem: "Mehrere Claude-Code-Accounts zu nutzen heißt manuelles Neu-Anmelden und keine Sicht darauf, wie viel von jedem Plan schon verbraucht ist.",
        built: "Eine SwiftUI-Menüleisten-App, die Accounts speichert und umschaltet und die Live-Verbrauchsanzeigen pro Account direkt im Dropdown zeigt.",
      },
      highlights: [
        "Wechselt den aktiven Claude-Code-Account mit einem Klick aus der Menüleiste.",
        "Zeigt Live-Verbrauchsanzeigen pro Account direkt im Dropdown.",
        "Speichert mehrere Accounts, damit blindes Neu-Anmelden entfällt.",
        "Native SwiftUI-App mit GitHub-Release und Sparkle-Update-Feed.",
      ],
    },
    stack: ["Swift", "macOS", "Menu Bar"],
    featuredTier: "project",
    repo: "jx-grxf/claude-swap-bar",
    githubUrl: "https://github.com/jx-grxf/claude-swap-bar",
    releaseUrl: "https://github.com/jx-grxf/claude-swap-bar/releases/tag/v1.1.1",
    fallbackVersion: "v1.1.1",
    platformLabels: ["macOS"],
    fallbackDownloads: [
      {
        assetName: "ClaudeSwapBar-1.1.1.zip",
        assetUrl: "https://github.com/jx-grxf/claude-swap-bar/releases/download/v1.1.1/ClaudeSwapBar-1.1.1.zip",
        size: 7771449,
        kind: "macos",
      },
    ],
    highlights: [
      "Switches the active Claude Code account in one click from the menu bar.",
      "Shows live per-account usage meters right in the dropdown.",
      "Stores multiple accounts so re-authenticating blind is a thing of the past.",
      "Native SwiftUI app with a GitHub release and Sparkle update feed.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "NotchTray",
    slug: "notchtray",
    status: "active",
    tagline: "Recover the menu bar icons the MacBook notch swallows.",
    description:
      "A native macOS utility that surfaces status items hidden behind the MacBook notch and shows them in a Dynamic Island-style dropdown, so overflow menu bar icons stay reachable instead of disappearing under the camera housing.",
    caseStudy: {
      problem: "On notched MacBooks, extra menu bar icons get pushed under the notch and become unclickable once the bar fills up.",
      built: "A Swift menu bar utility that detects overflow status items and presents them in a Dynamic Island-style dropdown anchored to the notch.",
    },
    de: {
      tagline: "Hol dir die Menüleisten-Icons zurück, die die MacBook-Notch verschluckt.",
      description:
        "Ein natives macOS-Tool, das hinter der MacBook-Notch versteckte Status-Items sichtbar macht und sie in einem Dropdown im Dynamic-Island-Stil zeigt — damit überzählige Menüleisten-Icons erreichbar bleiben, statt unter dem Kameragehäuse zu verschwinden.",
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
    featuredTier: "project",
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
    tagline: "Discord Rich Presence for Claude Code and Codex — one static binary, no bot token.",
    description:
      "A small Rust tool that shows what your coding agent is doing live in your Discord status. It ships as a single static binary, needs no bot token, and ships privacy-safe defaults so you control exactly what's shown.",
    caseStudy: {
      problem: "Showing agent activity in Discord usually means standing up a bot with a token and trusting whatever it decides to broadcast.",
      built: "A single static Rust binary that talks to Discord's local Rich Presence IPC — no bot token, no hosted service, and privacy-safe defaults on what it reveals.",
    },
    de: {
      tagline: "Discord Rich Presence für Claude Code und Codex — ein statisches Binary, kein Bot-Token.",
      description:
        "Ein kleines Rust-Tool, das live in deinem Discord-Status zeigt, was dein Coding-Agent gerade tut. Es kommt als einzelnes statisches Binary, braucht kein Bot-Token und bringt privacy-sichere Defaults mit, damit du genau steuerst, was gezeigt wird.",
      caseStudy: {
        problem: "Agent-Aktivität in Discord zu zeigen heißt meist: einen Bot mit Token aufsetzen und darauf vertrauen, was er broadcastet.",
        built: "Ein einzelnes statisches Rust-Binary, das mit Discords lokalem Rich-Presence-IPC spricht — kein Bot-Token, kein gehosteter Dienst und privacy-sichere Defaults dazu, was es zeigt.",
      },
      highlights: [
        "Zeigt live in Discord, was deine Claude-Code- oder Codex-Session gerade macht.",
        "Ein einzelnes statisches Rust-Binary — kein Bot-Token, kein gehosteter Dienst.",
        "Privacy-sichere Defaults: du steuerst, was im Status auftaucht.",
        "Läuft auf macOS, Windows und Linux, mit signierten Release-Artefakten.",
      ],
    },
    stack: ["Rust", "Discord", "CLI"],
    featuredTier: "project",
    repo: "jx-grxf/agent-presence",
    githubUrl: "https://github.com/jx-grxf/agent-presence",
    releaseUrl: "https://github.com/jx-grxf/agent-presence/releases/tag/v0.2.3",
    fallbackVersion: "v0.2.3",
    platformLabels: ["macOS", "Windows", "Linux"],
    highlights: [
      "Shows live in Discord what your Claude Code or Codex session is doing.",
      "One static Rust binary — no bot token, no hosted service.",
      "Privacy-safe defaults: you control what surfaces in your status.",
      "Runs on macOS, Windows, and Linux with signed release artifacts.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "CCrab",
    slug: "ccrab",
    status: "experimental",
    tagline: "A desktop companion for Claude Code that costs zero idle CPU.",
    description:
      "A native macOS desktop companion for Claude Code: a pixel crab on a floating panel that reacts to what your agent sessions are doing, plus a menu bar item with your 5-hour and weekly usage bars, every live session, and recent projects. Written in Swift against AppKit and Core Animation — no Electron, no WebView.",
    caseStudy: {
      problem: "Ambient status for a coding agent normally means either a browser tab or an Electron app, and both burn CPU permanently for a widget you only glance at.",
      built: "Every animation is a Core Animation keyframe over layer contents, so the render server owns the timeline and the process gets no per-frame wakeups. The resting pose is parsed from vector rects into CALayers instead of decoded bitmaps, and animations are removed — not paused — the moment the panel is occluded, the display sleeps, or the screen locks.",
    },
    de: {
      tagline: "Ein Desktop-Begleiter für Claude Code, der im Leerlauf null CPU kostet.",
      description:
        "Ein nativer macOS-Desktop-Begleiter für Claude Code: eine Pixel-Krabbe auf einem schwebenden Panel, die darauf reagiert, was deine Agent-Sessions gerade tun — dazu ein Menüleisten-Item mit 5-Stunden- und Wochen-Verbrauchsbalken, allen aktiven Sessions und zuletzt genutzten Projekten. In Swift gegen AppKit und Core Animation geschrieben — kein Electron, kein WebView.",
      caseStudy: {
        problem: "Ambienter Status für einen Coding-Agenten heißt sonst Browser-Tab oder Electron-App — beide verbrennen dauerhaft CPU für ein Widget, auf das man nur kurz schaut.",
        built: "Jede Animation ist eine Core-Animation-Keyframe-Animation über Layer-Contents, damit der Render-Server die Zeitachse besitzt und der Prozess keine Wakeups pro Frame bekommt. Die Ruhepose wird aus Vektor-Rects in CALayer geparst statt als Bitmap dekodiert, und Animationen werden entfernt — nicht pausiert —, sobald das Panel verdeckt ist, das Display schläft oder der Bildschirm sperrt.",
      },
      highlights: [
        "0,0 % CPU im Leerlauf und während der Animation — Core Animation besitzt die Zeitachse, kein Timer, kein Draw-Loop.",
        "Menüleiste mit 5-Stunden- und Wochen-Verbrauchsbalken, Reset-Countdown und jeder aktiven Session.",
        "Status kommt über Claude-Code-Hooks an einen Loopback-Endpunkt — kein Polling, keine zusätzlichen API-Aufrufe, kein Token wird gelesen.",
        "Der Verbinden-Schritt sichert deine settings.json vorher weg und lässt fremde Hook-Einträge unangetastet.",
      ],
    },
    stack: ["Swift", "AppKit", "Core Animation"],
    featuredTier: "project",
    repo: "jx-grxf/CCrab",
    githubUrl: "https://github.com/jx-grxf/CCrab",
    releaseUrl: "https://github.com/jx-grxf/CCrab",
    fallbackVersion: "unreleased",
    platformLabels: ["macOS 14+"],
    highlights: [
      "0.0% CPU idle and while animating — Core Animation owns the timeline, so there is no timer and no draw loop.",
      "Menu bar with 5-hour and weekly usage bars, reset countdowns, and every live session.",
      "State arrives over Claude Code hooks on a loopback endpoint — nothing polls, no extra API calls, no token is read.",
      "Connecting backs up your settings.json first and leaves other tools' hook entries alone.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "Tools",
    slug: "tools",
    status: "active",
    tagline: "Merge, split, rotate and convert PDFs and images — entirely in your browser.",
    description:
      "A small web app that does the everyday PDF and image jobs without an upload: merge, split, extract or delete pages, rotate, PDF to images, images to PDF, and format conversion. Every file is processed in the browser, so nothing is sent anywhere and there is no size limit beyond your own memory.",
    caseStudy: {
      problem: "Free online PDF tools want an upload, which is the one thing you do not want for a contract, a payslip or a scan.",
      built: "Vite and TypeScript with no UI framework, conversions written as pure functions with no DOM access so they can be unit tested in Node, and a tool registry that makes adding a new operation a one-entry change. pdf-lib writes, pdf.js reads and renders, fflate zips — all bundled, nothing loaded from a CDN at runtime.",
    },
    de: {
      tagline: "PDFs und Bilder zusammenführen, teilen, drehen und konvertieren — komplett im Browser.",
      description:
        "Eine kleine Web-App für die alltäglichen PDF- und Bild-Aufgaben, ganz ohne Upload: zusammenführen, teilen, Seiten extrahieren oder löschen, drehen, PDF zu Bildern, Bilder zu PDF und Formatkonvertierung. Jede Datei wird im Browser verarbeitet — es wird nichts verschickt, und es gibt kein Größenlimit außer deinem eigenen Arbeitsspeicher.",
      caseStudy: {
        problem: "Kostenlose Online-PDF-Tools wollen einen Upload — genau das, was man bei einem Vertrag, einer Lohnabrechnung oder einem Scan nicht will.",
        built: "Vite und TypeScript ohne UI-Framework, die Konvertierungen als reine Funktionen ohne DOM-Zugriff geschrieben, damit sie in Node testbar sind, und eine Tool-Registry, in der ein neues Werkzeug ein einziger Eintrag ist. pdf-lib schreibt, pdf.js liest und rendert, fflate zippt — alles gebündelt, zur Laufzeit wird nichts von einem CDN geladen.",
      },
      highlights: [
        "Zusammenführen, teilen, Seiten extrahieren und löschen, drehen, PDF zu Bildern, Bilder zu PDF, Bildformate konvertieren.",
        "Alles läuft im Browser — keine Datei wird hochgeladen, kein Konto, kein Größenlimit außer dem Arbeitsspeicher.",
        "Ergebnisse einzeln oder als ZIP; die Grenzen (kein OCR, keine verschlüsselten PDFs) stehen offen im README.",
        "Deployment aus GitHub Actions über OIDC und SSM, ohne langlebigen AWS-Key im Repository.",
      ],
    },
    stack: ["TypeScript", "Vite", "pdf-lib"],
    featuredTier: "project",
    repo: "jx-grxf/tools",
    githubUrl: "https://github.com/jx-grxf/tools",
    releaseUrl: "https://github.com/jx-grxf/tools",
    liveUrl: "https://tools.johannesgrof.me",
    fallbackVersion: "unreleased",
    platformLabels: ["Web"],
    highlights: [
      "Merge, split, extract and delete pages, rotate, PDF to images, images to PDF, and image format conversion.",
      "Everything runs in the browser — no upload, no account, no size limit beyond your own memory.",
      "Results download individually or as a ZIP, and the limits (no OCR, no encrypted PDFs) are stated openly in the README.",
      "Deployed from GitHub Actions over OIDC and SSM, with no long-lived AWS key in the repository.",
    ],
    showcase: [],
    visibility: "public",
  },
  {
    name: "johannesgrof.me",
    slug: "johannesgrof-me",
    status: "active",
    tagline: "This site — a portfolio that reads its own release data.",
    description:
      "An Astro site with no client framework, where every project row pulls its version, release assets and download counts from the GitHub API at build time and a daily rebuild keeps them current. Bilingual EN/DE, static except for one contact function.",
    caseStudy: {
      problem: "A portfolio goes out of date the moment a release ships: versions, download counts and dates get typed in by hand and are quietly wrong a week later.",
      built: "A static Astro site that resolves each repository once per build and renders the numbers it gets back, with verified fallbacks for the case where GitHub is unreachable. A scheduled deploy hook rebuilds it daily; the contact form is the only server-side surface.",
    },
    de: {
      tagline: "Diese Seite — ein Portfolio, das seine eigenen Release-Daten liest.",
      description:
        "Eine Astro-Seite ohne Client-Framework: Jede Projektzeile holt Version, Release-Assets und Download-Zahlen zur Build-Zeit aus der GitHub-API, ein täglicher Rebuild hält sie aktuell. Zweisprachig EN/DE, statisch bis auf eine Kontakt-Funktion.",
      caseStudy: {
        problem: "Ein Portfolio ist veraltet, sobald ein Release rausgeht: Versionen, Download-Zahlen und Daten werden von Hand eingetragen und stimmen eine Woche später nicht mehr.",
        built: "Eine statische Astro-Seite, die jedes Repository einmal pro Build auflöst und die Zahlen rendert, die zurückkommen — mit geprüften Fallbacks, falls GitHub nicht erreichbar ist. Ein geplanter Deploy-Hook baut täglich neu; das Kontaktformular ist die einzige serverseitige Fläche.",
      },
      highlights: [
        "GitHub-Daten zur Build-Zeit mit geprüften Fallbacks — ein gedrosselter Build degradiert, statt Falsches zu behaupten.",
        "Zweisprachig EN/DE mit hreflang-Alternates auf jeder Route, inklusive aller Projektseiten.",
        "Eine einzige Serverless-Funktion für das Kontaktformular: Origin-Prüfung, IP-Ratelimit, Honeypot.",
      ],
    },
    stack: ["Astro", "TypeScript", "Vercel"],
    featuredTier: "project",
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
    status: "active",
    tagline: "The product site behind oeffigo.app, with a public data status page.",
    description:
      "The marketing and status site for ÖffiGo: what the app does, which parts are beta, and a status page that reports the state of the transport data instead of leaving it to a screenshot.",
    caseStudy: {
      problem: "A transport app that mixes official realtime, timetable data and its own beta measurements has to say which is which — a landing page that only markets the app cannot do that.",
      built: "A product site that carries the same status discipline as the app: every capability is labelled with what it actually delivers today, and a public status page reports the data situation live.",
    },
    de: {
      tagline: "Die Produktseite hinter oeffigo.app, samt öffentlicher Datenstatus-Seite.",
      description:
        "Die Marketing- und Status-Seite für ÖffiGo: was die App kann, welche Teile Beta sind, und eine Status-Seite, die den Zustand der Verkehrsdaten meldet, statt ihn einem Screenshot zu überlassen.",
      caseStudy: {
        problem: "Eine Verkehrs-App, die offizielle Echtzeit, Fahrplandaten und eigene Beta-Messungen mischt, muss sagen, was wovon kommt — eine Landingpage, die nur die App bewirbt, kann das nicht.",
        built: "Eine Produktseite mit derselben Status-Disziplin wie die App: Jede Fähigkeit ist damit beschriftet, was sie heute wirklich liefert, und eine öffentliche Status-Seite meldet die Datenlage live.",
      },
      highlights: [
        "Öffentliche Status-Seite für die Datenlage statt Marketing-Versprechen.",
        "Dasselbe Papier-System wie diese Seite, in ÖffiGos eigenen Farben.",
        "Zweisprachig, statisch ausgeliefert, eigene Domain.",
      ],
    },
    stack: ["Astro", "TypeScript", "Cloudflare"],
    featuredTier: "project",
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

// ÖffiGo has its own dedicated launch band on the homepage, so it is
// intentionally omitted here to avoid showing the project twice.
export const upcomingProjects: UpcomingProject[] = [
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

// The "highlights" group that opens the project index — the flagship projects,
// rendered as the same text rows as every other group, just first. Each project
// appears here OR in a section below, never both.
export const featuredShowcaseProjects = orderedProjects(["patchpilot", "briskedit", "macphone"]);

export const projectSections: ProjectSection[] = [
  {
    eyebrow: "mac apps",
    title: "Mac Apps",
    de: {
      eyebrow: "mac-apps",
      title: "Mac-Apps",
    },
    projects: orderedProjects(["bottlelite", "poise", "claude-swap-bar", "notchtray", "ccrab", "portpirate", "slamx"]),
  },
  {
    eyebrow: "agents & tools",
    title: "Agents and developer tools",
    de: {
      eyebrow: "agents & tools",
      title: "Agent- und Entwickler-Tools",
    },
    projects: orderedProjects(["healthkit-mcp", "agent-presence", "hermes-discord-voice", "openclaw-discord-voice"]),
  },
  {
    eyebrow: "more",
    title: "More Projects",
    de: {
      eyebrow: "mehr",
      title: "Weitere Projekte",
    },
    projects: orderedProjects(["johannesgrof-me", "oeffigo-website", "tools", "caruso-reborn", "ip-multitool", "docxtopdf"]),
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
