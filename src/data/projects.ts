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

export interface UpcomingProject {
  name: string;
  status: ProjectStatus;
  description: string;
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
    tagline: "Discord voice transport for local OpenClaw sessions.",
    description:
      "A small TypeScript bridge that connects Discord voice events with a local OpenClaw runtime, keeping the voice pipeline observable and controllable.",
    audience: "For local-agent experiments that need Discord voice input without hiding the runtime.",
    result: "Turns Discord voice events into an inspectable local OpenClaw workflow.",
    caseStudy: {
      problem: "Local OpenClaw sessions can be hard to use naturally when voice input and runtime state live in separate tools.",
      built: "I built a TypeScript bridge around explicit status output, session control, and a visible voice pipeline.",
      result: "Discord voice events become a visible OpenClaw workflow with session control, tool-calling context, memory support, and optional speech output.",
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
      "Bridges Discord voice events into a local OpenClaw workflow.",
      "Keeps the runtime path explicit instead of hiding it behind a black-box bot.",
      "Designed around status output, session control, and maintainable TypeScript.",
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
    tagline: "Batch DOCX to PDF conversion through Microsoft Word.",
    description:
      "A macOS TUI that searches DOCX files, lets you select them with the keyboard, and exports PDFs through Word's native renderer.",
    audience: "For Mac users who need reliable DOCX exports without opening every file by hand.",
    result: "Batch converts selected DOCX files while keeping Word's PDF fidelity.",
    caseStudy: {
      problem: "Manual DOCX to PDF export is slow, and non-Word converters often break document layout.",
      built: "I built a keyboard-driven macOS TUI that finds DOCX files, lets the user select batches, and drives Word's native renderer.",
      result: "The workflow keeps document fidelity high while removing the repeated open-export-close loop.",
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
      "Uses Microsoft Word as the export engine for document fidelity.",
      "Supports batch conversion in a single Word session where possible.",
      "Optional OCR layer support keeps generated PDFs searchable.",
      "Removes the repeated open-export-close loop from DOCX to PDF work.",
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
    tagline: "Modern radio playback for first-generation T+A Caruso systems.",
    description:
      "A local radio and playback bridge that makes old Caruso systems usable again with browsable stations, renderer status, and server controls.",
    audience: "For owners of older T+A Caruso systems that lost comfortable modern radio browsing.",
    result: "Brings station browsing, playback state, and local controls back into one dashboard.",
    caseStudy: {
      problem: "Older Caruso systems still sound good, but modern radio browsing and control can be awkward or broken.",
      built: "I built a local UPnP/DLNA bridge with station management, renderer status, and server controls.",
      result: "The device becomes usable again without replacing the hardware.",
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
      "Publishes a browsable station list for compatible Caruso devices.",
      "Shows renderer transport, source, quality, position, and server metrics.",
      "Keeps local server controls and station management in one dashboard.",
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
    tagline: "Permissioned coding-agent TUI for local and cloud model runs.",
    description:
      "PatchPilot keeps agent sessions, approvals, model choice, token use, and patch review visible inside one terminal workflow instead of hiding the run behind a chat box.",
    audience: "For developers who want agent experiments to stay inspectable, approval-aware, and close to the repository they are changing.",
    result: "The stable CLI release ships clearer TUI controls, hardened permissions, Gemini-Wrapper routing, and better token and session visibility.",
    caseStudy: {
      problem: "Coding-agent runs become hard to trust when permissions, provider state, model selection, token use, and patch context are scattered or hidden.",
      built: "I built an Ink-based TUI around sticky approvals, transcript panes, provider metadata, safer tool execution, and local/cloud model selection.",
      result: "The run is easier to inspect and steer while the repository context stays close.",
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
      "Shows provider, model, session, token, cache, and cost telemetry in the terminal.",
      "Keeps transcript, permission state, and approval prompts visible while working.",
      "Supports Codex, Gemini, NVIDIA, OpenRouter, Ollama, and other provider experiments from one setup flow.",
    ],
    releaseHighlights: [
      "Sticky approval UI makes write and shell escalation visible instead of burying it in transcript text.",
      "Provider model filtering and safer fallback data reduce broken model-picker states.",
      "Windows shell handling, secret-path blocking, and release-hook automation make the CLI safer to ship.",
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
    tagline: "Sensor-only MacBook impact detection with sound feedback.",
    description:
      "A fun macOS utility that reads Apple SPU accelerometer data, detects sharp impact spikes, and plays local sound feedback with visible calibration.",
    audience: "For Mac users who like weird native experiments with real sensor data.",
    result: "Detects impact spikes from Apple SPU accelerometer reports without using the microphone.",
    caseStudy: {
      problem: "Most joke impact apps would fake detection through audio or simple triggers instead of reading the real sensor path.",
      built: "I built a native macOS utility around HID accelerometer reports, calibration, threshold tuning, and local sound feedback.",
      result: "It is a fun experiment, but also proof that the app reads actual device telemetry.",
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
      "Reads Apple SPU accelerometer reports through local HID access.",
      "Provides live telemetry, calibration, threshold tuning, and sound selection.",
      "Does not use microphone access or audio-based fallback detection.",
      "Built for fun. Please do not actually abuse your Mac.",
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
    tagline: "Native macOS text editor for developers, built without Electron.",
    description:
      "A SwiftUI and AppKit editor that opens files instantly, stays under 120 MB idle, and runs your code from a button that figures out the toolchain itself, with no tasks.json, no extension host, and no second runtime.",
    audience: "For developers who want a fast native editor for quick edits and small projects instead of a heavyweight Electron setup.",
    result: "Opens before your finger leaves the trackpad and runs C, Swift, Python, JS/TS, Rust, or Go without config files.",
    caseStudy: {
      problem: "Opening a heavyweight editor to fix one typo means waiting on RAM, an extension host, and a folder index before you can type.",
      built: "I built a native macOS editor on TextKit 2 and AppKit with an integrated terminal, run button, markdown preview, and gitignore-aware find, all without Electron or telemetry.",
      result: "A fast, native editing surface that uses the tools already on the machine instead of a marketplace of extensions.",
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
      "Opens large files instantly with a TextKit 2 view and no launch-time indexing.",
      "Runs code from one button that discovers the right toolchain per file.",
      "Ships an integrated SwiftTerm terminal, markdown preview, and gitignore-aware find.",
      "No telemetry, no account, no extension marketplace, and no Electron runtime.",
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
    tagline: "Self-hosted Discord voice bridge for the Hermes agent.",
    description:
      "A TypeScript bridge that joins a Discord voice channel, transcribes a spoken turn locally with Whisper, sends the text to Hermes, and plays the reply back through a configurable TTS provider.",
    audience: "For personal and small trusted Discord servers that want voice access to a local Hermes agent without a hosted service.",
    result: "Turns a Discord voice channel into a private, self-hosted voice interface for Hermes.",
    caseStudy: {
      problem: "Talking to a local agent over Discord voice usually means trusting a hosted bot and giving up control of the speech pipeline.",
      built: "I built a self-hosted bridge around local whisper-cli transcription, per-guild sessions, an allowlist, and pluggable TTS providers.",
      result: "Voice input stays private and self-hosted while the runtime and transport stay explicit.",
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
      "Joins Discord voice, records a turn, and transcribes it locally with whisper-cli.",
      "Routes transcripts to Hermes over CLI by default, with optional API/Gateway transport.",
      "Supports Piper, macOS say, ElevenLabs, or a custom TTS command for replies.",
      "Keeps voice input private by default with a per-guild speaker allowlist.",
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
    stack: ["Swift", "macOS", "Menu Bar"],
    visibility: "public",
  },
  {
    name: "TypeBot",
    status: "coming soon",
    description: "A controlled typing automation tool for predictable browser and desktop workflows.",
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
