export type ProjectStatus = "active" | "beta" | "experimental" | "coming soon";

export interface Project {
  name: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  href?: string;
  visibility: "public" | "private" | "planned";
}

export const featuredProjects: Project[] = [
  {
    name: "SlamX",
    status: "beta",
    description: "A fun macOS app that makes your MacBook scream when it detects movement.",
    stack: ["Swift", "macOS", "Sensors"],
    href: "https://github.com/jx-grxf/SlamX",
    visibility: "public",
  },
  {
    name: "Caruso-Reborn",
    status: "active",
    description:
      "A local radio and playback bridge that brings modern internet radio back to first-generation T+A Caruso systems.",
    stack: ["TypeScript", "UPnP", "DLNA"],
    href: "https://github.com/jx-grxf/Caruso-Reborn",
    visibility: "public",
  },
  {
    name: "PatchPilot",
    status: "experimental",
    description:
      "A local-first coding agent TUI for guided patching, observable runs, and provider-aware AI workflows.",
    stack: ["TypeScript", "Ink", "AI"],
    href: "https://github.com/jx-grxf/PatchPilot",
    visibility: "public",
  },
  {
    name: "DocxToPDF",
    status: "active",
    description:
      "A macOS TUI that finds DOCX files and batch-converts them to PDF using Microsoft Word's native export engine.",
    stack: ["TypeScript", "macOS", "Word"],
    href: "https://github.com/jx-grxf/DocxToPDF",
    visibility: "public",
  },
  {
    name: "Digi2PDF",
    status: "experimental",
    description:
      "A document capture and OCR workflow for turning difficult digital book workflows into clean, searchable PDFs.",
    stack: ["Python", "Selenium", "OCR"],
    href: "https://github.com/jx-grxf/Digi2PDF",
    visibility: "public",
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

export const upcomingProjects: Project[] = [
  {
    name: "TypeBot",
    status: "coming soon",
    description: "A controlled typing automation tool for predictable browser and desktop workflows.",
    stack: ["TypeScript", "CLI", "Automation"],
    visibility: "private",
  },
];
