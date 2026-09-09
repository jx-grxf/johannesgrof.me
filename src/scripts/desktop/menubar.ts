import { $$, closeWindow, de, maybe, setMenuCloser, t, windows } from "./core";

/** A real menu bar: menus open on click, walk with the arrow keys, close on
 *  Escape, and hand focus back where it came from. The language menu lives on
 *  the right with the other status items. */

interface Menu {
  button: HTMLButtonElement;
  list: HTMLElement;
}

const menus: Menu[] = $$<HTMLButtonElement>("[data-menu-button]").flatMap((button) => {
  const list = maybe(`#${button.getAttribute("aria-controls")}`);
  return list ? [{ button, list }] : [];
});

const items = (menu: Menu) => $$<HTMLElement>('[role="menuitem"]', menu.list).filter((el) => !el.hidden && !el.hasAttribute("disabled"));

function closeMenu(menu: Menu, restoreFocus = false) {
  if (menu.button.getAttribute("aria-expanded") !== "true") return;

  menu.button.setAttribute("aria-expanded", "false");
  menu.list.hidden = true;
  if (restoreFocus) menu.button.focus();
}

function closeAll(restoreFocus = false) {
  menus.forEach((menu) => closeMenu(menu, restoreFocus && menu.button.getAttribute("aria-expanded") === "true"));
}

function openMenu(menu: Menu, focus: "first" | "last" | "none" = "none") {
  menus.forEach((other) => other !== menu && closeMenu(other));

  menu.button.setAttribute("aria-expanded", "true");
  menu.list.hidden = false;

  const list = items(menu);
  if (focus === "first") list[0]?.focus();
  if (focus === "last") list[list.length - 1]?.focus();
}

const isOpen = (menu: Menu) => menu.button.getAttribute("aria-expanded") === "true";

/** Only one top-level button sits in the tab order; the arrow keys move within
 *  the bar, the way a menu bar is supposed to behave. */
function setRovingFocus(target: Menu) {
  menus.forEach((menu) => {
    menu.button.tabIndex = menu === target ? 0 : -1;
  });
}

function focusSibling(menu: Menu, direction: 1 | -1) {
  const index = menus.indexOf(menu);
  const next = menus[(index + direction + menus.length) % menus.length]!;
  const wasOpen = isOpen(menu);

  setRovingFocus(next);
  next.button.focus();
  // Walking sideways with a menu open switches which menu is open, as on macOS.
  if (wasOpen) openMenu(next);
  else closeAll();
}

function bindMenu(menu: Menu) {
  menu.button.addEventListener("click", (event) => {
    event.preventDefault();
    setRovingFocus(menu);
    if (isOpen(menu)) closeMenu(menu);
    else openMenu(menu);
  });

  // Pointing at another title while a menu is open slides across to it.
  menu.button.addEventListener("pointerenter", () => {
    if (menus.some(isOpen) && !isOpen(menu)) {
      setRovingFocus(menu);
      openMenu(menu);
    }
  });

  menu.button.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        openMenu(menu, "first");
        break;
      case "ArrowUp":
        event.preventDefault();
        openMenu(menu, "last");
        break;
      case "ArrowRight":
        event.preventDefault();
        focusSibling(menu, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusSibling(menu, -1);
        break;
      case "Escape":
        closeMenu(menu);
        break;
    }
  });

  menu.list.addEventListener("keydown", (event) => {
    const list = items(menu);
    const index = list.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        list[(index + 1) % list.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        list[(index - 1 + list.length) % list.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        list[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        list[list.length - 1]?.focus();
        break;
      case "ArrowRight":
        event.preventDefault();
        focusSibling(menu, 1);
        openMenu(menus[(menus.indexOf(menu) + 1) % menus.length]!, "first");
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusSibling(menu, -1);
        openMenu(menus[(menus.indexOf(menu) - 1 + menus.length) % menus.length]!, "first");
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(menu, true);
        break;
      case "Tab":
        closeMenu(menu);
        break;
    }
  });

  // Anything chosen inside a menu closes it. Buttons that open a window are
  // handled by the shared [data-open] listener; this only tidies up after them.
  menu.list.addEventListener("click", (event) => {
    if ((event.target as Element).closest('[role="menuitem"]')) closeMenu(menu);
  });
}

/** The Window menu is the one part of the bar that reflects live state. */
function renderWindowMenu() {
  const list = maybe("[data-window-menu]");
  if (!list) return;

  const front = [...windows.values()].filter((win) => !win.hidden).sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0];

  $$<HTMLElement>("[data-window-menu-item]", list).forEach((item) => {
    const win = windows.get(item.dataset.windowMenuItem!);
    const open = Boolean(win && !win.hidden);
    item.setAttribute("aria-checked", String(open));
    item.dataset.state = win === front ? "front" : open ? "open" : "closed";
  });
}

/** Language: the choice is remembered, and a first-time German-speaking visitor
 *  on the English page gets an offer rather than an automatic redirect — a
 *  redirect would fight the canonical URL and hide the other locale entirely. */
const LANG_KEY = "jg-desktop-lang";

function rememberLanguage() {
  $$<HTMLElement>("[data-set-lang]").forEach((link) =>
    link.addEventListener("click", () => {
      try {
        localStorage.setItem(LANG_KEY, link.dataset.setLang!);
      } catch {
        /* The link still navigates; only the memory is lost. */
      }
    }),
  );
}

function offerLanguage() {
  const hint = maybe("[data-lang-hint]");
  if (!hint || de) return;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(LANG_KEY);
  } catch {
    /* Treated as a first visit. */
  }

  if (stored || !navigator.language.toLowerCase().startsWith("de")) return;

  hint.hidden = false;
  maybe("[data-lang-hint-dismiss]")?.addEventListener("click", () => {
    hint.hidden = true;
    try {
      localStorage.setItem(LANG_KEY, "en");
    } catch {
      /* Dismissed for this visit only. */
    }
  });
}

export function init() {
  menus.forEach(bindMenu);
  if (menus[0]) setRovingFocus(menus[0]);

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target as Element).closest("[data-menu-button], [data-menu-list]")) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menus.some(isOpen)) closeAll(true);
  });

  setMenuCloser(closeAll);

  renderWindowMenu();
  document.addEventListener("desktop:windowschange", renderWindowMenu);

  // Closing every window at once is the only menu action with no other home.
  maybe("[data-close-all-windows]")?.addEventListener("click", () => {
    windows.forEach((win, id) => {
      if (!win.hidden) closeWindow(id, false);
    });
  });

  rememberLanguage();
  offerLanguage();

  const clock = maybe("[data-menu-clock]");
  if (clock) clock.setAttribute("aria-label", t("Clock and focus widgets", "Uhr- und Fokus-Widgets"));
}
