// Halloween in the browser: two spiders on the frame lines, a ghost for whoever
// types "boo", and on the evening of 31 October a flashlight. Only loaded while the season runs (see
// egg.ts and lib/season.ts).
import { seasonNight } from "@/lib/season";
import { spriteSvg } from "./pixels";

const de = document.documentElement.lang.startsWith("de");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Sends one ghost across the screen in a wave. Returns false when motion is reduced. */
export function swoop(): boolean {
  if (reduceMotion) return false;
  const ghost = document.createElement("span");
  ghost.className = "ghost-swoop";
  ghost.setAttribute("aria-hidden", "true");
  ghost.append(spriteSvg("ghost"));
  document.body.append(ghost);

  const fromLeft = Math.random() < 0.5;
  const width = innerWidth + 120;
  const baseY = innerHeight * (0.2 + Math.random() * 0.45);
  const keyframes: Keyframe[] = [];
  for (let i = 0; i <= 12; i++) {
    const progress = i / 12;
    const x = fromLeft ? -60 + progress * width : innerWidth + 60 - progress * width;
    const y = baseY + Math.sin(progress * Math.PI * 3) * 48;
    // Mirror the sprite when it flies right to left, so it never flies backwards.
    keyframes.push({ transform: `translate(${x}px, ${y}px) scaleX(${fromLeft ? 1 : -1})`, opacity: i === 0 || i === 12 ? 0 : 1 });
  }
  ghost.style.left = "0";
  ghost.style.top = "0";
  ghost.animate(keyframes, { duration: 2600, easing: "steps(40)" }).finished.then(() => ghost.remove());
  return true;
}

// "boo" typed anywhere outside a form field.
let typed = "";
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof Element && target.closest("input, textarea, select, [contenteditable]");
  if (typing || event.metaKey || event.ctrlKey || event.key.length !== 1) return;
  typed = (typed + event.key.toLowerCase()).slice(-3);
  if (typed === "boo") {
    typed = "";
    swoop();
  }
});

// The spiders hang from the frame lines and let themselves down further the
// further the page is read, each at its own pace. A click sends one back up
// for a few seconds.
const SPIDERS = [
  { side: -1, rest: 96, reach: 0.3, sway: "-2.2s" },
  { side: 1, rest: 150, reach: 0.55, sway: "0s" },
] as const;

function startSpiders() {
  const spiders = SPIDERS.map(({ side, rest, reach, sway }) => {
    const spider = document.createElement("div");
    spider.className = "spider";
    const thread = document.createElement("span");
    thread.className = "spider-thread";
    const body = document.createElement("button");
    body.type = "button";
    body.setAttribute("aria-label", de ? "Spinne hochschicken" : "Send the spider up");
    body.style.animationDelay = sway;
    body.append(spriteSvg("spider"));
    body.addEventListener("click", () => {
      if (spider.classList.contains("is-up")) return;
      spider.classList.add("is-up");
      window.setTimeout(() => spider.classList.remove("is-up"), 5_000);
    });
    spider.append(thread, body);
    document.body.append(spider);
    return { spider, side, rest, reach };
  });

  let queued = 0;
  const place = () => {
    queued = 0;
    // Same columns as body::after in global.css: --shell is min(1180px, 100% - 64px).
    const width = document.documentElement.clientWidth;
    const shell = Math.min(1180, width - 64);
    const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, scrollY / scrollable);
    for (const { spider, side, rest, reach } of spiders) {
      spider.style.left = `${(width + side * shell) / 2}px`;
      spider.style.setProperty("--thread", `${Math.round(rest + progress * innerHeight * reach)}px`);
    }
  };
  const schedule = () => {
    queued ||= requestAnimationFrame(place);
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  place();
}

startSpiders();

const LIGHTS_KEY = "lights";
/** One canvas pixel covers this many screen pixels; the staircase edge comes from here. */
const PIXEL = 8;

