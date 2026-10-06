// The part of the hidden terminal that ships with every page: a greeting in
// the dev console and the keys that open it. The terminal itself is only
// downloaded the first time someone asks for it.

const de = document.documentElement.lang.startsWith("de");

const train = String.raw`
  ____________   ____________   ______________
 |[] [] [] [] | |[] [] [] [] | |[] [] [] []   \_
 |____________|=|____________|=|_______________|
    o      o       o      o       o          o
`;

console.log(`%c${train}`, "color:#a8e22a;font-family:monospace;font-size:11px;line-height:1.2");
console.log(
  `%c$ johannes grof%c\n${
    de
      ? "Du schaust in die Konsole, also bist du hier richtig.\nDrück ~ (am Mac Option+N) oder tipp einfach „terminal“, dann geht eins auf.\nQuelltext: https://github.com/jx-grxf/johannesgrof.me"
      : "You opened the console, so you are in the right place.\nPress ~ (Option+N on a German Mac) or just type \"terminal\" and one opens.\nSource: https://github.com/jx-grxf/johannesgrof.me"
  }`,
  "color:#ff6a4d;font-family:monospace;font-weight:700;font-size:13px",
  "color:inherit;font-family:monospace;font-size:12px;line-height:1.6",
);

// The menu-bar clock in the header, like the one on a Mac: weekday and time
// in Styria.
const headerClock = document.querySelector<HTMLElement>("[data-header-clock]");
const headerTime = headerClock?.querySelector("time");
if (headerClock && headerTime) {
  const format = new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" });
  const tick = () => (headerTime.textContent = format.format(new Date()).replace(",", ""));
  tick();
  headerClock.hidden = false;
  window.setInterval(tick, 20_000);
}

let loading: Promise<typeof import("./terminal")> | undefined;

const openLazily = () => {
  loading ??= import("./terminal");
  void loading.then((terminal) => terminal.openTerminal());
};

// Ways in, because "~" sits somewhere different on every keyboard:
// - "~" on US layouts, Option+N on German Macs (a dead key there),
// - the ^ key left of 1 on German layouts (Backquote, IntlBackslash on Mac ISO),
// - typing the word "terminal" anywhere outside a form field.
let typed = "";
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof Element && target.closest("input, textarea, select, [contenteditable]");
  if (typing || event.metaKey || event.ctrlKey) return;
  const macTilde = event.altKey && event.code === "KeyN";
  const caretKey = !event.altKey && (event.code === "Backquote" || event.code === "IntlBackslash");
  if (event.key === "~" || macTilde || caretKey) {
    event.preventDefault();
    openLazily();
    return;
  }
  if (event.key.length === 1) {
    typed = (typed + event.key.toLowerCase()).slice(-8);
    if (typed.endsWith("terminal")) {
      typed = "";
      openLazily();
    }
  }
});

document.querySelectorAll<HTMLElement>("[data-terminal-open]").forEach((button) => {
  button.addEventListener("click", openLazily);
});

export {};
