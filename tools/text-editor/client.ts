// Dev-only text editor for the site's copy. Text is edited in place on the
// page, attributes and meta in the side panel. "Übernehmen" sends everything
// to the dev server, which writes it into src/ where the source is
// unambiguous and parks the rest in .local/text-edits.json. See integration.mjs.

interface Unit {
  el: HTMLElement;
  html: string;
  text: string;
  nodes: Map<Text, string>;
}

interface Field {
  el: Element;
  attr: string;
  label: string;
  before: string;
}

interface Edit {
  from: string;
  to: string;
  context: string;
}

interface LogEntry extends Edit {
  at: string;
  status: "applied" | "pending";
  reason?: string;
  file?: string;
}

const ENDPOINT = "/__text-editor";
const STATE_KEY = "text-editor:on";
const NOTICE_KEY = "text-editor:notice";
const TEXT = "#text";
const ATTRIBUTES = ["alt", "aria-label", "placeholder", "title"];

// Filled or rewritten by scripts at runtime, so there is no source to edit.
const SKIP = [
  "head", "script", "style", "noscript", "svg", "template", "input", "textarea", "select", "option",
  "time", "[data-clock]", "[data-departures-rows]", "[data-departures-status]", "[data-departures-clock]",
  "[data-no-edit]", ".te-root",
].join(",");

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

const storage = {
  get: (key: string) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch {
      // Without storage the editor just starts closed after a reload.
    }
  },
};

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {}, ...children: (Node | string)[]) => {
  const { class: className, ...rest } = props;
  const el = Object.assign(document.createElement(tag), rest);
  if (className) el.className = className;
  el.append(...children);
  return el;
};

