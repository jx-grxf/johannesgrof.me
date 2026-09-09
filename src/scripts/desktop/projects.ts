import { $, $$, de, maybe, openWindow, setProjectOpener, t, toast } from "./core";

/** Finder, plus the project window it opens into.
 *
 *  Project detail markup is fetched per project rather than shipped for all of
 *  them: rendering every case study, screenshot and download list into the
 *  first response made the home page 158 KB of HTML for content almost nobody
 *  scrolls to. The project a deep link asks for is still server-rendered, so a
 *  shared /projects/:slug/ URL needs no JavaScript to be readable. */

const PARTIAL_BASE = de ? "/de/partials/projects" : "/partials/projects";

const pending = new Map<string, Promise<boolean>>();

const container = () => maybe(".project-detail-content");

function setBusy(busy: boolean) {
  const win = maybe("#window-project");
  if (win) win.dataset.loading = String(busy);
}

/** Fetches one project's markup and appends it, hidden, to the project window. */
async function fetchDetail(slug: string): Promise<boolean> {
  const host = container();
  if (!host) return false;

  try {
    const response = await fetch(`${PARTIAL_BASE}/${encodeURIComponent(slug)}/`, { signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error(String(response.status));

    const markup = await response.text();
    const template = document.createElement("template");
    template.innerHTML = markup;

    const article = template.content.querySelector<HTMLElement>(`[data-project-detail="${CSS.escape(slug)}"]`);
    if (!article) throw new Error("missing article");

    article.hidden = true;
    host.append(article);
    return true;
  } catch {
    return false;
  }
}

function show(slug: string) {
  const entries = $$("[data-project-detail]");
  entries.forEach((el) => {
    el.hidden = el.dataset.projectDetail !== slug;
  });

  const content = maybe("#window-project .window-content");
  if (content) content.scrollTop = 0;

  const label = entries.find((el) => el.dataset.projectDetail === slug)?.querySelector("h1,h3")?.textContent;
  const title = maybe("#title-project");
  if (title) title.textContent = label || t("Project", "Projekt");
}

function openProject(slug: string, trigger?: HTMLElement, writeHistory = true) {
  if (!slug) return;

  openWindow("project", trigger, false);

  const known = $$("[data-project-detail]").some((el) => el.dataset.projectDetail === slug);

  if (known) {
    show(slug);
  } else {
    setBusy(true);
    const request = pending.get(slug) ?? fetchDetail(slug);
    pending.set(slug, request);

    void request.then((ok) => {
      setBusy(false);
      if (ok) show(slug);
      else {
        pending.delete(slug);
        // The full page for this project is a normal URL, so a failed fetch has
        // an honest way out rather than an empty window.
        toast(t("That project could not be loaded. Opening the full page instead.", "Das Projekt ließ sich nicht laden. Ich öffne die ganze Seite."));
        location.href = `${de ? "/de" : ""}/projects/${encodeURIComponent(slug)}/`;
      }
    });
  }

  if (writeHistory && location.hash !== `#project=${slug}`) history.pushState(null, "", `#project=${slug}`);
}

// ---------------------------------------------------------------------------
// Finder
// ---------------------------------------------------------------------------

let filter = "all";

function applyFilter() {
  const search = maybe<HTMLInputElement>("[data-project-search]");
  const query = (search?.value ?? "").trim().toLowerCase();
  let count = 0;

  $$<HTMLAnchorElement>(".project-file").forEach((file) => {
    const visible = (filter === "all" || file.dataset.category === filter) && (file.dataset.search || "").includes(query);
    file.hidden = !visible;
    if (visible) count++;
  });

  const empty = maybe("[data-project-empty]");
  if (empty) empty.hidden = count !== 0;

  const counter = maybe("[data-project-count]");
  if (counter) counter.textContent = `${count} ${count === 1 ? t("project", "Projekt") : t("projects", "Projekte")}`;
}

export function init() {
  setProjectOpener(openProject);

  maybe("[data-project-search]")?.addEventListener("input", applyFilter);

  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter!;
      $$("[data-filter]").forEach((other) => other.classList.toggle("selected", other === button));
      applyFilter();
    }),
  );

  maybe("[data-view-toggle]")?.addEventListener("click", (event) => {
    const active = $("[data-project-grid]").classList.toggle("list-view");
    (event.currentTarget as HTMLElement).setAttribute("aria-pressed", String(active));
  });

  applyFilter();

  // Copy buttons live inside project markup, which can arrive later, so this
  // listens on the window rather than on each button.
  maybe("#window-project")?.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLElement>("[data-copy-project], [data-copy-text]");
    if (!button) return;

    const text = button.dataset.copyText || `https://johannesgrof.me${de ? "/de" : ""}/projects/${button.dataset.copyProject}/`;

    void navigator.clipboard
      .writeText(text)
      .then(() => toast(t("Copied.", "Kopiert.")))
      .catch(() => toast(t("Clipboard is blocked — select the text instead.", "Zwischenablage ist blockiert — markier den Text stattdessen.")));
  });
}
