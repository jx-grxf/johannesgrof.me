import { $$, locale, maybe, t, toast } from "./core";

/** The desktop widgets: the clock, the focus timer, and the weather panel that
 *  puts the visitor's own place next to mine. */

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

type Condition = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "showers" | "thunder";

interface Place {
  city: string;
  region: string;
  country: string;
  timeZone: string;
  temperature: number | null;
  condition: Condition | null;
  isDay: boolean;
}

interface WeatherPayload {
  visitor: Place | null;
  home: Place;
}

/** Drawn here rather than pulled from an icon set, so the glyphs match the rest
 *  of the desktop and cost nothing to ship. Each entry is one 24×24 path. */
const GLYPHS: Record<Condition, string> = {
  clear: "M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  partly: "M17 8a4 4 0 0 0-7.5-2M7 21a4 4 0 0 1-.6-8A5 5 0 0 1 16 12a3.5 3.5 0 0 1 .5 7Z",
  cloudy: "M7 20a4.5 4.5 0 0 1-.5-9A5.5 5.5 0 0 1 17 12a4 4 0 0 1 .5 8Z",
  fog: "M7 16a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 9 3.5 3.5 0 0 1 17 16M4 19h16M7 22h10",
  drizzle: "M7 16a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 9 3.5 3.5 0 0 1 17 16M9 19v1m3-2v2m3-3v1",
  rain: "M7 15a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 8 3.5 3.5 0 0 1 17 15M8 18l-1 3m5-3-1 3m5-3-1 3",
  snow: "M7 15a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 8 3.5 3.5 0 0 1 17 15M8 19h.01M12 21h.01M16 19h.01M10 22h.01M14 22h.01",
  showers: "M7 14a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 7 3.5 3.5 0 0 1 17 14M8 17l-2 4m6-4-2 4m6-4-2 4",
  thunder: "M7 14a4 4 0 0 1-.5-8A5 5 0 0 1 16.5 7 3.5 3.5 0 0 1 17 14M13 16l-4 3h3l-1 4 4-4h-3Z",
};

const LABELS: Record<Condition, [string, string]> = {
  clear: ["Clear", "Klar"],
  partly: ["Partly cloudy", "Teils bewölkt"],
  cloudy: ["Overcast", "Bedeckt"],
  fog: ["Fog", "Nebel"],
  drizzle: ["Drizzle", "Nieselregen"],
  rain: ["Rain", "Regen"],
  snow: ["Snow", "Schnee"],
  showers: ["Showers", "Schauer"],
  thunder: ["Thunderstorm", "Gewitter"],
};

const conditionLabel = (condition: Condition | null) => (condition ? t(...LABELS[condition]) : "");

function glyph(condition: Condition | null) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", GLYPHS[condition ?? "cloudy"]);
  svg.append(path);

  return svg;
}

const timeIn = (timeZone: string) => new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

const temperature = (place: Place) => (place.temperature === null ? "—" : `${place.temperature}°`);

/** One column of the weather panel. */
function renderPlace(root: HTMLElement, place: Place, caption: string) {
  root.hidden = false;
  root.replaceChildren();

  const head = document.createElement("span");
  head.className = "weather-caption";
  head.textContent = caption;

  const row = document.createElement("div");
  row.className = "weather-row";
  row.dataset.day = String(place.isDay);
  row.append(glyph(place.condition));

  const degrees = document.createElement("strong");
  degrees.textContent = temperature(place);
  row.append(degrees);

  const where = document.createElement("p");
  where.className = "weather-place";
  where.textContent = place.city || place.region || place.country;

  const detail = document.createElement("small");
  const parts = [conditionLabel(place.condition), timeIn(place.timeZone)].filter(Boolean);
  detail.textContent = parts.join(" · ");

  root.append(head, row, where, detail);
}

let weather: WeatherPayload | null = null;

/** Both columns and the menu-bar status item come from one payload. */
function renderWeather() {
  const panel = maybe("[data-weather]");
  if (!panel || !weather) return;

  panel.dataset.state = "ready";

  const home = maybe("[data-weather-home]");
  if (home) renderPlace(home, weather.home, t("WHERE I AM", "BEI MIR"));

  const visitor = maybe("[data-weather-visitor]");
  if (visitor) {
    if (weather.visitor) renderPlace(visitor, weather.visitor, t("WHERE YOU ARE", "BEI DIR"));
    else visitor.hidden = true;
  }

  // The status item mirrors whichever place is the visitor's own.
  const status = maybe("[data-weather-status]");
  const shown = weather.visitor ?? weather.home;
  if (status) {
    status.hidden = false;
    status.replaceChildren(glyph(shown.condition));
    const value = document.createElement("span");
    value.textContent = temperature(shown);
    status.append(value);
    status.setAttribute("title", [shown.city, conditionLabel(shown.condition)].filter(Boolean).join(" · "));
  }
}

