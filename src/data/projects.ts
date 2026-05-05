export type ProjectStatus = "active" | "beta" | "experimental" | "coming soon";

export interface ShowcaseImage {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fit?: "cover" | "contain";
}

export interface ProjectCommand {
  label: string;
  command: string;
}

export interface ProjectDownload {
  label: string;
  href: string;
  detail: string;
  kind: "macos" | "windows" | "release";
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
  releaseUrl: string;
  download?: ProjectDownload;
  commands: ProjectCommand[];
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
    releaseUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice/releases/tag/v1.0.4",
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/OpenClaw-Discord-Voice.git",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/OpenClaw-Discord-Voice",
      },
      {
        label: "latest release",
        command: "open https://github.com/jx-grxf/OpenClaw-Discord-Voice/releases/tag/v1.0.4",
      },
    ],
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
    releaseUrl: "https://github.com/jx-grxf/DocxToPDF/releases/tag/v0.1.0",
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/DocxToPDF.git && cd DocxToPDF && npm install",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/DocxToPDF && cd DocxToPDF && npm install",
      },
      {
        label: "latest release",
        command: "open https://github.com/jx-grxf/DocxToPDF/releases/tag/v0.1.0",
      },
    ],
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
    releaseUrl: "https://github.com/jx-grxf/Caruso-Reborn/releases/tag/v0.2.1",
    download: {
      label: "Download DMG",
      href: "https://github.com/jx-grxf/Caruso-Reborn/releases/download/v0.2.1/Caruso.Reborn.Beta-0.2.1-arm64.dmg",
      detail: "macOS arm64 beta build from GitHub Releases",
      kind: "macos",
    },
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/Caruso-Reborn.git && cd Caruso-Reborn && npm install",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/Caruso-Reborn && cd Caruso-Reborn && npm install",
      },
      {
        label: "download release with GitHub CLI",
        command: "gh release download v0.2.1 -R jx-grxf/Caruso-Reborn -p '*.dmg'",
      },
    ],
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
    releaseUrl: "https://github.com/jx-grxf/PatchPilot/releases/tag/v0.1.1-beta",
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/PatchPilot.git && cd PatchPilot && npm install",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/PatchPilot && cd PatchPilot && npm install",
      },
      {
        label: "latest release",
        command: "open https://github.com/jx-grxf/PatchPilot/releases/tag/v0.1.1-beta",
      },
    ],
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
    releaseUrl: "https://github.com/jx-grxf/Digi2PDF/releases/tag/v0.2.0",
    download: {
      label: "Download EXE",
      href: "https://github.com/jx-grxf/Digi2PDF/releases/download/v0.2.0/digi2pdf.exe",
      detail: "Windows executable from GitHub Releases",
      kind: "windows",
    },
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/Digi2PDF.git && cd Digi2PDF",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/Digi2PDF && cd Digi2PDF",
      },
      {
        label: "download release with GitHub CLI",
        command: "gh release download v0.2.0 -R jx-grxf/Digi2PDF -p '*.exe'",
      },
    ],
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
    releaseUrl: "https://github.com/jx-grxf/SlamX/releases/tag/v0.3.4",
    download: {
      label: "Download DMG",
      href: "https://github.com/jx-grxf/SlamX/releases/download/v0.3.4/SlamX-0.3.4.dmg",
      detail: "macOS DMG from GitHub Releases",
      kind: "macos",
    },
    commands: [
      {
        label: "source without GitHub CLI",
        command: "git clone https://github.com/jx-grxf/SlamX.git",
      },
      {
        label: "source with GitHub CLI",
        command: "gh repo clone jx-grxf/SlamX",
      },
      {
        label: "download release with GitHub CLI",
        command: "gh release download v0.3.4 -R jx-grxf/SlamX -p '*.dmg'",
      },
    ],
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
        fit: "contain",
      },
      {
        src: "/projects/slamx/monitor-calibration.webp",
        fallbackSrc: "/projects/slamx/monitor-calibration.jpeg",
        alt: "SlamX calibration view",
        fit: "contain",
      },
      {
        src: "/projects/slamx/monitor-slamx.webp",
        fallbackSrc: "/projects/slamx/monitor-slamx.jpeg",
        alt: "SlamX onboarding view",
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