const css = `
:root { --te-w: 360px; }
.te-root { font: 400 13px/1.45 var(--font-sans, system-ui, sans-serif); color: var(--ink, #f1eee5); }
.te-root * { box-sizing: border-box; }
.te-root button { font: 500 12px/1 var(--font-mono, ui-monospace, monospace); letter-spacing: 0.02em; color: inherit; background: transparent;
  border: 1px solid var(--rule-2, #544d40); padding: 0 12px; min-height: 32px; cursor: pointer; transition: border-color 0.12s, background 0.12s; }
.te-root button:hover:not(:disabled) { border-color: var(--ink-2, #c6c0b2); }
.te-root button:disabled { opacity: 0.4; cursor: default; }
.te-root button.te-primary { background: var(--signal, #ff6a4d); border-color: var(--signal, #ff6a4d); color: var(--paper, #12110f); }
.te-root button:focus-visible, .te-root input:focus-visible, .te-root textarea:focus-visible { outline: 2px solid var(--signal, #ff6a4d); outline-offset: 2px; }

.te-root .te-launch { position: fixed; left: 16px; bottom: 16px; z-index: 2147483000; background: var(--paper-2, #191713); }
.te-on .te-launch { display: none; }

.te-panel { position: fixed; inset: 0 0 0 auto; width: var(--te-w); z-index: 2147483000; display: none; flex-direction: column;
  background: var(--paper-2, #191713); border-left: 1px solid var(--rule-2, #544d40); }
.te-on .te-panel { display: flex; }
.te-on body { margin-right: var(--te-w); }
/* The site's frame lines are fixed to the viewport; keep them on the narrowed page. */
.te-on body::after { left: calc(50% - var(--te-w) / 2); width: min(1180px, calc(100% - var(--te-w) - 64px)); }
.te-head { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--rule, #3b352c); }
.te-head strong { font-weight: 600; }
.te-path { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--mute, #948d7e);
  font: 400 12px/1 var(--font-mono, ui-monospace, monospace); }
.te-body { flex: 1; overflow-y: auto; overscroll-behavior: contain; }
.te-section { padding: 14px 16px 16px; border-bottom: 1px solid var(--rule, #3b352c); }
.te-label { display: flex; justify-content: space-between; gap: 8px; margin: 0 0 10px; color: var(--mute, #948d7e);
  font: 500 11px/1 var(--font-mono, ui-monospace, monospace); letter-spacing: 0.12em; text-transform: uppercase; }
.te-label > span { letter-spacing: 0; font-variant-numeric: tabular-nums; }
.te-hint { margin: 0; color: var(--mute, #948d7e); }
.te-hint kbd { font: 500 11px/1 var(--font-mono, ui-monospace, monospace); padding: 2px 4px; border: 1px solid var(--rule-2, #544d40); }
.te-field { display: grid; gap: 4px; margin-top: 10px; }
.te-field > span { color: var(--ink-2, #c6c0b2); font: 400 11px/1.2 var(--font-mono, ui-monospace, monospace); }
.te-field input, .te-field textarea { width: 100%; font: inherit; color: var(--ink, #f1eee5); background: var(--paper, #12110f);
  border: 1px solid var(--rule-2, #544d40); padding: 7px 9px; resize: vertical; }
.te-field[data-changed] input, .te-field[data-changed] textarea { border-color: var(--signal, #ff6a4d); }
.te-meta { margin: 8px 0 0; color: var(--mute, #948d7e); font: 400 11px/1.3 var(--font-mono, ui-monospace, monospace); font-variant-numeric: tabular-nums; }
.te-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.te-change { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: start; }
.te-change > button:first-child { all: unset; cursor: pointer; display: grid; gap: 3px; min-width: 0; }
.te-change > button:first-child:focus-visible { outline: 2px solid var(--signal, #ff6a4d); }
.te-change small { color: var(--mute, #948d7e); font: 400 11px/1.2 var(--font-mono, ui-monospace, monospace); }
.te-change del, .te-change ins { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-decoration: none; }
.te-change del { color: var(--mute, #948d7e); text-decoration: line-through; text-decoration-color: var(--rule-2, #544d40); }
.te-change ins { color: var(--ink, #f1eee5); }
.te-change > button:last-child { min-height: 28px; padding: 0 8px; }
.te-log li:not(.te-hint) { display: grid; grid-template-columns: 16px 1fr; gap: 6px; }
.te-log b { font: 600 12px/1.45 var(--font-mono, ui-monospace, monospace); }
.te-log [data-status="applied"] b { color: var(--ink-2, #c6c0b2); }
.te-log [data-status="pending"] b { color: var(--signal, #ff6a4d); }
.te-log p { margin: 0; overflow-wrap: anywhere; }
.te-foot { display: grid; gap: 8px; padding: 12px 16px 16px; border-top: 1px solid var(--rule, #3b352c); }
.te-foot div { display: flex; gap: 8px; }
.te-foot button.te-primary { flex: 1; }
.te-status { margin: 0; min-height: 1.45em; color: var(--ink-2, #c6c0b2); }

/* A quiet map of everything editable; the signal colour marks hover, focus and changes. */
.te-on .te-unit { cursor: text; outline: 1px dashed var(--rule, #3b352c); outline-offset: 3px; }
.te-on .te-unit:hover, .te-on [data-te-selected] { outline: 1px dashed var(--signal-line, rgb(255 106 77 / 42%)); outline-offset: 3px; }
.te-on .te-unit:focus { outline: 1px solid var(--signal, #ff6a4d); }
.te-on [data-te-changed] { outline: 1px solid var(--signal-line, rgb(255 106 77 / 42%)); outline-offset: 3px; }
.te-on [data-te-pending] { outline: 1px dashed var(--signal, #ff6a4d); outline-offset: 3px; }

@media (max-width: 900px) {
  :root { --te-w: 0px; }
  .te-panel { inset: auto 0 0 0; width: auto; height: 55vh; border-left: 0; border-top: 1px solid var(--rule-2, #544d40); }
  .te-on body { margin-bottom: 55vh; }
}
@media (prefers-reduced-motion: reduce) { .te-root button { transition: none; } }
`;