async function loadWeather() {
  const panel = maybe("[data-weather]");
  if (!panel) return;

  try {
    const response = await fetch("/api/weather", { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(String(response.status));

    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("home" in data)) throw new Error("shape");

    weather = data as WeatherPayload;
    renderWeather();
  } catch {
    // No weather is not an error worth interrupting anyone over: the panel
    // simply keeps its server-rendered placeholder.
    panel.dataset.state = "unavailable";
  }
}

// ---------------------------------------------------------------------------
// Clock
// ---------------------------------------------------------------------------

function clockTick() {
  const now = new Date();

  const clock = maybe("[data-vienna-clock]");
  if (clock) clock.textContent = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", hour12: false }).format(now);

  const date = maybe("[data-vienna-date]");
  if (date) date.textContent = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Vienna", weekday: "long", day: "numeric", month: "long" }).format(now);

  const menuClock = maybe("[data-menu-clock]");
  if (menuClock) menuClock.textContent = new Intl.DateTimeFormat(locale, { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(now);

  // Parsed in a fixed locale so the numbers are always Latin digits.
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const minutes = Number(parts.find((p) => p.type === "hour")?.value) * 60 + Number(parts.find((p) => p.type === "minute")?.value);

  const progress = maybe("[data-day-progress]");
  if (progress) progress.style.width = `${(minutes / 1440) * 100}%`;

  // Times inside the weather panel drift too, so they follow the same tick.
  if (weather) {
    $$("[data-weather-visitor], [data-weather-home]").forEach((column) => {
      const small = column.querySelector("small");
      const place = column.matches("[data-weather-home]") ? weather!.home : weather!.visitor;
      if (small && place) small.textContent = [conditionLabel(place.condition), timeIn(place.timeZone)].filter(Boolean).join(" · ");
    });
  }
}

// ---------------------------------------------------------------------------
// Focus timer
// ---------------------------------------------------------------------------

const FOCUS_SECONDS = 25 * 60;
let focusRemaining = FOCUS_SECONDS;
// An absolute deadline rather than a tick count, so a backgrounded tab that
// stops firing intervals still shows the right time when it comes back.
let focusDeadline: number | null = null;

const setToggle = (label: string, ariaLabel: string) => {
  const button = maybe("[data-focus-toggle]");
  if (!button) return;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
};

function focusTick() {
  const display = maybe("[data-focus-time]");
  if (!display) return;

  if (focusDeadline !== null) {
    focusRemaining = Math.max(0, Math.ceil((focusDeadline - Date.now()) / 1000));

    if (!focusRemaining) {
      focusDeadline = null;
      setToggle("▶", t("Start timer", "Timer starten"));
      const label = maybe("[data-focus-label]");
      if (label) label.textContent = t("Done. Go get a coffee.", "Fertig. Hol dir einen Kaffee.");
      toast(t("25 minutes are up.", "Die 25 Minuten sind um."));
    }
  }

  display.textContent = `${String(Math.floor(focusRemaining / 60)).padStart(2, "0")}:${String(focusRemaining % 60).padStart(2, "0")}`;
}

function bindFocus() {
  maybe("[data-focus-toggle]")?.addEventListener("click", () => {
    if (focusDeadline !== null) {
      focusTick();
      focusDeadline = null;
    } else {
      if (!focusRemaining) focusRemaining = FOCUS_SECONDS;
      focusDeadline = Date.now() + focusRemaining * 1000;
    }

    const running = focusDeadline !== null;
    setToggle(running ? "Ⅱ" : "▶", running ? t("Pause timer", "Timer pausieren") : t("Start timer", "Timer starten"));

    const label = maybe("[data-focus-label]");
    if (label) label.textContent = running ? t("Running.", "Läuft.") : t("Paused.", "Pausiert.");
  });

  maybe("[data-focus-reset]")?.addEventListener("click", () => {
    focusDeadline = null;
    focusRemaining = FOCUS_SECONDS;
    focusTick();
    setToggle("▶", t("Start timer", "Timer starten"));
    const label = maybe("[data-focus-label]");
    if (label) label.textContent = t("25 minutes, one thing.", "25 Minuten, eine Sache.");
  });
}

export function init() {
  clockTick();
  focusTick();
  bindFocus();
  void loadWeather();

  window.setInterval(() => {
    if (!document.hidden) {
      clockTick();
      focusTick();
    }
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      clockTick();
      focusTick();
    }
  });

  // The weather is only worth another lookup after a long absence.
  let lastWeatherLoad = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - lastWeatherLoad > 900_000) {
      lastWeatherLoad = Date.now();
      void loadWeather();
    }
  });
}