function startFlashlight() {
  const canvas = document.createElement("canvas");
  canvas.className = "flashlight";
  canvas.setAttribute("aria-hidden", "true");
  const context = canvas.getContext("2d");
  if (!context) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "lights-toggle";
  const label = document.createElement("span");
  const key = document.createElement("span");
  key.className = "lights-toggle-key";
  key.textContent = "L";
  toggle.append(label, key);

  let lightsOn = false;
  try {
    lightsOn = sessionStorage.getItem(LIGHTS_KEY) === "on";
  } catch {}

  let x = innerWidth / 2;
  let y = innerHeight * 0.38;
  let radius = 0;
  let target = 0;
  let queued = 0;
  let image: ImageData | undefined;

  const baseRadius = () => Math.max(9, Math.min(innerWidth, innerHeight) * 0.17 / PIXEL);

  // Paint the darkness pixel by pixel: full light inside, then two hard steps of
  // dusk before the dark. No smoothing anywhere, so it stays a pixel staircase.
  const draw = () => {
    queued = 0;
    const width = canvas.width;
    const height = canvas.height;
    if (!image || image.width !== width || image.height !== height) image = context.createImageData(width, height);
    const data = image.data;
    const cx = x / PIXEL;
    const cy = y / PIXEL;
    const r = radius;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const distance = Math.hypot(px + 0.5 - cx, py + 0.5 - cy);
        const alpha = distance < r ? 0 : distance < r + 2 ? 120 : distance < r + 4 ? 200 : 246;
        const i = (py * width + px) * 4;
        data[i] = 6;
        data[i + 1] = 5;
        data[i + 2] = 4;
        data[i + 3] = alpha;
      }
    }
    context.putImageData(image, 0, 0);
  };

  const schedule = () => {
    if (!queued && !lightsOn) queued = requestAnimationFrame(draw);
  };

  const resize = () => {
    canvas.width = Math.ceil(innerWidth / PIXEL);
    canvas.height = Math.ceil(innerHeight / PIXEL);
    target = baseRadius();
    radius = target;
    schedule();
  };

  const moveTo = (nextX: number, nextY: number) => {
    x = nextX;
    y = nextY;
    schedule();
  };

  const render = () => {
    label.textContent = lightsOn ? (de ? "Licht aus" : "Lights out") : (de ? "Licht an" : "Lights on");
    toggle.setAttribute("aria-pressed", String(lightsOn));
    canvas.hidden = lightsOn;
    if (!lightsOn) schedule();
  };

  const setLights = (on: boolean) => {
    lightsOn = on;
    try {
      sessionStorage.setItem(LIGHTS_KEY, on ? "on" : "off");
    } catch {}
    render();
  };

  // The lights go out in a few hard steps instead of all at once.
  const dim = () => {
    target = baseRadius();
    if (reduceMotion) {
      radius = target;
      schedule();
      return;
    }
    const start = Math.max(innerWidth, innerHeight) / PIXEL;
    const steps = 6;
    for (let step = 0; step <= steps; step++) {
      window.setTimeout(() => {
        radius = start - ((start - target) * step) / steps;
        schedule();
      }, step * 90);
    }
  };

  // Now and then the battery stutters for two frames.
  const flicker = () => {
    if (!lightsOn && !document.hidden && !reduceMotion) {
      const keep = radius;
      radius = keep * 0.55;
      schedule();
      window.setTimeout(() => {
        radius = keep * 0.85;
        schedule();
      }, 70);
      window.setTimeout(() => {
        radius = keep;
        schedule();
      }, 150);
    }
    window.setTimeout(flicker, 9_000 + Math.random() * 9_000);
  };

  addEventListener("pointermove", (event) => moveTo(event.clientX, event.clientY), { passive: true });
  addEventListener("pointerdown", (event) => moveTo(event.clientX, event.clientY), { passive: true });
  // A finger that scrolls ends its pointer stream, so follow the touch itself.
  addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    if (touch) moveTo(touch.clientX, touch.clientY);
  }, { passive: true });
  // Keyboard users get the light on whatever has focus.
  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element) || event.target === toggle) return;
    const box = event.target.getBoundingClientRect();
    moveTo(box.left + box.width / 2, box.top + box.height / 2);
  });
  addEventListener("resize", resize);
  toggle.addEventListener("click", () => setLights(!lightsOn));
  // L on its own switches the light. Inside a word typed on the page ("terminal",
  // "kernoel") it is just a letter, so any other key shortly before cancels it.
  let lastKeyAt = 0;
  document.addEventListener("keydown", (event) => {
    const typing = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], .term");
    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
    const now = performance.now();
    const alone = now - lastKeyAt > 800;
    lastKeyAt = now;
    if ((event.key === "l" || event.key === "L") && alone) setLights(!lightsOn);
  });

  document.body.append(canvas, toggle);
  resize();
  render();
  if (!lightsOn) dim();
  window.setTimeout(flicker, 6_000);
}

if (seasonNight()) startFlashlight();
