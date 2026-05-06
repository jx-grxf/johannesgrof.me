export type ProjectStatus = "active" | "beta" | "experimental" | "coming soon";

export interface ShowcaseImage {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fit?: "cover" | "contain";
}

export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
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
  repo: `jx-grxf/${string}`;
  githubUrl: string;
  releaseUrl: string;
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
    audience: "For local-agent experiments that need Discord voice input without hiding the runtime.",
    result: "Turns Discord voice events into an inspectable local OpenClaw workflow.",
    caseStudy: {
      problem: "Voice experiments can become hard to debug when Discord, runtime state, and local agent sessions are hidden behind one bot process.",
      built: "I built a TypeScript bridge around explicit status output, session control, and a visible voice pipeline.",
      result: "The project makes the transport path easier to inspect and safer to iterate on while testing local OpenClaw sessions.",
    },
    stack: ["TypeScript", "Discord", "Voice"],
    repo: "jx-grxf/OpenClaw-Discord-Voice",
    githubUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    releaseUrl: "https://github.com/jx-grxf/OpenClaw-Discord-Voice/releases/tag/v1.0.4",
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
      "A macOS TUI that searches DOCX files, lets you select them with the keyboard, and exports PDFs through Word's native renderer.",
    audience: "For Mac users who need reliable DOCX exports without opening every file by hand.",
    result: "Batch converts selected DOCX files while keeping Word's PDF fidelity.",
    caseStudy: {
      problem: "Manual DOCX to PDF export is slow, and non-Word converters often break document layout.",
      built: "I built a keyboard-driven macOS TUI that finds DOCX files, lets the user select batches, and drives Word's native renderer.",
      result: "The workflow keeps document fidelity high while removing the repeated open-export-close loop.",
    },
    stack: ["TypeScript", "macOS", "Word"],
    repo: "jx-grxf/DocxToPDF",
    githubUrl: "https://github.com/jx-grxf/DocxToPDF",
    releaseUrl: "https://github.com/jx-grxf/DocxToPDF/releases/tag/v0.1.0",
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
    audience: "For owners of older T+A Caruso systems that lost comfortable modern radio browsing.",
    result: "Brings station browsing, playback state, and local controls back into one dashboard.",
    caseStudy: {
      problem: "Older Caruso systems still sound good, but modern radio browsing and control can be awkward or broken.",
      built: "I built a local UPnP/DLNA bridge with station management, renderer status, and server controls.",
      result: "The device becomes usable again without replacing the hardware.",
    },
    stack: ["TypeScript", "UPnP", "DLNA"],
    repo: "jx-grxf/Caruso-Reborn",
    githubUrl: "https://github.com/jx-grxf/Caruso-Reborn",
    releaseUrl: "https://github.com/jx-grxf/Caruso-Reborn/releases/tag/v0.2.1",
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
    audience: "For developers who want coding-agent runs to stay visible, local-aware, and easier to control.",
    result: "Shows model, session, token, cache, and cost state directly in the terminal.",
    caseStudy: {
      problem: "Agent runs can feel like a black box when context, model choice, token use, and cost are hidden from the developer.",
      built: "I built an Ink-based TUI around guided patching, provider metadata, transcript panes, and local/cloud model switching.",
      result: "The run becomes easier to understand while the repository context stays close.",
    },
    stack: ["TypeScript", "Ink", "AI"],
    repo: "jx-grxf/PatchPilot",
    githubUrl: "https://github.com/jx-grxf/PatchPilot",
    releaseUrl: "https://github.com/jx-grxf/PatchPilot/releases/tag/v0.1.1-beta",
    fallbackVersion: "v0.1.1-beta",
    highlights: [
      "Shows provider, model, session, token, cache, and cost telemetry.",
      "Keeps transcript and session context visible while working in the terminal.",
      "Supports local-first workflows with ollama while still allowing cloud providers.",
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
    audience: "For students who own Digi4School books and need a cleaner private-study PDF workflow.",
    result: "Captures pages, builds PDFs, and keeps OCR and confirmation controls visible.",
    caseStudy: {
      problem: "Some school ebook workflows are awkward when you want searchable notes or offline study material for books you already have access to.",
      built: "I built a browser capture and OCR pipeline with explicit private-use confirmation, delay controls, and PDF cleanup.",
      result: "The output is easier to search and archive while the tool keeps the user in control.",
    },
    stack: ["Python", "Selenium", "OCR"],
    repo: "jx-grxf/Digi2PDF",
    githubUrl: "https://github.com/jx-grxf/Digi2PDF",
    releaseUrl: "https://github.com/jx-grxf/Digi2PDF/releases/tag/v0.2.0",
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
      "A fun macOS utility that reads Apple SPU accelerometer data, detects sharp impact spikes, and plays local sound feedback with visible calibration.",
    audience: "For Mac users who like weird native experiments with real sensor data.",
    result: "Detects impact spikes from Apple SPU accelerometer reports without using the microphone.",
    caseStudy: {
      problem: "Most joke impact apps would fake detection through audio or simple triggers instead of reading the real sensor path.",
      built: "I built a native macOS utility around HID accelerometer reports, calibration, threshold tuning, and local sound feedback.",
      result: "It is a fun experiment, but also proof that the app reads actual device telemetry.",
    },
    stack: ["Swift", "macOS", "Sensors"],
    repo: "jx-grxf/SlamX",
    githubUrl: "https://github.com/jx-grxf/SlamX",
    releaseUrl: "https://github.com/jx-grxf/SlamX/releases/tag/v0.3.4",
    fallbackVersion: "v0.3.4",
    highlights: [
      "Reads Apple SPU accelerometer reports through local HID access.",
      "Provides live telemetry, calibration, threshold tuning, and sound selection.",
      "Does not use microphone access or audio-based fallback detection.",
      "Built for fun. Please do not actually abuse your Mac.",
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
