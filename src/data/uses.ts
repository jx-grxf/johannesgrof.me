// What I work with, for /uses. Read off the machine on 2026-10-11; only tools
// used for development, plain notes, update when the setup changes.

type Text = { en: string; de: string };

export interface UsesItem {
  name: string;
  note: Text;
  /** Internal link to a project page when it is one of mine. */
  href?: string;
}

export interface UsesGroup {
  title: Text;
  items: UsesItem[];
}

export const usesUpdated = "2026-10-11";

export const usesGroups: UsesGroup[] = [
  {
    title: { en: "Hardware", de: "Hardware" },
    items: [
      { name: "MacBook Pro, Apple M5 Pro", note: { en: "Work machine.", de: "Arbeitsrechner." } },
      { name: "macOS 27", note: { en: "Current release.", de: "Aktuelle Version." } },
    ],
  },
  {
    title: { en: "Terminal", de: "Terminal" },
    items: [
      { name: "Ghostty", note: { en: "With Cascadia Code.", de: "Mit Cascadia Code." } },
      { name: "zsh", note: { en: "With fzf, eza, bat, fd and ripgrep.", de: "Mit fzf, eza, bat, fd und ripgrep." } },
      { name: "dirhop", note: { en: "Built by me. Jumps to any folder in a few keystrokes.", de: "Selbst gebaut. Springt mit ein paar Tasten in jeden Ordner." }, href: "/projects/dirhop/" },
      { name: "RTK", note: { en: "Shortens shell output for coding agents.", de: "Kürzt Shell-Ausgaben für Coding-Agents." } },
    ],
  },
  {
    title: { en: "Coding agents", de: "Coding-Agents" },
    items: [
      { name: "Claude Code", note: { en: "Main agent, in the terminal.", de: "Haupt-Agent, im Terminal." } },
      { name: "Codex", note: { en: "Reviews and longer tasks. CodexBar shows the usage.", de: "Reviews und längere Aufgaben. Den Verbrauch zeigt CodexBar." } },
      { name: "OpenCode", note: { en: "Mechanical tasks with cheaper models.", de: "Mechanische Aufgaben mit günstigeren Modellen." } },
      { name: "claude-swap-bar", note: { en: "Built by me. Switches Claude Code accounts in the menu bar.", de: "Selbst gebaut. Wechselt Claude-Code-Accounts in der Menüleiste." }, href: "/projects/claude-swap-bar/" },
      { name: "agent-presence", note: { en: "Built by me. Shows in Discord what the agent is working on.", de: "Selbst gebaut. Zeigt in Discord, woran der Agent arbeitet." }, href: "/projects/agent-presence/" },
      { name: "Wispr Flow", note: { en: "Dictation.", de: "Diktieren." } },
    ],
  },
  {
    title: { en: "Editors and IDEs", de: "Editoren und IDEs" },
    items: [
      { name: "Xcode", note: { en: "Everything in Swift: ÖffiGo, the Mac apps, the Watch app.", de: "Alles in Swift: ÖffiGo, die Mac-Apps, die Watch-App." } },
      { name: "Visual Studio Code Insiders", note: { en: "Web projects like this site.", de: "Web-Projekte wie diese Seite." } },
      { name: "BriskEdit", note: { en: "Built by me. Markdown and short edits, with a terminal.", de: "Selbst gebaut. Markdown und kurze Änderungen, mit Terminal." }, href: "/projects/briskedit/" },
      { name: "IntelliJ IDEA, Android Studio", note: { en: "Java and Android.", de: "Java und Android." } },
    ],
  },
  {
    title: { en: "Languages and runtimes", de: "Sprachen und Laufzeiten" },
    items: [
      { name: "Swift 6.4", note: { en: "SwiftUI and AppKit for iPhone, Watch and Mac.", de: "SwiftUI und AppKit für iPhone, Watch und Mac." } },
      { name: "TypeScript", note: { en: "Node, Bun and pnpm; Astro for websites.", de: "Node, Bun und pnpm, Astro für Websites." } },
      { name: "Rust", note: { en: "CLIs that ship as one binary.", de: "CLIs, die als ein Binary kommen." } },
      { name: "Python", note: { en: "With uv, for scripts and network tools.", de: "Mit uv, für Skripte und Netzwerk-Tools." } },
    ],
  },
  {
    title: { en: "Shipping", de: "Ausliefern" },
    items: [
      { name: "GitHub and GitHub Actions", note: { en: "Code, releases and CI.", de: "Code, Releases und CI." } },
      { name: "Vercel", note: { en: "Hosts this site, with Upstash Redis and Resend.", de: "Hostet diese Seite, mit Upstash Redis und Resend." } },
      { name: "Cloudflare", note: { en: "DNS and oeffigo.app.", de: "DNS und oeffigo.app." } },
      { name: "Railway", note: { en: "Backends that need a running server.", de: "Backends mit dauerhaft laufendem Server." } },
      { name: "TestFlight", note: { en: "The ÖffiGo beta.", de: "Die ÖffiGo-Beta." } },
      { name: "OrbStack", note: { en: "Docker and Linux VMs.", de: "Docker und Linux-VMs." } },
    ],
  },
  {
    title: { en: "Debugging and APIs", de: "Debugging und APIs" },
    items: [
      { name: "Proxyman", note: { en: "Reading the network traffic of apps.", de: "Netzwerkverkehr von Apps mitlesen." } },
      { name: "Yaak, Postman", note: { en: "Testing APIs.", de: "APIs testen." } },
      { name: "Tailscale", note: { en: "Access to my devices from anywhere.", de: "Zugriff auf meine Geräte von unterwegs." } },
      { name: "Ghidra", note: { en: "Reverse engineering.", de: "Reverse Engineering." } },
    ],
  },
  {
    title: { en: "On the Mac", de: "Am Mac" },
    items: [
      { name: "Raycast", note: { en: "Launcher, snippets, clipboard.", de: "Launcher, Snippets, Zwischenablage." } },
      { name: "Rectangle, Ice, Stats", note: { en: "Window shortcuts, menu bar order, system load.", de: "Fenster per Tastenkürzel, Menüleiste ordnen, Systemauslastung." } },
      { name: "Shottr, Screen Studio", note: { en: "Screenshots and videos for the project pages.", de: "Screenshots und Videos für die Projektseiten." } },
      { name: "Karabiner-Elements", note: { en: "Custom key mappings.", de: "Eigene Tastenbelegungen." } },
      { name: "NotchTray, poise", note: { en: "Built by me. Menu bar apps.", de: "Selbst gebaut. Menüleisten-Apps." }, href: "/projects/notchtray/" },
    ],
  },
  {
    title: { en: "Notes and design", de: "Notizen und Design" },
    items: [
      { name: "Obsidian", note: { en: "One vault per bigger project.", de: "Ein Vault pro größerem Projekt." } },
      { name: "Notion", note: { en: "Planning.", de: "Planung." } },
      { name: "SF Symbols, Affinity, Illustrator", note: { en: "Icons and app graphics.", de: "Icons und App-Grafiken." } },
      { name: "Blender, DaVinci Resolve", note: { en: "3D and video.", de: "3D und Video." } },
    ],
  },
];
