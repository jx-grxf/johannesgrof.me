// The live departures board in the ÖffiGo band. Loads when it scrolls into
// view, refreshes every 30 s while the tab is visible, and lets the reader
// switch between a handful of Vienna stops.
interface Departure {
  line: string;
  towards: string;
  minutes: number;
  realtime: boolean;
}

const board = document.querySelector<HTMLElement>("[data-departures]");

if (board) {
  const rows = board.querySelector<HTMLElement>("[data-departures-rows]")!;
  const status = board.querySelector<HTMLElement>("[data-departures-status]")!;
  const clock = board.querySelector<HTMLElement>("[data-departures-clock]");
  const buttons = [...board.querySelectorAll<HTMLButtonElement>("[data-stop]")];
  const de = document.documentElement.lang.startsWith("de");
  const t = {
    now: de ? "jetzt" : "now",
    min: "min",
    realtime: de ? "Echtzeit" : "Real time",
    timetable: de ? "Fahrplan" : "Timetable",
    loading: de ? "Lade Abfahrten …" : "Loading departures …",
    empty: de ? "Gerade keine Abfahrten gemeldet." : "No departures reported right now.",
    error: de ? "Die Wiener Linien antworten gerade nicht. Gleich nochmal." : "Wiener Linien is not answering right now. Trying again shortly.",
  };
  let stop = buttons.find((b) => b.getAttribute("aria-pressed") === "true")?.dataset.stop ?? "praterstern";
  let timer: number | undefined;
  let started = false;

  const cell = (className: string, text: string) => {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
  };

  const render = (departures: Departure[]) => {
    rows.replaceChildren(
      ...departures.map((d) => {
        const li = document.createElement("li");
        li.className = "dep-row";
        const eta = cell(`dep-eta${d.minutes === 0 ? " dep-eta--now" : ""}`, d.minutes === 0 ? t.now : `${d.minutes} ${t.min}`);
        const kind = cell(`dep-kind${d.realtime ? " dep-kind--rt" : ""}`, d.realtime ? t.realtime : t.timetable);
        li.append(cell("dep-line", d.line), cell("dep-dest", d.towards), kind, eta);
        return li;
      }),
    );
  };

  const load = async () => {
    if (document.hidden) return;
    try {
      const response = await fetch(`/api/departures?stop=${encodeURIComponent(stop)}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { departures: Departure[]; updatedAt: string };
      render(data.departures);
      status.textContent = data.departures.length ? "" : t.empty;
      if (clock) {
        clock.textContent = new Intl.DateTimeFormat("de-AT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" }).format(new Date(data.updatedAt));
      }
      board.dataset.state = "live";
    } catch {
      status.textContent = t.error;
      board.dataset.state = "error";
    }
  };

  const start = () => {
    if (started) return;
    started = true;
    status.textContent = t.loading;
    void load();
    timer = window.setInterval(() => void load(), 30_000);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stop = button.dataset.stop ?? stop;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      rows.replaceChildren();
      status.textContent = t.loading;
      void load();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && started) void load();
  });

  new IntersectionObserver((entries, observer) => {
    if (entries.some((e) => e.isIntersecting)) {
      start();
      observer.disconnect();
    }
  }, { rootMargin: "200px" }).observe(board);

  window.addEventListener("pagehide", () => window.clearInterval(timer));
}

export {};
