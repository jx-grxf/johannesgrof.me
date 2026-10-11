// What `curl johannesgrof.me` prints: a pixel train drives through, then a
// business card with the live departures board. Pure string building, so the
// frames and the card can be tested without a terminal.

import type { Departure } from "@/lib/departures";

export interface CardProject {
  name: string;
  tagline: string;
  status: string;
}

export interface CardData {
  lang: "en" | "de";
  eyebrow: string;
  title: string;
  body: string;
  oeffigo: { tagline: string; status: string; url: string };
  kontobuch: { description: string; url: string };
  projects: CardProject[];
  board: { stop: string; updatedAt: string; departures: Departure[] } | null;
  links: { label: string; url: string }[];
  served: { edge: string | null; region: string | null; ms: number };
  viennaTime: string;
}

export const WIDTH = 78;

const ESC = "\x1b[";
const RESET = `${ESC}0m`;
const BOLD = `${ESC}1m`;
export const HIDE_CURSOR = `${ESC}?25l`;
export const SHOW_CURSOR = `${ESC}?25h`;

const rgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};
const fg = (hex: string) => `${ESC}38;2;${rgb(hex).join(";")}m`;
const bg = (hex: string) => `${ESC}48;2;${rgb(hex).join(";")}m`;
const paint = (hex: string, text: string) => `${fg(hex)}${text}${RESET}`;

// OSC 8 hyperlinks: clickable in iTerm2, kitty, WezTerm, Ghostty, VS Code;
// other terminals print just the text.
const link = (url: string, text = url) => `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;

// eslint-disable-next-line no-control-regex
const ANSI = /\x1b\[[0-9;?]*[a-zA-Z]|\x1b\]8;;[^\x1b]*\x1b\\/g;
export const visibleLength = (text: string) => [...text.replace(ANSI, "")].length;
const padEnd = (text: string, width: number) => text + " ".repeat(Math.max(0, width - visibleLength(text)));

const SIGNAL = "#ff6a4d";
const AMBER = "#ffcc4d";
const INK = "#f1eee5";
const MUTED = "#8f8a7e";
const LED = "#ffb21a";
const LED_BG = "#17140f";
const LIVE = "#a8e22a";

function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current && visibleLength(current) + 1 + visibleLength(word) > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Departure texts come from a third party and go straight into someone's
// terminal, so no control character may survive (ESC, CSI, OSC, BEL ...).
// eslint-disable-next-line no-control-regex
export const clean = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f]/g, "");

const truncate = (text: string, width: number) => {
  const chars = [...text];
  return chars.length > width ? `${chars.slice(0, width - 1).join("")}…` : text;
};

type Pixel = string | null;

/** Two pixel rows per text row: the upper half block takes the top colour, its background the bottom one. */
export function halfBlocks(grid: Pixel[][]): string[] {
  const width = Math.max(...grid.map((row) => row.length));
  const out: string[] = [];
  for (let y = 0; y < grid.length; y += 2) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const top = grid[y]?.[x] ?? null;
      const bottom = grid[y + 1]?.[x] ?? null;
      if (!top && !bottom) row += " ";
      else if (top && !bottom) row += `${fg(top)}▀${RESET}`;
      else if (!top && bottom) row += `${fg(bottom)}▄${RESET}`;
      else row += `${fg(top!)}${bg(bottom!)}▀${RESET}`;
    }
    out.push(row);
  }
  return out;
}

const GLYPHS: Record<string, string[]> = {
  J: ["...X", "...X", "...X", "X..X", ".XX."],
  O: [".XX.", "X..X", "X..X", "X..X", ".XX."],
  H: ["X..X", "X..X", "XXXX", "X..X", "X..X"],
  A: [".XX.", "X..X", "XXXX", "X..X", "X..X"],
  N: ["X..X", "XX.X", "X.XX", "X..X", "X..X"],
  E: ["XXXX", "X...", "XXX.", "X...", "XXXX"],
  S: [".XXX", "X...", ".XX.", "...X", "XXX."],
  G: [".XXX", "X...", "X.XX", "X..X", ".XXX"],
  R: ["XXX.", "X..X", "XXX.", "X.X.", "X..X"],
  F: ["XXXX", "X...", "XXX.", "X...", "X..."],
  " ": ["..", "..", "..", "..", ".."],
};

const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = rgb(a);
  const [br, bg_, bb] = rgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg_)}${c(ab, bb)}`;
};

