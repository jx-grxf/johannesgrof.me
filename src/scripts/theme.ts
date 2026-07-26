// Paper stock switch. The stock itself is applied before first paint by the
// inline script in BaseHead; this only handles the toggle and the store.

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
