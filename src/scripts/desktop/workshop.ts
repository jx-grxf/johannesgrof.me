import { $$, locale, maybe, t } from "./core";

/** The Workshop window: what I actually pushed, released and worked on lately.
 *
 *  Everything comes from /api/github, which is this site's own cached endpoint —
 *  the visitor's browser never contacts github.com, so GitHub never sees who is
 *  reading the page and the shared per-IP rate limit cannot be exhausted by a
 *  school or office network. */

interface FeedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  pushedAt: string;
  url: string;
}

interface FeedCommit {
  repo: string;
  message: string;
  at: string;
  url: string;
}

interface FeedRelease {
  repo: string;
  tag: string;
  name: string;
  at: string;
  url: string;
  prerelease: boolean;
}

interface WorkshopFeed {
  fetchedAt: string;
  repos: FeedRepo[];
  commits: FeedCommit[];
  releases: FeedRelease[];
}

const SNAPSHOT_KEY = "jg-desktop-workshop-v2";
const SNAPSHOT_MAX_AGE = 86_400_000;
const REFRESH_AFTER = 900_000;

const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** "3 days ago" reads better than a date for activity, and needs no locale
 *  guessing about day/month order. */
function ago(iso: string) {
  const elapsed = Date.now() - Date.parse(iso);
  if (!Number.isFinite(elapsed)) return "";

  for (const [unit, ms] of UNITS) {
    if (Math.abs(elapsed) >= ms) return relative.format(-Math.round(elapsed / ms), unit);
  }

  return relative.format(0, "minute");
}

const stamp = (iso: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** Repositories worth listing: the ones this site already has a page for, plus
 *  the learning repos and the package taps. The catalogue is rendered into the
 *  page by Astro, so this list stays in step with the project data on its own. */
function catalogue(): Set<string> {
  const raw = maybe("[data-repo-catalogue]")?.textContent ?? "[]";
  try {
    const parsed: unknown = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((name): name is string => typeof name === "string").map((name) => name.toLowerCase()) : []);
  } catch {
    return new Set();
  }
}

const link = (href: string) => {
  const el = document.createElement("a");
  el.href = href;
  el.target = "_blank";
  el.rel = "noreferrer";
  return el;
};

const span = (className: string, text: string, tag = "span") => {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
};

function renderCommits(commits: FeedCommit[]) {
  const list = maybe("[data-commit-feed]");
  if (!list) return;

  list.replaceChildren();

  if (!commits.length) {
    list.append(span("feed-empty", t("Nothing pushed recently.", "Zuletzt nichts gepusht."), "p"));
    return;
  }

  for (const commit of commits) {
    const entry = link(commit.url);
    entry.className = "commit-entry";

    const head = document.createElement("div");
    head.append(span("commit-repo", commit.repo, "strong"), span("commit-when", ago(commit.at), "time"));

    entry.append(head, span("commit-message", commit.message, "p"));
    list.append(entry);
  }
}

function renderReleases(releases: FeedRelease[]) {
  const list = maybe("[data-release-feed]");
  if (!list) return;

  list.replaceChildren();

  if (!releases.length) {
    list.append(span("feed-empty", t("No releases yet.", "Noch keine Releases."), "p"));
    return;
  }

  for (const release of releases) {
    const entry = link(release.url);
    entry.className = "release-entry";

    const head = document.createElement("div");
    head.append(span("release-repo", release.repo, "strong"), span("release-tag", release.tag));
    if (release.prerelease) head.append(span("release-flag", t("preview", "Vorabversion")));

    entry.append(head, span("release-when", stamp(release.at), "small"));
    list.append(entry);
  }
}

function renderRepos(repos: FeedRepo[]) {
  const list = maybe("[data-repo-feed]");
  if (!list) return;

  const allowed = catalogue();
  const selected = repos.filter((repo) => allowed.has(repo.name.toLowerCase())).slice(0, 8);

  list.replaceChildren();

  if (!selected.length) {
    list.append(span("feed-empty", t("No public repositories to show.", "Keine öffentlichen Repos zum Anzeigen."), "p"));
    return;
  }

  for (const repo of selected) {
    const entry = link(repo.url);
    entry.className = "repo-entry";

    const info = document.createElement("div");
    info.append(span("repo-name", repo.name, "strong"));
    if (repo.description) info.append(span("repo-description", repo.description, "p"));

    const facts = [repo.language, repo.stars ? `★ ${new Intl.NumberFormat(locale).format(repo.stars)}` : ""].filter(Boolean).join(" · ");
    if (facts) info.append(span("repo-facts", facts, "small"));

    const when = span("repo-when", ago(repo.pushedAt), "time");
    when.setAttribute("datetime", repo.pushedAt);

    entry.append(info, when);
    list.append(entry);
  }
}