/** The name in a 4×5 pixel font, signal red fading into amber, with a one-pixel drop shadow. */
export function wordmark(text = "JOHANNES GROF"): string[] {
  const columns: string[][] = [];
  [...text].forEach((char, index) => {
    if (index > 0) columns.push([".", ".", ".", ".", "."]);
    const glyph = GLYPHS[char] ?? GLYPHS[" "]!;
    for (let x = 0; x < glyph[0]!.length; x++) columns.push(glyph.map((row) => row[x]!));
  });
  const width = columns.length + 1;
  const grid: Pixel[][] = Array.from({ length: 6 }, () => Array<Pixel>(width).fill(null));
  columns.forEach((column, x) =>
    column.forEach((cell, y) => {
      if (cell === "X" && !grid[y + 1]![x + 1]) grid[y + 1]![x + 1] = "#4a2a20";
    }),
  );
  columns.forEach((column, x) =>
    column.forEach((cell, y) => {
      if (cell === "X") grid[y]![x] = mix(SIGNAL, AMBER, x / columns.length);
    }),
  );
  return halfBlocks(grid);
}

// The same train as the pixel sprite on the home page: one carriage and the green front.
const TRAIN_PALETTE: Record<string, string> = {
  W: "#ece8dc", w: "#bdb8aa", L: "#a8e22a", l: "#7fae16", Y: "#ffcc4d", D: "#2a2722",
};
const car = (body: string, shade: string, front = false) => [
  `.${body.repeat(front ? 22 : 24)}${front ? "...." : "."}`,
  `${body.repeat(front ? 24 : 26)}${front ? ".." : ""}`,
  `${body}${body}${"YYY".concat(body).repeat(5)}${front ? `${body}${body}${body}YY${body}.` : `${body}${body}${body}${body}`}`,
  `${body}${body}${"YYY".concat(body).repeat(5)}${front ? `${body}${body}${body}YYY${body}` : `${body}${body}${body}${body}`}`,
  `${body.repeat(front ? 27 : 26)}${front ? "Y" : ""}`,
  `${shade.repeat(front ? 28 : 26)}`,
  `.DD....DD.......DD....DD.${front ? "..." : "."}`,
  "",
];
const TRAIN = (() => {
  const cars = [car("W", "w"), car("L", "l", true)];
  return cars[0]!.map((_, row) => cars.map((c) => c[row]).join(row === 7 ? "" : "."));
})();
const TRAIN_WIDTH = Math.max(...TRAIN.map((row) => row.length));

/** One animation frame: the train with its nose at column `x`, cut to the card width, over the track. */
export function trainFrame(x: number): string[] {
  const grid: Pixel[][] = TRAIN.map((row) => {
    const line: Pixel[] = Array<Pixel>(WIDTH).fill(null);
    [...row].forEach((cell, i) => {
      const col = x - TRAIN_WIDTH + i;
      if (col >= 0 && col < WIDTH && cell !== ".") line[col] = TRAIN_PALETTE[cell] ?? null;
    });
    return line;
  });
  const track = Array.from({ length: WIDTH }, (_, i) => (i % 4 === 0 ? "┴" : "─")).join("");
  return [...halfBlocks(grid), paint("#5c574d", track)];
}

export const trainFrames = (step = 3) => {
  const frames: string[][] = [];
  for (let x = 0; x <= WIDTH + TRAIN_WIDTH; x += step) frames.push(trainFrame(x));
  return frames;
};

const BOX = WIDTH - 2;
const BOX_INNER = BOX - 4;

/** A rounded box, indented two columns like the rest of the card. */
function box(title: string, lines: string[], color: string): string[] {
  const head = `╭─ ${title} `;
  return [
    paint(color, head + "─".repeat(Math.max(0, BOX - 1 - visibleLength(head))) + "╮"),
    ...lines.map((line) => `${paint(color, "│")} ${padEnd(line, BOX_INNER)} ${paint(color, "│")}`),
    paint(color, `╰${"─".repeat(BOX - 2)}╯`),
  ].map((line) => `  ${line}`);
}

