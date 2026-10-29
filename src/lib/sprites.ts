// Pixel sprites as text grids: each character is one pixel, "." is transparent.
// Shared by components/PixelSprite.astro (inline SVG) and scripts/halloween.ts,
// which paints the same grids onto a canvas. K, S and R are theme tokens.
export const palette: Record<string, string> = {
  K: "var(--ink)",
  S: "var(--paper)",
  R: "var(--signal)",
  B: "#3456e0",
  Y: "#ffcc4d",
  O: "#e0832a",
  o: "#b8621a",
  G: "#5b8c32",
  L: "#a8e22a",
  l: "#7fae16",
  W: "#ece8dc",
  w: "#bdb8aa",
  D: "#2a2722",
  g: "#1f3b1a",
  F: "#fff6c8",
  N: "#4a443a",
  n: "#34302a",
  y: "#8a6a24",
  T: "#a39d8f",
  t: "#6e6a5f",
};


// The train front faces right, because it drives left to right. Each letter in
// `windows` fills one of the five windows.
const car = (body: string, shade: string, front = false, windows = "YYYYY") => {
  const row = `${body}${body}${[...windows].map((w) => `${w}${w}${w}${body}`).join("")}`;
  return [
    `.${body.repeat(front ? 22 : 24)}${front ? "...." : "."}`,
    `${body.repeat(front ? 24 : 26)}${front ? ".." : ""}`,
    `${row}${front ? `${body}${body}${body}YY${body}.` : `${body}${body}${body}${body}`}`,
    `${row}${front ? `${body}${body}${body}YYY${body}` : `${body}${body}${body}${body}`}`,
    `${body.repeat(front ? 27 : 26)}${front ? "Y" : ""}`,
    `${shade.repeat(front ? 28 : 26)}`,
    `.DD....DD.......DD....DD.${front ? "..." : "."}`,
  ];
};

export const sprites = {
  terminal: [
    "RRRRRRRRRRRR",
    "RSRSRSRRRRRR",
    "RRRRRRRRRRRR",
    "KKKKKKKKKKKK",
    "KKSKKKKKKKKK",
    "KKKSKKKKKKKK",
    "KKSKKCCKKKKK",
    "KKKKKKKKKKKK",
  ],
  mac: [
    "KKKKKKKKKKKK",
    "KBBBBBBBBBBK",
    "KBYYBBBBBBBK",
    "KBBBBBBBBBBK",
    "KBBBBBBBBBBK",
    "KBBBBBBBBBBK",
    "KKKKKKKKKKKK",
    ".....KK.....",
    "...KKKKKK...",
  ],
  happymac: [
    "KKKKKKKKKKKK",
    "KWWWWWWWWWWK",
    "KWWDWWWWDWWK",
    "KWWWWWDWWWWK",
    "KWWDWWWWDWWK",
    "KWWWDDDDWWWK",
    "KKKKKKKKKKKK",
    ".....KK.....",
    "...KKKKKK...",
  ],
  oil: [
    "...DD...",
    "...gg...",
    "...gg...",
    "..gggg..",
    ".gggggg.",
    ".gYYYYg.",
    ".gYOOYg.",
    ".gYYYYg.",
    ".gggggg.",
    ".gggggg.",
  ],
  star: [".F.", "FFF", ".F."],
  heart: [".RR.RR.", "RRRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."],
  buffer: [
    "RRWWRRWWRR",
    "RRWWRRWWRR",
    "..DD..DD..",
    "..DD..DD..",
    ".DDDDDDDD.",
    "DDDDDDDDDD",
  ],
  pumpkin: [
    "....G....",
    "...GG....",
    ".OOOOOOO.",
    "OOOoOOoOO",
    "OOOoOOoOO",
    "OOOoOOoOO",
    ".OOOOOOO.",
  ],
  jackolantern: [
    "....G....",
    "...GG....",
    ".OOOOOOO.",
    "OQQOOOQQO",
    "OOOOQOOOO",
    "OQQQQQQQO",
    ".OQOQOQO.",
  ],
  ghost: [
    "...wwww...",
    "..wWWWWw..",
    ".wWWWWWWw.",
    ".wWDWWDWw.",
    ".wWDWWDWw.",
    ".wWWWWWWw.",
    ".wWWDDWWw.",
    ".wWWWWWWw.",
    ".wWWWWWWw.",
    ".ww.ww.ww.",
  ],
  // Hang from the frame lines on their threads (scripts/halloween.ts).
  spider: [
    ".K.......K.",
    "..K.KKK.K..",
    "K..KKKKK..K",
    ".KKKRKRKKK.",
    "...KKKKK...",
    ".KK.KKK.KK.",
    "K...KKK...K",
    "...K...K...",
  ],
  grave: [
    "...ttttttt...",
    ".ttTTTTTTTtt.",
    ".tTTTTTTTTTt.",
    "tTTTTTTTTTTTt",
    "tTDDTTDTDDTTt",
    "tTDTDTDTDTDTt",
    "tTDDTTDTDDTTt",
    "tTDTDTDTDTTTt",
    "tTDTDTDTDTTTt",
    "tTTTTTTTTTTTt",
    "tTTTTTTTTTTTt",
    "tTTTTTTTTTTTt",
    "gGGgGGGGgGGGg",
  ],
  // The same three cars after dark: ghosts and one dim lamp behind the windows.
  ghosttrain: (() => {
    const cars = [car("N", "n", false, "WDyDW"), car("N", "n", false, "DyWDD"), car("G", "g", true, "yWDyD")];
    return cars[0].map((_, row) => cars.map((c) => c[row]).join("."));
  })(),
  train: (() => {
    const cars = [car("W", "w"), car("W", "w"), car("L", "l", true)];
    return cars[0].map((_, row) => cars.map((c) => c[row]).join("."));
  })(),
} as const;

export type SpriteName = keyof typeof sprites;
