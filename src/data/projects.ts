export type ProjectStatus = "active" | "beta" | "experimental" | "coming soon";

export interface ShowcaseImage {
  src: string;
  fallbackSrc?: string;
  alt: string;
  caption: string;
  fit?: "cover" | "contain";
}

export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
  tagline: string;
  description: string;
  stack: string[];
  repo: `jx-grxf/${string}`;
  githubUrl: string;
  installCommand: string;
  sourceCommand: string;
  fallbackVersion: string;
  highlights: string[];
  showcase: ShowcaseImage[];
  visibility: "public" | "private" | "planned";
}

export interface UpcomingProject {
  name: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  visibility: "public" | "private" | "planned";
}

export const featuredProjects: Project[] = [
  {
    name: "OpenClaw-Discord-Voice",
    slug: "openclaw-discord-voice",
    status: "active",
    tagline: "Discord voice transport for local OpenClaw sessions.",
    description:
      "A small TypeScript bridge that connects Discord voice events with a local OpenClaw runtime, keeping the voice pipeline observable and controllable.",
    stack: ["TypeScript", "Discord", "Voice"],
    repo: "jx-grxf/OpenClaw-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    installCommand: "git clone https://github.com/jx-grxf/OpenClaw-Discord-Voice.git",
    sourceCommand: "gh repo clone jx-grxf/OpenClaw-Discord-Voice",
    fallbackVersion: "v1.0.4",
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
        caption: "Discord voice event pipeline from bridge to local runtime.",
        fit: "contain",
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
      "A calm macOS TUI that searches DOCX files, lets you select them with the keyboard, and exports PDFs through Word's native renderer.",
    stack: ["TypeScript", "macOS", "Word"],
    repo: "jx-grxf/DocxToPDF",
    githubUrl: "https://github.com/jx-grxf/DocxToPDF",
    installCommand: "gh repo clone jx-grxf/DocxToPDF && cd DocxToPDF && npm install",
    sourceCommand: "git clone https://github.com/jx-grxf/DocxToPDF.git",
    fallbackVersion: "v0.1.0",
    highlights: [
      "Uses Microsoft Word as the export engine for document fidelity.",
      "Supports batch conversion in a single Word session where possible.",
      "Optional OCR layer support keeps generated PDFs searchable.",
    ],
    showcase: [
      {
        src: "/projects/docxtopdf/hero.webp",
        fallbackSrc: "/projects/docxtopdf/hero.png",
        alt: "DocxToPDF terminal export flow",
        caption: "Word-backed export flow with OCR and overwrite controls.",
        fit: "contain",
      },
    ],
    visibility: "public",
  },
  {
    name: "Caruso-Reborn",
    slug: "caruso-reborn",
    status: "active",
    tagline: "Modern radio playback for first-generation T+A Caruso systems.",
    description:
      "A local radio and playback bridge that makes old Caruso systems usable again with browsable stations, renderer status, and server controls.",
    stack: ["TypeScript", "UPnP", "DLNA"],
    repo: "jx-grxf/Caruso-Reborn",
    githubUrl: "https://github.com/jx-grxf/Caruso-Reborn",
    installCommand: "gh repo clone jx-grxf/Caruso-Reborn && cd Caruso-Reborn && npm install",
    sourceCommand: "git clone https://github.com/jx-grxf/Caruso-Reborn.git",
    fallbackVersion: "v0.2.1",
    highlights: [
      "Publishes a browsable station list for compatible Caruso devices.",
      "Shows renderer transport, source, quality, position, and server metrics.",
      "Keeps local server controls and station management in one dashboard.",
    ],
    showcase: [
      {
        src: "/projects/caruso-reborn/hero.webp",
        fallbackSrc: "/projects/caruso-reborn/hero.png",
        alt: "Caruso Reborn dashboard",
        caption: "Live renderer status, server controls, and station list.",
        fit: "cover",
      },
    ],
    visibility: "public",
  },
  {
    name: "PatchPilot",
    slug: "patchpilot",
    status: "experimental",
    tagline: "Local-first coding-agent TUI with observable runs.",
    description:
      "A provider-aware terminal interface for guided patching, visible telemetry, and local or cloud model workflows without losing the repo context.",
    stack: ["TypeScript", "Ink", "AI"],
    repo: "jx-grxf/PatchPilot",
    githubUrl: "https://github.com/jx-grxf/PatchPilot",
    installCommand: "gh repo clone jx-grxf/PatchPilot && cd PatchPilot && npm install",
    sourceCommand: "git clone https://github.com/jx-grxf/PatchPilot.git",
    fallbackVersion: "v0.1.1-beta",
    highlights: [
      "Shows provider, model, session, token, cache, and cost telemetry.",
      "Keeps transcript and session context visible while working in the terminal.",
      "Supports local-first workflows while still allowing cloud providers.",
    ],
    showcase: [
      {
        src: "/projects/patchpilot/hero.webp",
        fallbackSrc: "/projects/patchpilot/hero.png",
        alt: "PatchPilot TUI session",
        caption: "Agent session view with telemetry, transcript, and prompt.",
        fit: "contain",
      },
    ],
    visibility: "public",
  },
  {
    name: "Digi2PDF",
    slug: "digi2pdf",
    status: "experimental",
    tagline: "Owned Digi4School ebooks to clean searchable PDFs.",
    description:
      "A document capture and OCR workflow for turning difficult browser-based ebook exports into clean PDFs with explicit user confirmation.",
    stack: ["Python", "Selenium", "OCR"],
    repo: "jx-grxf/Digi2PDF",
    githubUrl: "https://github.com/jx-grxf/Digi2PDF",
    installCommand: "gh repo clone jx-grxf/Digi2PDF && cd Digi2PDF",
    sourceCommand: "git clone https://github.com/jx-grxf/Digi2PDF.git",
    fallbackVersion: "v0.2.0",
    highlights: [
      "Combines browser automation, capture, Pillow, Tesseract, and OCRmyPDF.",
      "Makes private-use confirmation explicit before export.",
      "Keeps OCR quality and delay controls visible in the terminal flow.",
    ],
    showcase: [
      {
        src: "/projects/digi2pdf/hero.webp",
        fallbackSrc: "/projects/digi2pdf/hero.png",
        alt: "Digi2PDF terminal workflow",
        caption: "Terminal-guided ebook selection, OCR setup, and capture flow.",
        fit: "contain",
      },
    ],
    visibility: "public",
  },
  {
    name: "SlamX",
    slug: "slamx",
    status: "beta",
    tagline: "Sensor-only MacBook impact detection with sound feedback.",
    description:
      "A native macOS utility that reads Apple SPU accelerometer data, detects sharp impact spikes, and plays local sound feedback with visible calibration.",
    stack: ["Swift", "macOS", "Sensors"],
    repo: "jx-grxf/SlamX",
    githubUrl: "https://github.com/jx-grxf/SlamX",
    installCommand: "gh release download v0.3.4 -R jx-grxf/SlamX",
    sourceCommand: "git clone https://github.com/jx-grxf/SlamX.git",
    fallbackVersion: "v0.3.4",
    highlights: [
      "Reads Apple SPU accelerometer reports through local HID access.",
      "Provides live telemetry, calibration, threshold tuning, and sound selection.",
      "Does not use microphone access or audio-based fallback detection.",
    ],
    showcase: [
      {
        src: "/projects/slamx/monitor-dash.webp",
        fallbackSrc: "/projects/slamx/monitor-dash.jpeg",
        alt: "SlamX live dashboard",
        caption: "Live sensor dashboard with impact and sample telemetry.",
        fit: "contain",
      },
      {
        src: "/projects/slamx/monitor-calibration.webp",
        fallbackSrc: "/projects/slamx/monitor-calibration.jpeg",
        alt: "SlamX calibration view",
        caption: "Calibration and threshold tuning for supported MacBooks.",
        fit: "contain",
      },
      {
        src: "/projects/slamx/monitor-slamx.webp",
        fallbackSrc: "/projects/slamx/monitor-slamx.jpeg",
        alt: "SlamX onboarding view",
        caption: "Sensor availability and onboarding checks.",
        fit: "contain",
      },
    ],
    visibility: "public",
  },
];

export const upcomingProjects: UpcomingProject[] = [
  {
    name: "TypeBot",
    status: "coming soon",
    description: "A controlled typing automation tool for predictable browser and desktop workflows.",
    stack: ["TypeScript", "CLI", "Automation"],
    visibility: "private",
  },
  {
    name: "StackBar",
    status: "coming soon",
    description:
      "A planned macOS menu bar app for keeping local dev servers, logs, and runtime actions close at hand.",
    stack: ["Swift", "macOS", "Menu Bar"],
    visibility: "planned",
  },
];

export const projectsBySlug = new Map(featuredProjects.map((project) => [project.slug, project]));

export const statusClass = (status: string) => status.replaceAll(" ", "-");
