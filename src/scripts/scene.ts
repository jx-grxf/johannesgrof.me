// Small things hidden in the hero scene. None of them is needed to use the
// page; they are there for whoever pokes at the pixels.
import { expressTrain } from "./train";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.querySelector<HTMLElement>(".hero-stage");

// After dark in Styria the margins get a few stars.
const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Vienna" }).format(new Date()));
if (stage && (hour >= 20 || hour < 6)) stage.classList.add("is-night");

// The Mac boots: the happy face from old Mac startups, for two seconds.
const mac = document.querySelector<HTMLElement>('[data-egg="mac"]');
mac?.addEventListener("click", () => {
  if (mac.classList.contains("is-b")) return;
  mac.classList.add("is-b");
  window.setTimeout(() => mac.classList.remove("is-b"), 2000);
});

// The pumpkin drops seeds; the fifth click presses it into oil.
const pumpkin = document.querySelector<HTMLElement>('[data-egg="pumpkin"]');
let presses = 0;

function seeds(origin: HTMLElement) {
  if (reduceMotion) return;
  const box = origin.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const seed = document.createElement("span");
    seed.className = "pixel-seed";
    seed.style.left = `${box.left + box.width / 2}px`;
    seed.style.top = `${box.top + box.height / 3}px`;
    document.body.append(seed);
    const dx = (Math.random() - 0.5) * 120;
    const rise = 30 + Math.random() * 40;
    seed
      .animate(
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${dx * 0.6}px, ${-rise}px)`, offset: 0.35 },
          { transform: `translate(${dx}px, ${box.height + 40}px)`, opacity: 0 },
        ],
        { duration: 700 + Math.random() * 300, easing: "steps(12)" },
      )
      .finished.then(() => seed.remove());
  }
}

function pressOil() {
  if (!pumpkin) return;
  pumpkin.classList.add("is-b");
  pumpkin.setAttribute("title", "Kernöl");
  window.setTimeout(() => {
    pumpkin.classList.remove("is-b");
    pumpkin.removeAttribute("title");
    presses = 0;
  }, 4000);
}

pumpkin?.addEventListener("click", () => {
  if (pumpkin.classList.contains("is-b")) return;
  presses += 1;
  seeds(pumpkin);
  if (presses >= 5) pressOil();
});

// Words typed anywhere on the page (outside form fields).
let typed = "";
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof Element && target.closest("input, textarea, select, [contenteditable]");
  if (typing || event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
  typed = (typed + event.key.toLowerCase()).slice(-12);
  if (typed.endsWith("train")) {
    typed = "";
    expressTrain();
  } else if (typed.endsWith("kernoel") || typed.endsWith("kernöl")) {
    typed = "";
    pressOil();
  }
});
