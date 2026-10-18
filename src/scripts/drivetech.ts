// The DriveTech switches: the page is rendered in COMFORT / DSC ON, this swaps
// the active curves and values. The numbers come from the same module the
// server used, so both always agree.
import {
  chartFrame,
  coastingRange,
  launchAllowed,
  mappedThrottle,
  profiles,
  settleTime,
  stabilityModes,
  type ProfileKey,
  type StabilityKey,
} from "@/data/drivetech";

const root = document.querySelector<HTMLElement>("[data-drivetech]");

if (root) {
  const de = document.documentElement.lang.startsWith("de");
  const num = (value: number, digits = 2) => new Intl.NumberFormat(de ? "de-AT" : "en", { maximumFractionDigits: digits }).format(value);
  const pct = (value: number) => `${Math.round(value * 100)} %`;
  const $ = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const setText = (selector: string, text: string) => {
    const el = $<HTMLElement>(selector);
    if (el) el.textContent = text;
  };

  const pedalInput = $<HTMLInputElement>("[data-pedal]");
  const marker = $<SVGRectElement>("[data-marker]");
  const crossX = $<SVGLineElement>("[data-cross-x]");
  const crossY = $<SVGLineElement>("[data-cross-y]");
  const plotW = chartFrame.width - chartFrame.left - chartFrame.right;
  const plotH = chartFrame.height - chartFrame.top - chartFrame.bottom;
  const frame = { x: (t: number) => chartFrame.left + t * plotW, y: (v: number) => chartFrame.top + (1 - v) * plotH };

  let profileKey = root.dataset.profile as ProfileKey;
  let stabilityKey = root.dataset.stability as StabilityKey;

  const profile = () => profiles.find((p) => p.key === profileKey)!;
  const stability = () => stabilityModes.find((m) => m.key === stabilityKey)!;

  const drawPedal = () => {
    if (!pedalInput || !marker || !crossX || !crossY) return;
    const pedal = Number(pedalInput.value) / 100;
    const throttle = mappedThrottle(profile(), pedal);
    const x = frame.x(pedal);
    const y = frame.y(throttle);
    marker.setAttribute("x", String(x - 4));
    marker.setAttribute("y", String(y - 4));
    crossX.setAttribute("x1", String(x));
    crossX.setAttribute("x2", String(x));
    crossX.setAttribute("y2", String(y));
    crossY.setAttribute("x2", String(x));
    crossY.setAttribute("y1", String(y));
    crossY.setAttribute("y2", String(y));
    setText("[data-pedal-out]", pct(pedal));
    setText("[data-throttle-out]", pct(throttle));
  };

  const render = () => {
    const p = profile();
    const m = stability();
    root.dataset.profile = p.key;
    root.dataset.stability = m.key;

    root.querySelectorAll<HTMLButtonElement>("[data-set-profile]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setProfile === p.key)));
    root.querySelectorAll<HTMLButtonElement>("[data-set-stability]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setStability === m.key)));

    root.querySelectorAll<SVGPathElement>("[data-curve]").forEach((curve) => {
      const active = curve.dataset.curve === p.key;
      if (active && !curve.classList.contains("is-active")) {
        // Restart the draw-in on the newly active curve.
        curve.classList.remove("is-active");
        void curve.getBoundingClientRect();
        curve.parentNode?.appendChild(curve);
        const marks = curve.parentNode?.querySelectorAll("[data-cross-x], [data-cross-y], [data-marker]");
        marks?.forEach((mark) => curve.parentNode?.appendChild(mark));
      }
      curve.classList.toggle("is-active", active);
    });

    setText("[data-rise]", `${num(1 / p.pedal.riseRate)} s`);
    setText("[data-max-part]", pct(p.pedal.maxPartThrottle));
    setText("[data-hold]", `${num(p.shift.holdTime, 1)} s`);
    setText("[data-settle]", `${num(settleTime(p), 1)} s`);
    setText("[data-floor]", pct(p.shift.floor));
    setText("[data-brake-down]", p.shift.brakeDownshift ? (de ? "ja" : "yes") : de ? "nein" : "no");

    const startStop = $<HTMLElement>("[data-start-stop]");
    if (startStop) startStop.textContent = (p.startStop ? startStop.dataset.on : startStop.dataset.off) ?? "";
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => step.classList.toggle("is-current", step.dataset.step === p.key));

    const coasting = $<HTMLElement>("[data-coasting]");
    const coastingState = $<HTMLElement>("[data-coasting-state]");
    if (coasting) coasting.dataset.active = String(p.coasting);
    if (coastingState) coastingState.textContent = p.coasting ? `${coastingRange.minKmh}–${coastingRange.maxKmh} km/h` : (coastingState.dataset.off ?? "");

    setText("[data-xdrive]", pct(m.xdriveLock));
    $<HTMLElement>("[data-xdrive-bar]")?.style.setProperty("--fill", String(m.xdriveLock));
    setText("[data-dsc-name]", m.name);
    const stabilityText = $<HTMLElement>("[data-stability-text]");
    if (stabilityText) stabilityText.textContent = stabilityText.dataset[m.key] ?? "";
    root.querySelectorAll<HTMLElement>("[data-dsc-row] dd").forEach((dd) => (dd.hidden = dd.dataset.mode !== m.key));

    const launch = $<HTMLElement>("[data-launch]");
    const launchState = $<HTMLElement>("[data-launch-state]");
    const ready = launchAllowed(p.key, m.key);
    if (launch) launch.dataset.ready = String(ready);
    if (launchState) launchState.textContent = (ready ? launchState.dataset.readyText : launchState.dataset.lockedText) ?? "";

    drawPedal();
  };

  root.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-set-profile], [data-set-stability]");
    if (!button) return;
    if (button.dataset.setProfile) profileKey = button.dataset.setProfile as ProfileKey;
    if (button.dataset.setStability) stabilityKey = button.dataset.setStability as StabilityKey;
    render();
  });

  pedalInput?.addEventListener("input", drawPedal);
  root.classList.add("is-live");
  render();
}
