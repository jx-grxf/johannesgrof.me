import { $$, maybe, t } from "./core";

/** Preview: the things of mine that are actually online, with a shot of each
 *  and a link that opens in a real tab.
 *
 *  This replaces the fake browser window that used to sit here. That window
 *  framed third-party sites in a sandboxed iframe and fell back to a
 *  "this site cannot be embedded" panel for almost every address anyone typed —
 *  a browser inside a browser that mostly apologised for not being one. */

function select(id: string) {
  $$("[data-preview-entry]").forEach((entry) => {
    entry.hidden = entry.dataset.previewEntry !== id;
  });

  $$<HTMLButtonElement>("[data-preview-pick]").forEach((button) => {
    const active = button.dataset.previewPick === id;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-current", String(active));
  });

  const shot = maybe<HTMLImageElement>(`[data-preview-entry="${CSS.escape(id)}"] img`);
  // Shots below the fold load lazily; the visible one should not wait.
  if (shot) shot.loading = "eager";
}

export function init() {
  $$<HTMLButtonElement>("[data-preview-pick]").forEach((button) => button.addEventListener("click", () => select(button.dataset.previewPick!)));

  const first = maybe<HTMLElement>("[data-preview-pick]");
  if (first) select(first.dataset.previewPick!);

  const note = maybe("[data-preview-note]");
  if (note) note.textContent = t("Every link opens in its own tab.", "Jeder Link öffnet in einem eigenen Tab.");
}
