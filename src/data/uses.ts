// What I work with, for /uses. Read off the machine on 2026-10-11; keep it to
// things I actually use for development, and update it when the setup changes.

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
      { name: "MacBook Pro, Apple M5 Pro", note: { en: "15 cores (5 super, 10 performance), 24 GB. Everything runs on it, local models included.", de: "15 Kerne (5 Super, 10 Performance), 24 GB. Darauf läuft alles, auch lokale Modelle." } },
      { name: "macOS 27", note: { en: "Always the current version, because my apps have to run on it.", de: "Immer die aktuelle Version, weil meine Apps darauf laufen müssen." } },
    ],
  },
  {
    title: { en: "Terminal", de: "Terminal" },
    items: [
      { name: "Ghostty", note: { en: "Cascadia Code at 14 pt. Fast, native, no fuss.", de: "Cascadia Code in 14 pt. Schnell, nativ, ohne Theater." } },
      { name: "zsh", note: { en: "With fzf, eza, bat, fd and ripgrep.", de: "Mit fzf, eza, bat, fd und ripgrep." } },
      { name: "dirhop", note: { en: "My own: jump to any folder in a few keystrokes.", de: "Selbst gebaut: in ein paar Tasten in jeden Ordner springen." }, href: "/projects/dirhop/" },
      { name: "RTK", note: { en: "Shrinks shell output before it reaches a coding agent.", de: "Kürzt Shell-Ausgaben, bevor sie bei einem Coding-Agent landen." } },
    ],
  },
  {
    title: { en: "Coding agents", de: "Coding-Agents" },
    items: [
      { name: "Claude Code", note: { en: "My main agent, in the terminal next to the editor.", de: "Mein Haupt-Agent, im Terminal neben dem Editor." } },
      { name: "Codex", note: { en: "Second opinion, reviews and longer jobs; CodexBar shows the usage.", de: "Zweite Meinung, Reviews und längere Aufgaben; CodexBar zeigt den Verbrauch." } },
      { name: "OpenCode", note: { en: "Mechanical work goes to cheaper models, I review what comes back.", de: "Mechanische Arbeit geht an günstigere Modelle, ich prüfe, was zurückkommt." } },
      { name: "claude-swap-bar", note: { en: "My own: switch Claude Code accounts from the menu bar.", de: "Selbst gebaut: Claude-Code-Accounts aus der Menüleiste wechseln." }, href: "/projects/claude-swap-bar/" },
      { name: "agent-presence", note: { en: "My own: Discord shows what the agent is working on.", de: "Selbst gebaut: Discord zeigt, woran der Agent gerade arbeitet." }, href: "/projects/agent-presence/" },
      { name: "Wispr Flow", note: { en: "Dictation instead of typing.", de: "Diktieren statt tippen." } },
    ],
  },
  {
    title: { en: "Editors and IDEs", de: "Editoren und IDEs" },
    items: [
      { name: "Xcode", note: { en: "Everything Swift: ÖffiGo, the Mac apps, the Watch app.", de: "Alles mit Swift: ÖffiGo, die Mac-Apps, die Watch-App." } },
      { name: "Visual Studio Code Insiders", note: { en: "Web projects like this site.", de: "Web-Projekte wie diese Seite." } },
      { name: "BriskEdit", note: { en: "My own: quick edits and Markdown with a terminal right there.", de: "Selbst gebaut: schnelle Änderungen und Markdown, mit Terminal daneben." }, href: "/projects/briskedit/" },
      { name: "IntelliJ IDEA, Android Studio", note: { en: "Java and Android.", de: "Java und Android." } },
    ],
  },
  {
    title: { en: "Languages and runtimes", de: "Sprachen und Laufzeiten" },
    items: [
      { name: "Swift 6.4", note: { en: "SwiftUI and AppKit for iPhone, Watch and Mac.", de: "SwiftUI und AppKit für iPhone, Watch und Mac." } },
      { name: "TypeScript", note: { en: "Node 26, Bun and pnpm; Astro for sites.", de: "Node 26, Bun und pnpm; Astro für Websites." } },
      { name: "Rust", note: { en: "Small, fast CLIs that ship as one binary.", de: "Kleine, schnelle CLIs, die als ein Binary ausgeliefert werden." } },
      { name: "Python", note: { en: "With uv, for scripts and network tools.", de: "Mit uv, für Skripte und Netzwerk-Tools." } },
    ],
  },
  {
    title: { en: "Shipping", de: "Ausliefern" },
    items: [
      { name: "GitHub and GitHub Actions", note: { en: "Every project, every release, CI on every pull request.", de: "Jedes Projekt, jedes Release, CI bei jedem Pull Request." } },
      { name: "Vercel", note: { en: "This site, in Frankfurt, with Upstash Redis and Resend behind it.", de: "Diese Seite, in Frankfurt, mit Upstash Redis und Resend dahinter." } },
      { name: "Cloudflare", note: { en: "DNS, and oeffigo.app with its status page.", de: "DNS, und oeffigo.app samt Status-Seite." } },
      { name: "Railway", note: { en: "Backends that need a long-running server.", de: "Backends, die einen dauerhaft laufenden Server brauchen." } },
      { name: "TestFlight", note: { en: "The ÖffiGo beta.", de: "Die ÖffiGo-Beta." } },
      { name: "OrbStack", note: { en: "Docker and Linux machines on the Mac.", de: "Docker und Linux-Maschinen am Mac." } },
    ],
  },
  {
    title: { en: "Debugging and APIs", de: "Debugging und APIs" },
    items: [
      { name: "Proxyman", note: { en: "Watching what an app really sends.", de: "Sehen, was eine App wirklich schickt." } },
      { name: "Yaak, Postman", note: { en: "Trying APIs before writing code against them.", de: "APIs ausprobieren, bevor ich Code dagegen schreibe." } },
      { name: "Tailscale", note: { en: "Reaching my own machines from anywhere.", de: "Meine eigenen Geräte von überall erreichen." } },
      { name: "Ghidra", note: { en: "For when there is no documentation.", de: "Für den Fall, dass es keine Doku gibt." } },
    ],
  },
  {
    title: { en: "On the Mac", de: "Am Mac" },
    items: [
      { name: "Raycast", note: { en: "Launcher, snippets, clipboard history.", de: "Launcher, Snippets, Zwischenablage-Verlauf." } },
      { name: "Rectangle, Ice, Stats", note: { en: "Windows on shortcuts, a tidy menu bar, the load at a glance.", de: "Fenster per Tastenkürzel, aufgeräumte Menüleiste, Auslastung auf einen Blick." } },
      { name: "Shottr, Screen Studio", note: { en: "Screenshots and the videos for project pages.", de: "Screenshots und die Videos für Projektseiten." } },
      { name: "Karabiner-Elements", note: { en: "A few custom key mappings.", de: "Ein paar eigene Tastenbelegungen." } },
      { name: "NotchTray, poise", note: { en: "My own menu bar apps, in daily use.", de: "Meine eigenen Menüleisten-Apps, jeden Tag im Einsatz." }, href: "/projects/notchtray/" },
    ],
  },
  {
    title: { en: "Notes and design", de: "Notizen und Design" },
    items: [
      { name: "Obsidian", note: { en: "One vault per bigger project, where decisions and pitfalls are written down.", de: "Ein Vault pro größerem Projekt, mit Entscheidungen und Fallen." } },
      { name: "Notion", note: { en: "Planning.", de: "Planung." } },
      { name: "SF Symbols, Affinity, Illustrator", note: { en: "Icons and app graphics.", de: "Icons und App-Grafiken." } },
      { name: "Blender, DaVinci Resolve", note: { en: "Now and then for 3D and video.", de: "Ab und zu für 3D und Video." } },
    ],
  },
];
