// The part of the hidden terminal that ships with every page: a greeting in
// the dev console and the keys that open it. The terminal itself is only
// downloaded the first time someone asks for it.

import { seasonOn } from "@/lib/season";
import { startPresence } from "./presence";

const de = document.documentElement.lang.startsWith("de");
const halloween = seasonOn();
startPresence();
if (halloween) void import("./halloween");

const train = String.raw`
  ____________   ____________   ______________
 |[] [] [] [] | |[] [] [] [] | |[] [] [] []   \_
 |____________|=|____________|=|_______________|
    o      o       o      o       o          o
`;

// The pumpkin from the right margin, carved, for the Halloween weeks.
const pumpkin = String.raw`
         )
     .-''|''-.
   .'  /\   /\ '.
  /    \/   \/   \
 |   ._______.    |
  \   \/\/\/\/   /
   '.          .'
     '-.____.-'
`;

console.log(`%c${halloween ? pumpkin : train}`, `color:${halloween ? "#ff8a2a" : "#a8e22a"};font-family:monospace;font-size:11px;line-height:1.2`);
console.log(
  `%c$ johannes grof%c\n${
    de
      ? `${halloween ? "Halloween hier. Tipp irgendwo „boo“, im Terminal gibt es trick und treat.\n" : ""}Du schaust in die Konsole, also bist du hier richtig.\nDrück ~ (am Mac Option+N) oder tipp einfach „terminal“, dann geht eins auf.\nIm echten Terminal: curl -sL johannesgrof.me/de/hi\nQuelltext: https://github.com/jx-grxf/johannesgrof.me`
      : `${halloween ? "Halloween here. Type \"boo\" anywhere, the terminal knows trick and treat.\n" : ""}You opened the console, so you are in the right place.\nPress ~ (Option+N on a German Mac) or just type "terminal" and one opens.\nIn a real terminal: curl -sL johannesgrof.me/hi\nSource: https://github.com/jx-grxf/johannesgrof.me`
  }`,
  `color:${halloween ? "#ff8a2a" : "#ff6a4d"};font-family:monospace;font-weight:700;font-size:13px`,
  "color:inherit;font-family:monospace;font-size:12px;line-height:1.6",
);

// The menu-bar clock in the header, like the one on a Mac: weekday and time
// in Styria.
const headerClock = document.querySelector<HTMLElement>("[data-header-clock]");
const headerTime = headerClock?.querySelector("time");
if (headerClock && headerTime) {
  const format = new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" });
  const hour = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Vienna" });
  // During Halloween, midnight to one is the witching hour.
  const tick = () => {
    const now = new Date();
    const text = format.format(now).replace(",", "");
    headerTime.textContent = halloween && Number(hour.format(now)) === 0 ? `${de ? "Geisterstunde" : "Witching hour"} ${text.split(" ").pop()}` : text;
  };
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
