// Local time in Styria next to the intro. Rendered hidden on the server, so a
// visitor without JavaScript never sees an empty "--:--".
const clock = document.querySelector<HTMLElement>("[data-clock]");
const output = clock?.querySelector<HTMLTimeElement>("[data-clock-time]");

if (clock && output) {
  const format = new Intl.DateTimeFormat(document.documentElement.lang.startsWith("de") ? "de-AT" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna",
  });

  const tick = () => {
    output.textContent = format.format(new Date());
  };

  tick();
  clock.hidden = false;
  window.setInterval(tick, 20_000);
}

export {};