const units: Unit[] = [];
const fields: Field[] = [];
let active = false;
let selected: Element | null = null;
let saving = false;

const fieldValue = (field: Field) =>
  field.attr === TEXT ? field.el.textContent ?? "" : field.el.getAttribute(field.attr) ?? "";

const setFieldValue = (field: Field, value: string) => {
  if (field.attr === TEXT) field.el.textContent = value;
  else field.el.setAttribute(field.attr, value);
};

const fieldFor = (el: Element, attr: string, label: string) => {
  let field = fields.find((f) => f.el === el && f.attr === attr);
  if (!field) {
    field = { el, attr, label, before: attr === TEXT ? el.textContent ?? "" : el.getAttribute(attr) ?? "" };
    fields.push(field);
  }
  return field;
};

// The element someone means when they click a word: inline wrappers (links,
// spans, strong) belong to the paragraph or heading around them.
const unitFor = (el: HTMLElement): HTMLElement => {
  let current = el;
  while (
    current.parentElement &&
    current.parentElement !== document.body &&
    getComputedStyle(current).display === "inline" &&
    !current.closest("a.button, button")
  ) {
    current = current.parentElement;
  }
  return current;
};

const textNodes = (el: Element) => {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
};

const snapshot = (unit: Unit) => {
  unit.text = normalize(unit.el.textContent ?? "");
  unit.html = unit.el.innerHTML;
  unit.nodes = new Map(textNodes(unit.el).map((node) => [node, node.data]));
};

const collectUnits = () => {
  const found = new Set<HTMLElement>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement;
    if (!parent || !normalize(walker.currentNode.textContent ?? "") || parent.closest(SKIP)) continue;
    found.add(unitFor(parent));
  }
  const list = [...found];
  for (const el of list) {
    if (list.some((other) => other !== el && other.contains(el))) continue;
    el.classList.add("te-unit");
    const unit = { el, html: "", text: "", nodes: new Map() };
    snapshot(unit);
    units.push(unit);
  }
};

const unitChanged = (unit: Unit) => normalize(unit.el.textContent ?? "") !== unit.text;

const editsFor = (unit: Unit): Edit[] => {
  const now = normalize(unit.el.textContent ?? "");
  if (now === unit.text) return [];

  // Prefer the changed text nodes: each one usually maps to a single string
  // in the source, while the whole element is often stitched from several.
  const sameNodes =
    textNodes(unit.el).every((node) => unit.nodes.has(node) || !normalize(node.data)) &&
    [...unit.nodes].every(([node, before]) => unit.el.contains(node) || !normalize(before));
  if (!sameNodes) return [{ from: unit.text, to: now, context: unit.text }];

  const edits: Edit[] = [];
  for (const [node, before] of unit.nodes) {
    const after = unit.el.contains(node) ? node.data : "";
    if (normalize(before) !== normalize(after)) edits.push({ from: normalize(before), to: normalize(after), context: unit.text });
  }
  return edits;
};

const revertUnit = (unit: Unit) => {
  unit.el.innerHTML = unit.html;
  unit.nodes = new Map(textNodes(unit.el).map((node) => [node, node.data]));
  unit.el.removeAttribute("data-te-pending");
};

const root = h("div", { class: "te-root" });
const launch = h("button", { type: "button", class: "te-launch", textContent: "Texte bearbeiten" });

const selectionBody = h("div");
const pageBody = h("div");
const changesCount = h("span");
const changesList = h("ol", { class: "te-list" });
const logList = h("ol", { class: "te-list te-log" });
const pendingCount = h("span");
const saveButton = h("button", { type: "button", class: "te-primary", textContent: "Übernehmen  ⌘S" });
const discardButton = h("button", { type: "button", textContent: "Alles verwerfen" });
const closeButton = h("button", { type: "button", textContent: "Fertig" });
const statusLine = h("p", { class: "te-status", role: "status" } as Partial<HTMLParagraphElement>);