function setStatus(text: string) {
  const status = maybe("[data-github-status]");
  if (status) status.textContent = text;

  const widget = maybe("[data-widget-status]");
  if (widget) widget.textContent = text;
}

function render(feed: WorkshopFeed, cached: boolean) {
  renderCommits(feed.commits);
  renderReleases(feed.releases);
  renderRepos(feed.repos);

  setStatus(`${cached ? t("Saved snapshot", "Gespeicherter Stand") : "GitHub"} · ${stamp(feed.fetchedAt)}`);

  // The desktop widget teases whatever happened most recently.
  const latest = feed.commits[0];
  const headline = maybe("[data-latest-project]");
  const detail = maybe("[data-latest-description]");
  if (latest && headline && detail) {
    headline.textContent = latest.repo;
    detail.textContent = latest.message;
  }
}

const isFeed = (value: unknown): value is WorkshopFeed =>
  Boolean(value && typeof value === "object" && Array.isArray((value as WorkshopFeed).repos) && Array.isArray((value as WorkshopFeed).commits) && Array.isArray((value as WorkshopFeed).releases));

let inFlight = false;
let loadedAt = 0;
/** Whether anything is currently rendered, from either source. A restored
 *  snapshot counts: without this, a failed refresh reported "GitHub is not
 *  reachable" over a window that was visibly full of commits. */
let showing = false;

async function load(force = false) {
  if (inFlight || (!force && Date.now() - loadedAt < REFRESH_AFTER)) return;

  inFlight = true;
  const refresh = maybe<HTMLButtonElement>("[data-refresh-github]");
  if (refresh) refresh.disabled = true;
  setStatus(t("Loading…", "Wird geladen…"));

  try {
    const response = await fetch("/api/github", { signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error(String(response.status));

    const data: unknown = await response.json();
    if (!isFeed(data)) throw new Error("shape");

    loadedAt = Date.now();
    showing = true;
    render(data, false);

    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(data));
    } catch {
      /* The in-memory copy still serves this visit. */
    }
  } catch {
    if (showing) {
      setStatus(t("Saved snapshot · refresh failed", "Gespeicherter Stand · Aktualisierung fehlgeschlagen"));
    } else {
      setStatus(t("GitHub is not reachable right now.", "GitHub ist gerade nicht erreichbar."));

      // With nothing to show, the desktop widget would otherwise sit on its
      // server-rendered "loading the last commit…" placeholder forever, next to
      // a footnote saying the opposite.
      const headline = maybe("[data-latest-project]");
      const detail = maybe("[data-latest-description]");
      if (headline) headline.textContent = "GitHub";
      if (detail) detail.textContent = t("Not reachable right now.", "Gerade nicht erreichbar.");
    }
  } finally {
    inFlight = false;
    if (refresh) refresh.disabled = false;
  }
}

/** A snapshot from an earlier visit fills the window instantly, before the
 *  network answers — and stands in for it entirely when GitHub is down. */
function restoreSnapshot() {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return;

    const data: unknown = JSON.parse(raw);
    if (!isFeed(data)) return;

    const age = Date.now() - Date.parse(data.fetchedAt);
    if (!Number.isFinite(age) || age < 0 || age > SNAPSHOT_MAX_AGE) return;

    showing = true;
    render(data, true);
  } catch {
    /* An unreadable snapshot is simply not used. */
  }
}

export function init() {
  restoreSnapshot();
  void load();

  maybe("[data-refresh-github]")?.addEventListener("click", () => void load(true));
  window.addEventListener("online", () => void load());

  // Each tab in the window is a plain filter over content that is already here.
  const panels = $$("[data-workshop-panel]");
  $$<HTMLButtonElement>("[data-workshop-tab]").forEach((tab) =>
    tab.addEventListener("click", () => {
      $$<HTMLButtonElement>("[data-workshop-tab]").forEach((other) => other.setAttribute("aria-selected", String(other === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.workshopPanel !== tab.dataset.workshopTab;
      });
    }),
  );
}
