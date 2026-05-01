export type ProjectStatus = "active" | "beta" | "experimental" | "archived";

export interface Project {
  name: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  href?: string;
  visibility: "public" | "private";
}

export const projects: Project[] = [
  {
    name: "OpenClaw Discord Voice",
    status: "active",
    description: "Discord voice tooling and automation around the OpenClaw ecosystem.",
    stack: ["TypeScript", "Discord", "Automation"],
    href: "https://github.com/jx-grxf/OpenClaw-Discord-Voice",
    visibility: "public",
  },
  {
    name: "ClawDash",
    status: "active",
    description: "A dashboard for monitoring and controlling local agent workflows.",
    stack: ["Next.js", "TypeScript", "UI"],
    visibility: "private",
  },
  {
    name: "TypeBot",
    status: "beta",
    description: "A typing automation tool with a focus on controlled, predictable workflows.",
    stack: ["TypeScript", "CLI", "macOS"],
    visibility: "private",
  },
  {
    name: "Digi2PDF",
    status: "experimental",
    description: "A document conversion workflow for turning image batches into clean PDFs.",
    stack: ["Node.js", "PDF", "TUI"],
    href: "https://github.com/jx-grxf/Digi2PDF",
    visibility: "public",
  },
  {
    name: "SlamX",
    status: "beta",
    description: "A native macOS utility built around sensors, desktop interactions, and fast feedback.",
    stack: ["Swift", "macOS", "HID"],
    href: "https://github.com/jx-grxf/SlamX",
    visibility: "public",
  },
  {
    name: "Word Counter",
    status: "archived",
    description: "A compact utility project for text analysis and small workflow experiments.",
    stack: ["Web", "Utility"],
    visibility: "private",
  },
];
