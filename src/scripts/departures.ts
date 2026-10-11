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

  // Split-flap: a changed cell runs every character through the flap order
  // until it lands on the new one; characters that stay the same don't move.
  const FLAPS = " ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789-.";
  const TICK_MS = 50;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timers = new WeakMap<HTMLElement, number>();
  let flipping = 0;

  const flapAt = (target: string, stepsLeft: number) => {
    const index = FLAPS.indexOf(target.toUpperCase());
    if (index === -1) return FLAPS[(stepsLeft * 7) % FLAPS.length]!;
    const char = FLAPS[(index - stepsLeft + FLAPS.length * 8) % FLAPS.length]!;
    return target === target.toLowerCase() ? char.toLowerCase() : char;
  };

  const flip = (el: HTMLElement, next: string, delay: number) => {
    const prev = el.dataset.value ?? "";
    if (prev === next) return;
    el.dataset.value = next;
    const running = timers.get(el);
    if (running) {
      window.clearInterval(running);
      flipping--;
    }
    if (reduceMotion.matches) {
      el.textContent = next;
      return;
    }
    const length = Math.max(prev.length, next.length);
    const settle = Array.from({ length }, (_, i) => delay + 3 + ((i * 5) % 7) + Math.floor(i / 2));
    const last = Math.max(...settle, delay);
    let tick = 0;
    flipping++;
    rows.setAttribute("aria-busy", "true");
    el.classList.add("is-flipping");
    const id = window.setInterval(() => {
      tick++;
      let text = "";
      for (let i = 0; i < length; i++) {
        const from = prev[i] ?? " ";
        const to = next[i] ?? " ";
        if (tick < delay || from === to) text += tick < delay ? from : to;
        else if (tick >= settle[i]!) text += to;
        else text += flapAt(to, settle[i]! - tick);
      }
      el.textContent = text;
      if (tick >= last) {
        window.clearInterval(id);
        timers.delete(el);
        el.textContent = next;
        el.classList.remove("is-flipping");
        if (--flipping === 0) rows.setAttribute("aria-busy", "false");
      }
    }, TICK_MS);
    timers.set(el, id);
  };

  const render = (departures: Departure[]) => {
    while (rows.children.length > departures.length) rows.lastElementChild!.remove();
    while (rows.children.length < departures.length) {
      const li = document.createElement("li");
      li.className = "dep-row";
      li.append(cell("dep-line", ""), cell("dep-dest", ""), cell("dep-kind", ""), cell("dep-eta", ""));
      rows.append(li);
    }
    departures.forEach((d, index) => {
      const [line, dest, kind, eta] = [...rows.children[index]!.children] as HTMLElement[];
      const delay = index * 2;
      flip(line!, d.line, delay);
      flip(dest!, d.towards, delay);
      kind!.className = `dep-kind${d.realtime ? " dep-kind--rt" : ""}`;
      kind!.textContent = d.realtime ? t.realtime : t.timetable;
      eta!.classList.toggle("dep-eta--now", d.minutes === 0);
      flip(eta!, d.minutes === 0 ? t.now : `${d.minutes} ${t.min}`, delay);
    });
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

  // Approved guestbook entries (signed with curl) run along the bottom of the board.
  const ticker = board.querySelector<HTMLElement>("[data-guestbook-ticker]");
  const loadGuestbook = async () => {
    if (!ticker) return;
    try {
      const response = await fetch("/api/hi/guestbook", { headers: { Accept: "application/json" } });
      if (!response.ok) return;
      const { entries } = (await response.json()) as { entries: { text: string }[] };
      if (!entries.length) return;
      const span = document.createElement("span");
      span.textContent = `${de ? "Gästebuch" : "Guestbook"}: ${entries.map((entry) => `»${entry.text}«`).join("  ·  ")}  ·  curl -d "…" johannesgrof.me${de ? "/de" : ""}/hi/sign`;
      span.style.animationDuration = `${Math.max(22, span.textContent.length / 5)}s`;
      ticker.replaceChildren(span);
      ticker.hidden = false;
    } catch {}
  };

  const start = () => {
    if (started) return;
    started = true;
    status.textContent = t.loading;
    void load();
    void loadGuestbook();
    timer = window.setInterval(() => void load(), 30_000);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stop = button.dataset.stop ?? stop;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
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
