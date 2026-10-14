import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_EXTENSIONS = new Set([".ts", ".astro", ".md", ".mdx"]);
const QUOTES = new Set(['"', "'", "`"]);
// Shorter fragments match by accident far too often to replace blindly.
const MIN_LENGTH = 3;

export const normalize = (text) => text.replace(/\s+/g, " ").trim();

const escapeRegExp = (char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The page shows rendered text; the source may hold the same words escaped
// for a JS string, as an HTML entity, or wrapped across lines in markup.
export const sourcePattern = (text) => {
  const parts = [];
  for (const char of normalize(text)) {
    if (char === " ") parts.push("\\s+");
    else if (QUOTES.has(char)) parts.push(`\\\\?${escapeRegExp(char)}`);
    else if (char === "&") parts.push("(?:&amp;|&)");
    else parts.push(escapeRegExp(char));
  }
  return new RegExp(parts.join(""), "gu");
};

const frontmatterEnd = (source) => {
  const match = /^---\r?\n[\s\S]*?\r?\n---/.exec(source);
  return match ? match[0].length : 0;
};

// Which string literal (if any) the offset sits in, judged by the unescaped
// quotes between the start of its line and the offset.
const stringDelimiterAt = (source, offset) => {
  const lineStart = source.lastIndexOf("\n", offset - 1) + 1;
  let open = null;
  for (let i = lineStart; i < offset; i += 1) {
    const char = source[i];
    if (char === "\\") {
      i += 1;
      continue;
    }
    if (open === null && QUOTES.has(char)) open = char;
    else if (char === open) open = null;
  }
  return open;
};

const escapeForString = (text, quote) => {
  let escaped = text.replace(/\\/g, "\\\\").replaceAll(quote, `\\${quote}`);
  if (quote === "`") escaped = escaped.replace(/\$\{/g, "\\${");
  return escaped;
};

const astroMarkupIsSafe = (text) => !/[<>{}]/.test(text);

/**
 * Works out how `to` would be written over the single place `from` occurs.
 * Returns null with a reason when it can't be done without guessing.
 */
export const planReplacement = (fileName, source, from, to) => {
  const pattern = sourcePattern(from);
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) return { matches: matches.length };

  const [match] = matches;
  const start = match.index;
  const end = start + match[0].length;
  const ext = path.extname(fileName);
  const quote = stringDelimiterAt(source, start);
  const replacement = normalize(to);

  const inAstroMarkup = ext === ".astro" && start >= frontmatterEnd(source);
  if (quote && inAstroMarkup) {
    // Could be an HTML attribute or a JS string inside {…}; the two escape
    // differently, so only take text that needs no escaping at all.
    if (replacement.includes(quote) || replacement.includes("\\")) {
      return { matches: 1, reason: `Neuer Text enthält ${quote} in einem Attribut oder Ausdruck` };
    }
    return { matches: 1, start, end, text: replacement };
  }
  if (quote) return { matches: 1, start, end, text: escapeForString(replacement, quote) };
  if (inAstroMarkup) {
    if (!astroMarkupIsSafe(replacement)) return { matches: 1, reason: "Neuer Text enthält < > { } im Markup" };
    return { matches: 1, start, end, text: replacement };
  }
  if (ext === ".md" || ext === ".mdx") return { matches: 1, start, end, text: replacement };
  return { matches: 1, reason: "Fundstelle liegt nicht in einem String" };
};

const listSourceFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name));
};

/** Applies one edit to the sources under `srcDir`, or explains why not. */
export const applyEdit = async (srcDir, edit) => {
  const from = normalize(edit.from);
  const to = normalize(edit.to);
  if (from === to) return { status: "unchanged" };
  if (from.length < MIN_LENGTH) return { status: "pending", reason: "Zu kurz für eine sichere Zuordnung" };

  const files = await listSourceFiles(srcDir);
  const hits = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const plan = planReplacement(file, source, from, to);
    if (plan.matches > 0) hits.push({ file, source, plan });
  }

  const total = hits.reduce((sum, hit) => sum + hit.plan.matches, 0);
  if (total === 0) return { status: "pending", reason: "Text nicht im Quellcode gefunden (vermutlich zusammengesetzt oder dynamisch)" };
  if (total > 1) return { status: "pending", reason: `Text kommt ${total}× vor`, files: hits.map((hit) => path.relative(srcDir, hit.file)) };

  const [{ file, source, plan }] = hits;
  const relative = path.relative(path.dirname(srcDir), file);
  if (plan.reason) return { status: "pending", reason: plan.reason, file: relative };

  await writeFile(file, source.slice(0, plan.start) + plan.text + source.slice(plan.end));
  return { status: "applied", file: relative };
};

/** Every edit goes into the log, so pending ones can be picked up later by hand. */
export const logEdits = async (logFile, entries) => {
  await mkdir(path.dirname(logFile), { recursive: true });
  let log = [];
  try {
    log = JSON.parse(await readFile(logFile, "utf8"));
  } catch {
    log = [];
  }
  log.push(...entries);
  await writeFile(logFile, `${JSON.stringify(log, null, 2)}\n`);
};

export const readLog = async (logFile) => {
  try {
    return JSON.parse(await readFile(logFile, "utf8"));
  } catch {
    return [];
  }
};
