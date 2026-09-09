import { maybe, t, toast } from "./core";

/** TextEdit. Notes go to this browser's storage or to a file the visitor asked
 *  for, and nowhere else — there is no upload path in this module at all. */

const NOTE_KEY = "jg-desktop-note-v1";

let storageAvailable = true;
/** Bumped on every save, so a slow file read cannot overwrite something typed
 *  while it was still loading. */
let revision = 0;

const statusText = () =>
  storageAvailable ? t("Saved in this browser", "In diesem Browser gespeichert") : t("Storage is blocked. Download to keep this.", "Speicher ist blockiert. Zum Behalten herunterladen.");

export function init() {
  const editor = maybe<HTMLTextAreaElement>("[data-editor]");
  if (!editor) return;

  try {
    const stored = localStorage.getItem(NOTE_KEY);
    if (stored !== null) editor.value = stored;
  } catch {
    storageAvailable = false;
  }

  const updateCount = () => {
    const lines = editor.value.split("\n").length;
    const words = editor.value.trim().split(/\s+/).filter(Boolean).length;
    const count = maybe("[data-editor-count]");
    if (count) count.textContent = `${words} ${t("words", "Wörter")} · ${lines} ${t("lines", "Zeilen")}`;
  };

  const save = () => {
    revision++;
    try {
      localStorage.setItem(NOTE_KEY, editor.value);
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }

    const status = maybe("[data-editor-status]");
    if (status) status.textContent = statusText();
    updateCount();
  };

  editor.addEventListener("input", save);
  updateCount();

  const status = maybe("[data-editor-status]");
  if (status) status.textContent = statusText();

  maybe("[data-editor-download]")?.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([editor.value], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  maybe<HTMLInputElement>("[data-editor-file]")?.addEventListener("change", async (event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 1_000_000) {
      toast(t("Pick a text file under 1 MB.", "Nimm eine Textdatei unter 1 MB."));
      input.value = "";
      return;
    }

    if (editor.value.trim() && !confirm(t("Replace what is in the editor?", "Das im Editor ersetzen?"))) {
      input.value = "";
      return;
    }

    const opened = revision;
    try {
      const text = await file.text();
      if (opened === revision) {
        editor.value = text;
        save();
      } else {
        toast(t("You typed while the file was opening. Try again.", "Du hast getippt, während die Datei geöffnet wurde. Versuch es nochmal."));
      }
    } catch {
      toast(t("That file could not be opened.", "Diese Datei ließ sich nicht öffnen."));
    }

    input.value = "";
  });

  maybe("[data-editor-wrap]")?.addEventListener("click", (event) => {
    const noWrap = editor.classList.toggle("no-wrap");
    (event.currentTarget as HTMLElement).setAttribute("aria-pressed", String(!noWrap));
  });
}
