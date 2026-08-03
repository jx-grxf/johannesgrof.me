/**
 * Renders the brand assets in public/ from the templates next to this file.
 *
 *   npm run brand
 *
 * Headless Chrome does the typesetting, which keeps Geist and Geist Mono exact
 * without pulling a rasteriser into the dependency tree. Everything is drawn at
 * 2x and downsampled with sips, so the hairlines and the tight display tracking
 * stay clean. Nothing here runs during `astro build`; the outputs are committed.
 *
 * The favicon is not rendered — it ships as vector (public/favicon.svg). This
 * script reads the mark out of it so the app icons cannot drift from it.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const PUBLIC = join(ROOT, "public");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const FONTS = [
  {
    family: "Geist Card",
    file: "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  },
  {
    family: "Geist Mono Card",
    file: "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  },
];

/**
 * `render` is the window Chrome draws into, `outputs` the files sips scales it
 * down to. The two are separate because headless Chrome clamps small windows to
 * a minimum and then captures only the top-left corner of the larger layout —
 * asking it for a 180px tile directly returns a crop, not an icon. Everything
 * is drawn at 512 or larger and scaled down.
 *
 * @type {{ template: string, query?: string, render: [number, number], outputs: [string, number][] }[]}
 */
const TARGETS = [
  { template: "card.html", render: [1200, 630], outputs: [["og-card.png", 1200]] },
  { template: "card.html", query: "lang=de", render: [1200, 630], outputs: [["og-card-de.png", 1200]] },
  // Both manifest icons come off one pass at the maskable-safe coverage, so
  // they cannot disagree. site.webmanifest declares 512 as `any` + `maskable`.
  {
    template: "icon.html",
    query: "coverage=0.58",
    render: [512, 512],
    outputs: [
      ["icon-512.png", 512],
      ["icon-192.png", 192],
    ],
  },
  // iOS rounds the tile instead of cropping into it, so the mark runs wider.
  { template: "icon.html", query: "coverage=0.68", render: [512, 512], outputs: [["apple-touch-icon.png", 180]] },
];

const chrome = CHROME_CANDIDATES.find((path) => existsSync(path));

if (!chrome) {
  console.error("No Chrome or Chromium found. Looked in:\n  " + CHROME_CANDIDATES.join("\n  "));
  process.exit(1);
}

/** Inline @font-face rules so the templates make no network or file:// request. */
const fontFaces = FONTS.map(({ family, file }) => {
  const data = readFileSync(join(ROOT, file)).toString("base64");

  return `@font-face {
        font-family: "${family}";
        font-style: normal;
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${data}) format("woff2");
      }`;
}).join("\n\n      ");

/** The mark itself, straight out of the committed favicon. */
const favicon = readFileSync(join(PUBLIC, "favicon.svg"), "utf8");
const mark = favicon.match(/<g fill="var\(--mark\)"[\s\S]*?<\/g>/);

if (!mark) {
  console.error("Could not find the mark <g> in public/favicon.svg.");
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "brand-"));

try {
  for (const { template, query, render, outputs } of TARGETS) {
    const [width, height] = render;
    // replaceAll, not replace: the templates mention their own placeholders in
    // the comments above them, and a first-match swap would land there instead.
    const html = readFileSync(join(HERE, template), "utf8")
      .replaceAll("__FONTS__", fontFaces)
      .replaceAll("__MARK__", mark[0]);

    const slug = outputs[0][0];
    const page = join(work, `${slug}.html`);
    const shot = join(work, slug);
    writeFileSync(page, html);

    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=2",
        `--window-size=${width},${height}`,
        // The inline script and the data-URI fonts settle well inside this;
        // without it Chrome occasionally shoots before the first layout.
        "--virtual-time-budget=3000",
        `--screenshot=${shot}`,
        `file://${page}${query ? `?${query}` : ""}`,
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );

    for (const [name, target] of outputs) {
      const destination = join(PUBLIC, name);
      execFileSync("sips", ["-Z", String(target), shot, "--out", destination], { stdio: "ignore" });
      const { size: bytes } = statSync(destination);
      console.log(`${destination.replace(`${ROOT}/`, "")}  ${target}px  ${(bytes / 1024).toFixed(1)} KB`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
