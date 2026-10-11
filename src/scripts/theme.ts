// Paper stock switch. The stock itself is applied before first paint by the
// inline script in BaseHead; this handles the toggle, the store, and turning
// the page at sunrise or sunset for readers who never chose a stock.
import { isViennaDaylight } from "@/lib/sun";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const THEME_COLOR: Record<Theme, string> = {
  dark: "#12110f",
  light: "#f4f2ed",
};

const currentTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const applyTheme = (theme: Theme) => {
  // Dark is the default stock, so it is the absence of the attribute rather
  // than a value — one less state to keep in sync with the CSS.
  if (theme === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    delete document.documentElement.dataset.theme;
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);

  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((toggle) => {
    const label = theme === "light" ? toggle.dataset.labelToDark : toggle.dataset.labelToLight;

    if (label) {
      toggle.setAttribute("aria-label", label);
    }
  });
};

// The markup ships the dark-stock labels; correct them if the reader is on the
// light one before they can reach for the control.
applyTheme(currentTheme());

const hasStoredChoice = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark";
  } catch {
    return false;
  }
};

window.setInterval(() => {
  if (hasStoredChoice()) return;
  const bySun: Theme = isViennaDaylight(new Date()) ? "light" : "dark";
  if (bySun !== currentTheme()) applyTheme(bySun);
}, 60_000);

document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";

    applyTheme(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice holds for this page only.
    }
  });
});
