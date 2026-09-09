import {
  $,
  $$,
  clampWindow,
  closeWindow,
  fit,
  front,
  loadApp,
  maybe,
  openProject,
  openWindow,
  syncWindows,
  t,
  toast,
  windows,
} from "./desktop/core";
import { init as initMenubar } from "./desktop/menubar";
import { init as initWidgets } from "./desktop/widgets";

/** Desktop shell: window chrome, the dock, Spotlight, appearance and routing.
 *  Each app's own behaviour lives in ./desktop/* and is imported the first time
 *  its window opens. */

// ---------------------------------------------------------------------------
// Window chrome
// ---------------------------------------------------------------------------

const MOBILE = 650;

for (const [id, win] of windows) {
  win.addEventListener("pointerdown", () => front(win));

  $$<HTMLButtonElement>("[data-window-action]", win).forEach((button) =>
    button.addEventListener("click", () => {
      switch (button.dataset.windowAction) {
        case "close":
        case "minimize":
          closeWindow(id, button.dataset.windowAction === "minimize");
          break;
        case "maximize":
          win.dataset.maximized = String(win.dataset.maximized !== "true");
          break;
        case "center":
          win.dataset.maximized = "false";
          win.style.left = `${Math.max(8, (innerWidth - win.offsetWidth) / 2)}px`;
          win.style.top = "30px";
          fit(win);
          break;
      }
    }),
  );

  maybe("[data-drag-handle]", win)?.addEventListener("dblclick", (event) => {
    if ((event.target as HTMLElement).closest("button")) return;
    win.dataset.maximized = String(win.dataset.maximized !== "true");
  });

  for (const kind of ["drag", "resize"] as const) {
    const handle = maybe(`[data-${kind}-handle]`, win);
    if (!handle) continue;

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || innerWidth <= MOBILE || win.dataset.maximized === "true" || (kind === "drag" && (event.target as HTMLElement).closest("button"))) return;

      event.preventDefault();
      front(win);

      const startX = event.clientX;
      const startY = event.clientY;
      const rect = win.getBoundingClientRect();
      const parent = $(".desktop-workspace").getBoundingClientRect();

      handle.setPointerCapture(event.pointerId);
      document.body.classList.add("window-dragging");

      const move = (e: PointerEvent) => {
        const size = clampWindow(
          kind === "drag" ? rect.left + e.clientX - startX : rect.left,
          kind === "drag" ? rect.top - parent.top + e.clientY - startY : rect.top - parent.top,
          kind === "resize" ? rect.width + e.clientX - startX : rect.width,
          kind === "resize" ? rect.height + e.clientY - startY : rect.height,
          innerWidth,
          innerHeight - parent.top,
        );

        Object.assign(win.style, {
          left: `${size.x}px`,
          top: `${size.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        });
      };

      const end = () => {
        document.body.classList.remove("window-dragging");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        handle.removeEventListener("lostpointercapture", end);
      };

      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
      handle.addEventListener("lostpointercapture", end);
    });
  }

  // The resize corner is a button, so it has to work from the keyboard too.
  maybe("[data-resize-handle]", win)?.addEventListener("keydown", (event) => {
    if (!event.key.startsWith("Arrow")) return;

    event.preventDefault();
    const step = event.shiftKey ? 50 : 15;
    win.style.width = `${win.offsetWidth + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0)}px`;
    win.style.height = `${win.offsetHeight + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0)}px`;
    fit(win);
  });
}

window.addEventListener("resize", () => {
  windows.forEach(fit);
  syncWindows();
});

maybe("[data-reset-windows]")?.addEventListener("click", () => {
  windows.forEach((win) => {
    ["left", "top", "width", "height"].forEach((property) => win.style.removeProperty(property));
    win.dataset.maximized = "false";
  });
  toast(t("Windows are back where they started.", "Die Fenster sind wieder dort, wo sie angefangen haben."));
});

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

function showServices() {
  openWindow("welcome");
  maybe("#desktop-services")?.scrollIntoView({ block: "start", behavior: "instant" });
}

function applyHash() {
  const hash = location.hash.slice(1);

  if (hash.startsWith("project=")) openProject(hash.slice(8), undefined, false);
  else if (hash.startsWith("app=")) openWindow(hash.slice(4), undefined, false);
  else if (hash === "projects") openWindow("finder", undefined, false);
  else if (hash === "contact") openWindow("contact", undefined, false);
  else if (hash === "oeffigo") openProject("oeffigo", undefined, false);
  else if (hash === "services") showServices();
  else if (!hash || hash === "about") openWindow("welcome", undefined, false);
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest<HTMLElement>("[data-open]");
  if (trigger) {
    // A modified click on a real link is the visitor asking for a new tab.
    if (trigger instanceof HTMLAnchorElement && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;

    event.preventDefault();
    if (trigger.dataset.open === "project") openProject(trigger.dataset.project || "", trigger);
    else openWindow(trigger.dataset.open!, trigger);
  }

  if (event.target.closest("[data-welcome-section]")) showServices();
});

window.addEventListener("popstate", applyHash);
window.addEventListener("hashchange", applyHash);

// ---------------------------------------------------------------------------
// Spotlight
// ---------------------------------------------------------------------------

const spotlight = maybe<HTMLDialogElement>(".spotlight");
const spotlightInput = maybe<HTMLInputElement>("[data-spotlight-search]");

function searchSpotlight() {
  if (!spotlightInput) return;

  const query = spotlightInput.value.trim().toLowerCase();
  let count = 0;

  $$("[data-spotlight-item]").forEach((el) => {
    el.hidden = !el.dataset.spotlightItem!.includes(query);
    if (!el.hidden) count++;
  });

  const empty = maybe("[data-spotlight-empty]");
  if (empty) empty.hidden = count > 0;
}

function toggleSpotlight() {
  if (!spotlight || !spotlightInput) return;

  if (spotlight.open) {
    spotlight.close();
    return;
  }

  spotlight.showModal();
  spotlightInput.value = "";
  searchSpotlight();
  spotlightInput.focus();
}

if (spotlight && spotlightInput) {
  $$("[data-spotlight-toggle]").forEach((button) => button.addEventListener("click", toggleSpotlight));
  spotlightInput.addEventListener("input", searchSpotlight);

  spotlight.addEventListener("click", (event) => {
    if (event.target === spotlight) spotlight.close();
  });

  spotlight.addEventListener("keydown", (event) => {
    const items = $$<HTMLButtonElement>("[data-spotlight-item]").filter((el) => !el.hidden);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }

    if (event.key === "Enter" && document.activeElement === spotlightInput) {
      event.preventDefault();
      items[0]?.click();
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      toggleSpotlight();
    }
  });
}

// ---------------------------------------------------------------------------
// Appearance
// ---------------------------------------------------------------------------

type Preferences = { theme: "light" | "dark"; wallpaper: string };

const WALLPAPERS = ["dawn", "styria", "ink"];
const PREFERENCES_KEY = "jg-desktop-preferences";

let preferences: Preferences = { theme: "light", wallpaper: "dawn" };

try {
  const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
  preferences = {
    theme: stored.theme === "dark" ? "dark" : "light",
    wallpaper: WALLPAPERS.includes(stored.wallpaper) ? stored.wallpaper : "dawn",
  };
} catch {
  /* Defaults are usable even when storage is blocked. */
}

function applyPreferences(save = false) {
  const root = document.documentElement;
  root.dataset.desktopTheme = preferences.theme;
  root.dataset.theme = preferences.theme;
  root.dataset.wallpaper = preferences.wallpaper;

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", preferences.theme === "dark" ? "#242529" : "#eef0f3");

  $$<HTMLButtonElement>("button[data-desktop-theme]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.desktopTheme === preferences.theme)));
  $$<HTMLButtonElement>("button[data-wallpaper]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.wallpaper === preferences.wallpaper)));

  if (!save) return;

  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    toast(t("This applies for the visit; storage is blocked.", "Das gilt für diesen Besuch; der Speicher ist blockiert."));
  }
}

$$<HTMLButtonElement>("button[data-desktop-theme]").forEach((button) =>
  button.addEventListener("click", () => {
    preferences.theme = button.dataset.desktopTheme as Preferences["theme"];
    applyPreferences(true);
  }),
);

$$<HTMLButtonElement>("button[data-wallpaper]").forEach((button) =>
  button.addEventListener("click", () => {
    preferences.wallpaper = button.dataset.wallpaper!;
    applyPreferences(true);
  }),
);

applyPreferences();

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

initMenubar();
initWidgets();
syncWindows();

// The Finder catalogue is server-rendered, so its module is needed as soon as
// anyone searches — including from Spotlight, which can open a project directly.
void loadApp("finder");

// The desktop widget shows my last commit, which means the workshop feed is
// needed whether or not its window is ever opened. It waits for an idle moment
// so it never competes with the first paint.
const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 600));
idle(() => void loadApp("workshop"));

if (location.hash) applyHash();
else if (document.body.dataset.initialProject) openProject(document.body.dataset.initialProject, undefined, false);