const section = (title: string, count: Node | null, ...children: Node[]) =>
  h("section", { class: "te-section" }, h("h2", { class: "te-label" }, title, ...(count ? [count] : [])), ...children);

const panel = h(
  "aside",
  { class: "te-panel", ariaLabel: "Texteditor" },
  h("header", { class: "te-head" }, h("strong", { textContent: "Texteditor" }), h("span", { class: "te-path", textContent: location.pathname }), closeButton),
  h(
    "div",
    { class: "te-body" },
    section("Auswahl", null, selectionBody),
    section("Seite", null, pageBody),
    section("Änderungen", changesCount, changesList),
    section("Verlauf", pendingCount, logList),
  ),
  h("footer", { class: "te-foot" }, h("div", {}, saveButton, discardButton), statusLine),
);
root.append(launch, panel);

const describe = (el: Element) => {
  const tag = el.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag)) return `Überschrift ${tag.slice(1)}`;
  if (el.matches("a.button, button")) return "Button";
  if (tag === "a") return "Link";
  if (tag === "p") return "Absatz";
  if (tag === "li") return "Listenpunkt";
  if (tag === "img") return "Bild";
  if (tag === "title") return "Seitentitel";
  if (tag === "meta") return "Description";
  return `<${tag}>`;
};

const counter = (text: string) => {
  const words = normalize(text).split(" ").filter(Boolean).length;
  return `${normalize(text).length} Zeichen · ${words} ${words === 1 ? "Wort" : "Wörter"}`;
};

const fieldInput = (field: Field, multiline: boolean) => {
  const input = document.createElement(multiline ? "textarea" : "input");
  input.value = fieldValue(field);
  const wrap = h("label", { class: "te-field" }, h("span", { textContent: field.label }), input);
  const meta = h("p", { class: "te-meta", textContent: counter(input.value) });
  wrap.append(meta);
  wrap.toggleAttribute("data-changed", fieldValue(field) !== field.before);
  input.addEventListener("input", () => {
    setFieldValue(field, input.value);
    meta.textContent = counter(input.value);
    wrap.toggleAttribute("data-changed", input.value !== field.before);
    renderChanges();
  });
  return wrap;
};

const renderSelection = () => {
  selectionBody.replaceChildren();
  if (!selected) {
    selectionBody.append(
      h("p", { class: "te-hint" }, "Klick auf einen Text und schreib los. ", h("kbd", { textContent: "↵" }), " fertig, ",
        h("kbd", { textContent: "esc" }), " zurück, ", h("kbd", { textContent: "⌥" }), "-Klick folgt einem Link."),
    );
    return;
  }
  const unit = units.find((u) => u.el === selected);
  selectionBody.append(h("p", { class: "te-hint", textContent: describe(selected) }));
  if (unit) selectionBody.append(h("p", { class: "te-meta", textContent: counter(unit.el.textContent ?? "") }));

  const carriers = [selected, ...selected.querySelectorAll(ATTRIBUTES.map((a) => `[${a}]`).join(","))].slice(0, 8);
  for (const el of carriers) {
    for (const attr of ATTRIBUTES) {
      if (!el.hasAttribute(attr)) continue;
      const where = el === selected ? "" : ` · ${describe(el)}`;
      selectionBody.append(fieldInput(fieldFor(el, attr, `${attr}${where}`), false));
    }
  }
};

const renderPage = () => {
  pageBody.replaceChildren();
  const title = document.querySelector("title");
  const description = document.querySelector('meta[name="description"]');
  if (title) pageBody.append(fieldInput(fieldFor(title, TEXT, "Seitentitel"), false));
  if (description) pageBody.append(fieldInput(fieldFor(description, "content", "Description"), true));
};

