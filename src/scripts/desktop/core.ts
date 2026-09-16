import { clampWindow } from "@/lib/desktop";

export { clampWindow };

/** Shared state for the desktop: DOM helpers, the window registry, and the
 *  lazy-loading table that decides which app module a window needs.
 *
 *  Everything a feature module needs from its neighbours goes through here, so
 *  the modules themselves never import each other and can be code-split. */

export const $ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector)!;

export const $$ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) => [...root.querySelectorAll<T>(selector)];

/** Same selector semantics as `$`, but for the optional parts of the page: a
 *  window that is not on this route, or a widget that only exists in one locale. */
export const maybe = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector);

export const de = document.body.dataset.lang === "de";

export const t = (en: string, german: string) => (de ? german : en);

export const locale = de ? "de-AT" : "en-GB";

export const windows = new Map($$("[data-window]").map((el) => [el.dataset.window!, el] as const));

/** Which element to hand focus back to when a window closes. */
const returnFocus = new Map<string, HTMLElement>();

let topZ = 20;
let toastTimeout = 0;

export function toast(message: string) {
  const el = $(".desktop-toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    el.hidden = true;
  }, 4500);
}

export function fit(win: HTMLElement) {
  if (innerWidth <= 650 || win.hidden || win.dataset.maximized === "true") return;

  const parent = $(".desktop-workspace").getBoundingClientRect();
  const rect = win.getBoundingClientRect();
  const size = clampWindow(rect.left, rect.top - parent.top, rect.width, rect.height, innerWidth, innerHeight - parent.top);

  Object.assign(win.style, {
    left: `${size.x}px`,
    top: `${size.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
  });
}

export function syncWindows() {
  const visible = [...windows.values()].filter((w) => !w.hidden).sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));

  for (const [id, win] of windows) {
    // On a phone the windows are full-bleed and stacked, so everything behind
    // the front one has to leave the tab order as well as the screen.
    win.inert = innerWidth <= 650 && visible[0] !== win;

    $$(`[data-dock-app="${id}"]`).forEach((button) => {
      button.classList.toggle("is-running", !win.hidden || win.dataset.minimized === "true");
      button.setAttribute("aria-expanded", String(!win.hidden));
    });
  }

  // The Window menu lists what is open, so it has to be rebuilt when that changes.
  document.dispatchEvent(new CustomEvent("desktop:windowschange"));
}

export function front(win: HTMLElement, focus = false) {
  // z-index only ever grows; fold it back down before it reaches a value that
  // would sit above the menu bar and the dock.
  if (topZ > 2000) {
    [...windows.values()]
      .sort((a, b) => Number(a.style.zIndex || 0) - Number(b.style.zIndex || 0))
      .forEach((w, i) => {
        w.style.zIndex = String(i + 10);
      });
    topZ = 30;
  }

  win.style.zIndex = String(++topZ);
  syncWindows();
  if (focus) win.focus({ preventScroll: true });
}

export const NOTE_KEY = "jg-desktop-note-v1";

/** The note is restored by the shell, not by the editor module.
 *
 *  The textarea is server-rendered with a default text, and the editor module
 *  only loads when its window opens. Leaving the restore there meant a reload
 *  showed the default over a saved note until the chunk arrived — and kept
 *  showing it, editable, if the chunk never arrived at all. */
export function restoreNote() {
  const editor = maybe<HTMLTextAreaElement>("[data-editor]");
  if (!editor) return;

  try {
    const stored = localStorage.getItem(NOTE_KEY);
    if (stored !== null) editor.value = stored;
  } catch {
    /* The default text stays; the editor module reports the blocked storage. */
  }
}

/** App modules are loaded the first time their window opens, so a visitor who
 *  never touches the terminal never downloads it. */
const loaders: Record<string, () => Promise<{ init: () => void }>> = {
  editor: () => import("./editor"),
  terminal: () => import("./terminal"),
  preview: () => import("./preview"),
  workshop: () => import("./workshop"),
  finder: () => import("./projects"),
  project: () => import("./projects"),
};

const loaded = new Map<string, Promise<void>>();

export function loadApp(id: string): Promise<void> {
  const loader = loaders[id];
  if (!loader) return Promise.resolve();

  const existing = loaded.get(id);
  if (existing) return existing;

  const pending = loader()
    .then((module) => module.init())
    .catch(() => {
      // A chunk that will not load leaves the window empty rather than broken;
      // every window's content is server-rendered and still readable.
      toast(t("That part of the desktop could not load.", "Dieser Teil des Desktops konnte nicht geladen werden."));
    });

  loaded.set(id, pending);
  return pending;
}

export function openWindow(id: string, trigger?: HTMLElement, writeHistory = true) {
  const win = windows.get(id);
  if (!win) return;

  if (trigger) returnFocus.set(id, trigger);
  closeAllMenus();

  const spotlight = maybe<HTMLDialogElement>(".spotlight");
  if (spotlight?.open) spotlight.close();

  win.hidden = false;
  if (id === "widgets") $("[data-widget-host]").append($(".desktop-widgets"));
  delete win.dataset.minimized;
  fit(win);
  front(win, true);

  if (writeHistory && id !== "project" && location.hash !== `#app=${id}`) history.pushState(null, "", `#app=${id}`);

  void loadApp(id);
  document.dispatchEvent(new CustomEvent("desktop:open", { detail: { id } }));
}

export function closeWindow(id: string, minimized: boolean) {
  const win = windows.get(id);
  if (!win) return;

  win.hidden = true;
  if (id === "widgets") $(".desktop-workspace").prepend($(".desktop-widgets"));
  win.dataset.minimized = String(minimized);
  syncWindows();

  const restore = returnFocus.get(id);
  if (restore?.isConnected && !restore.closest("[hidden]") && !restore.closest("[inert]")) restore.focus({ preventScroll: true });
  else maybe(`[data-dock-app="${id}"]`)?.focus();

  if (location.hash === `#app=${id}` || (id === "project" && location.hash.startsWith("#project="))) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

/** Menus are owned by the menubar module but have to close whenever anything
 *  else takes over the screen, so the hook lives here. */
let closeAllMenus = () => {};

export function setMenuCloser(closer: () => void) {
  closeAllMenus = closer;
}

/** Set by the projects module once it is loaded; core only needs to be able to
 *  ask for a project by slug when a link or the hash names one. */
let projectOpener: ((slug: string, trigger?: HTMLElement, writeHistory?: boolean) => void) | null = null;

export function setProjectOpener(opener: typeof projectOpener) {
  projectOpener = opener;
}

export function openProject(slug: string, trigger?: HTMLElement, writeHistory = true) {
  if (projectOpener) {
    projectOpener(slug, trigger, writeHistory);
    return;
  }

  // The click that asks for a project is usually the one that loads the module.
  void loadApp("project").then(() => projectOpener?.(slug, trigger, writeHistory));
}