function board(data: CardData): string[] {
  const de = data.lang === "de";
  if (!data.board || !data.board.departures.length) {
    return box(de ? "Abfahrten" : "Departures", [paint(MUTED, de ? "Die Tafel ist gerade dunkel." : "The board is dark right now.")], "#5c574d");
  }
  const inner = BOX_INNER;
  const time = new Date(data.board.updatedAt).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" });
  // line(5) + space + towards + minutes(7) + two spaces + source dot + space = inner
  const towardsWidth = inner - 17;
  const panel = `${bg(LED_BG)}${fg(LED)}`;
  const rows = data.board.departures.slice(0, 6).map((d) => {
    const minutes = d.minutes === 0 ? (de ? "jetzt" : "now") : `${d.minutes} min`;
    const towards = truncate(clean(d.towards), towardsWidth).padEnd(towardsWidth);
    const source = d.realtime ? `${fg(LIVE)}●` : `${fg(MUTED)}○`;
    return `${panel}${BOLD}${truncate(clean(d.line), 5).padEnd(5)}${RESET}${panel} ${towards}${minutes.padStart(7)}  ${source} ${RESET}`;
  });
  const legend = paint(MUTED, de ? `● Echtzeit  ○ Fahrplan · Wiener Linien OGD, CC BY 4.0 · ${time}` : `● real time  ○ timetable · Wiener Linien OGD, CC BY 4.0 · ${time}`);
  return box(`${de ? "Gerade in Wien" : "Right now in Vienna"} · ${clean(data.board.stop)}`, [...rows, legend], LED);
}

export function card(data: CardData): string {
  const de = data.lang === "de";
  const indent = (lines: string[]) => lines.map((l) => (l ? `  ${l}` : l));
  const name = Math.max(...data.projects.map((p) => p.name.length));
  const out: string[] = [
    "",
    ...indent(wordmark()),
    "",
    ...indent([paint(MUTED, data.eyebrow), `${BOLD}${paint(INK, data.title)}`]),
    ...indent(wrap(data.body, WIDTH - 4).map((l) => paint(MUTED, l))),
    "",
    ...box(`ÖffiGo · ${data.oeffigo.tagline}`, [
      paint(INK, data.oeffigo.status),
      `${paint(MUTED, "→")} ${paint(LIVE, link(data.oeffigo.url))}`,
    ], LIVE),
    ...board(data),
    "",
    ...indent([`${BOLD}${paint(SIGNAL, de ? "PROJEKTE" : "PROJECTS")}${RESET}`]),
    ...indent(
      data.projects.map((p) => {
        const status = paint(MUTED, p.status);
        const room = WIDTH - 4 - name - 3 - visibleLength(status) - 2;
        return `${paint(AMBER, "▸")} ${BOLD}${p.name.padEnd(name)}${RESET}  ${padEnd(paint(INK, truncate(p.tagline, room)), room)}  ${status}`;
      }),
    ),
    ...indent([`${paint(AMBER, "▸")} ${BOLD}${"Kontobuch".padEnd(name)}${RESET}  ${paint(INK, truncate(data.kontobuch.description, WIDTH - 8 - name))}`]),
    "",
    ...indent(data.links.map((l) => `${paint(MUTED, l.label.padEnd(9))}${link(l.url, l.url.replace(/^mailto:|^https:\/\//, ""))}`)),
    "",
    ...indent([
      paint(
        "#5c574d",
        `${de ? "ausgeliefert" : "served"} ${data.served.edge ?? "edge"} → ${data.served.region ?? "local"} ${de ? "in" : "in"} ${data.served.ms} ms · ${de ? "Wien" : "Vienna"} ${data.viennaTime}`,
      ),
      paint("#5c574d", de ? "Im Browser gibt's mehr: ~ drücken öffnet das Terminal der Seite." : "There is more in the browser: press ~ to open the site's own terminal."),
      paint("#5c574d", de ? "English: curl -sL johannesgrof.me" : "Auf Deutsch: curl -sL johannesgrof.me/de"),
    ]),
    "",
  ];
  return `${out.join("\n")}${RESET}\n`;
}