const changeItem = (kind: string, before: string, after: string, onJump: () => void, onRevert: () => void) => {
  const jump = h("button", { type: "button" }, h("small", { textContent: kind }), h("del", { textContent: normalize(before) || "–" }), h("ins", { textContent: normalize(after) || "–" }));
  const revert = h("button", { type: "button", textContent: "↺", title: "Zurücksetzen", ariaLabel: "Zurücksetzen" });
  jump.addEventListener("click", onJump);
  revert.addEventListener("click", onRevert);
  return h("li", { class: "te-change" }, jump, revert);
};

const changedFields = () => fields.filter((field) => fieldValue(field) !== field.before);

const renderChanges = () => {
  const changedUnits = units.filter(unitChanged);
  for (const unit of units) unit.el.toggleAttribute("data-te-changed", unitChanged(unit));
  const items = [
    ...changedUnits.map((unit) =>
      changeItem(describe(unit.el), unit.text, unit.el.textContent ?? "",
        () => {
          unit.el.scrollIntoView({ block: "center", behavior: "smooth" });
          unit.el.focus();
        },
        () => {
          revertUnit(unit);
          renderChanges();
        }),
    ),
    ...changedFields().map((field) =>
      changeItem(field.label, field.before, fieldValue(field),
        () => {
          if (field.el.isConnected && field.el instanceof HTMLElement && document.body.contains(field.el)) select(field.el);
        },
        () => {
          setFieldValue(field, field.before);
          renderSelection();
          renderPage();
          renderChanges();
        }),
    ),
  ];
  changesList.replaceChildren(...(items.length ? items : [h("li", { class: "te-hint", textContent: "Noch nichts geändert." })]));
  changesCount.textContent = String(items.length);
  saveButton.disabled = items.length === 0 || saving;
  discardButton.disabled = items.length === 0 || saving;
};

const renderLog = async () => {
  try {
    const response = await fetch(`${ENDPOINT}?page=${encodeURIComponent(location.pathname)}`);
    const { pending, recent } = (await response.json()) as { pending: number; recent: LogEntry[] };
    pendingCount.textContent = pending ? `${pending} offen` : "";
    const items = recent.map((entry) => {
      const detail = entry.status === "applied" ? `in ${entry.file}` : `offen: ${entry.reason ?? "unklar"}`;
      const item = h("li", {},
        h("b", { textContent: entry.status === "applied" ? "✓" : "…", ariaHidden: "true" }),
        h("p", {}, h("ins", { textContent: entry.to || "–" }), h("br"), h("small", { class: "te-meta", textContent: detail })));
      item.dataset.status = entry.status;
      return item;
    });
    logList.replaceChildren(...(items.length ? items : [h("li", { class: "te-hint", textContent: "Auf dieser Seite noch nichts übernommen." })]));
  } catch {
    logList.replaceChildren(h("li", { class: "te-hint", textContent: "Verlauf nicht erreichbar." }));
  }
};

const select = (el: Element | null) => {
  selected?.removeAttribute("data-te-selected");
  selected = el;
  selected?.setAttribute("data-te-selected", "");
  renderSelection();
};

async function save() {
  const changedUnits = units.filter(unitChanged);
  const changed = changedFields();
  const edits = [
    ...changedUnits.flatMap(editsFor),
    ...changed.map((field) => ({ from: field.before, to: fieldValue(field), context: field.label })),
  ];
  if (!edits.length || saving) return;

  // A written file makes the dev server reload the page, maybe before the
  // response is handled; the unload guard must not get in the way of that.
  saving = true;
  renderChanges();
  statusLine.textContent = "Wird übernommen …";

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: location.pathname, edits }),
    });
    const { results, error } = (await response.json()) as { results?: LogEntry[]; error?: string };
    if (!results) throw new Error(error ?? `HTTP ${response.status}`);

    const applied = results.filter((r) => r.status === "applied").length;
    const pending = results.filter((r) => r.status === "pending");
    const parked = (edit: Edit) => pending.some((r) => r.from === edit.from && r.to === edit.to);

    // Parked text stays on screen as typed, marked, until the source catches up.
    for (const unit of changedUnits) {
      unit.el.toggleAttribute("data-te-pending", editsFor(unit).some(parked));
      snapshot(unit);
    }
    for (const field of changed) field.before = fieldValue(field);

    const summary = [applied && `${applied} übernommen`, pending.length && `${pending.length} geparkt, die übernimmt Claude`].filter(Boolean).join(" · ");
    storage.set(NOTICE_KEY, summary);
    statusLine.textContent = summary;
    // Normally the reload ends this; if none comes, unlock again.
    if (applied) window.setTimeout(() => ((saving = false), renderChanges()), 4000);
    else saving = false;
  } catch (error) {
    saving = false;
    statusLine.textContent = `Fehler: ${error instanceof Error ? error.message : String(error)}`;
  }
  renderChanges();
  renderSelection();
  renderPage();
  void renderLog();
}

const hasChanges = () => units.some(unitChanged) || changedFields().length > 0;

const discard = () => {
  for (const unit of units.filter(unitChanged)) revertUnit(unit);
  for (const field of changedFields()) setFieldValue(field, field.before);
  renderSelection();
  renderPage();
  renderChanges();
};

const setActive = (on: boolean) => {
  active = on;
  storage.set(STATE_KEY, on ? "1" : null);
  document.documentElement.classList.toggle("te-on", on);

  if (!on) {
    for (const { el } of units) el.removeAttribute("contenteditable");
    select(null);
    return;
  }
  if (!units.length) collectUnits();
  for (const { el } of units) {
    el.contentEditable = "plaintext-only";
    if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
  }
  statusLine.textContent = storage.get(NOTICE_KEY) ?? "";
  storage.set(NOTICE_KEY, null);
  renderSelection();
  renderPage();
  renderChanges();
  void renderLog();
};

const closeEditor = async () => {
  if (hasChanges()) await save();
  setActive(false);
};

// While editing, links and buttons on the page must not fire; ⌥-click still navigates.
document.addEventListener(
  "click",
  (event) => {
    if (!active || !(event.target instanceof Element) || event.target.closest(".te-root")) return;
    const target = event.target;
    if (event.altKey && target.closest("a[href]")) {
      event.preventDefault();
      location.href = target.closest<HTMLAnchorElement>("a[href]")!.href;
      return;
    }
    if (target.closest("a, button, label, summary, .te-unit")) event.preventDefault();
    select(target.closest(".te-unit") ?? target.closest("img, input, textarea, select, [aria-label]") ?? null);
  },
  true,
);

document.addEventListener("focusin", (event) => {
  if (!active || !(event.target instanceof Element)) return;
  const unit = event.target.closest(".te-unit");
  if (unit && unit !== selected) select(unit);
});

document.addEventListener("keydown", (event) => {
  if (!active) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    void save();
    return;
  }
  const el = event.target instanceof Element ? event.target.closest<HTMLElement>(".te-unit") : null;
  const unit = units.find((u) => u.el === el);
  if (!el || !unit) return;
  if (event.key === "Enter") {
    event.preventDefault();
    el.blur();
  } else if (event.key === "Escape") {
    revertUnit(unit);
    el.blur();
    renderChanges();
  }
});

document.addEventListener("input", (event) => {
  if (!active || !(event.target instanceof Element) || event.target.closest(".te-root")) return;
  renderChanges();
  if (selected) renderSelection();
});

window.addEventListener("beforeunload", (event) => {
  if (active && !saving && hasChanges()) event.preventDefault();
});

launch.addEventListener("click", () => setActive(true));
closeButton.addEventListener("click", () => void closeEditor());
saveButton.addEventListener("click", () => void save());
discardButton.addEventListener("click", discard);

document.head.append(h("style", { textContent: css }));
document.body.append(root);
if (storage.get(STATE_KEY)) setActive(true);
