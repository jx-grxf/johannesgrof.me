import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const base = process.env.DESKTOP_TEST_URL || "http://127.0.0.1:4321";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname)) {
  throw new Error("Browser checks must run against a local preview.");
}
const session = `jg-desktop-check-${process.pid}`;
const artifacts = mkdtempSync(join(tmpdir(), "jg-desktop-check-"));
const browser = (...args) => {
  const result = JSON.parse(
    execFileSync(
      "rtk",
      ["proxy", "agent-browser", "--session", session, "--json", ...args],
      { encoding: "utf8", timeout: 30_000, maxBuffer: 4_000_000 },
    ),
  );
  if (!result.success)
    throw new Error(result.error || `Browser command failed: ${args[0]}`);
  return result.data;
};
const evaluate = (code) => browser("eval", code).result;
const click = (selector) => {
  browser("scrollintoview", selector);
  return browser("click", selector);
};
const fill = (selector, text) => browser("fill", selector, text);
const check = (name, condition) => {
  assert.ok(condition, name);
  console.log(`PASS ${name}`);
};
const until = async (expression) => {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (evaluate(expression)) return;
    await delay(150);
  }
  throw new Error(`Condition timed out: ${expression}`);
};

// The desktop reads GitHub and the weather through this site's own endpoints,
// so both are routed to fixtures here: the check never depends on a third party
// being up, on a rate limit, or on where the machine running it happens to be.
const workshopFeed = {
  fetchedAt: new Date().toISOString(),
  repos: [
    {
      name: "BriskEdit",
      description: "Native macOS editor",
      language: "Swift",
      stars: 3,
      pushedAt: "2026-09-05T22:00:07Z",
      url: "https://github.com/jx-grxf/BriskEdit",
    },
  ],
  commits: [
    {
      repo: "BriskEdit",
      message: "fix(editor): keep the caret visible while wrapping",
      at: "2026-09-05T22:00:07Z",
      url: "https://github.com/jx-grxf/BriskEdit/commit/86ced5978b1494adad8d902a3e02df7131136684",
    },
  ],
  releases: [
    {
      repo: "BriskEdit",
      tag: "v0.6.0",
      name: "BriskEdit 0.6.0",
      at: "2026-09-05T22:05:47Z",
      url: "https://github.com/jx-grxf/BriskEdit/releases/tag/v0.6.0",
      prerelease: false,
    },
  ],
};

const weather = {
  visitor: {
    city: "Graz",
    region: "6",
    country: "AT",
    timeZone: "Europe/Vienna",
    temperature: 21,
    condition: "partly",
    isDay: true,
  },
  home: {
    city: "Feldbach",
    region: "Steiermark",
    country: "AT",
    timeZone: "Europe/Vienna",
    temperature: 19,
    condition: "rain",
    isDay: true,
  },
};

try {
  browser("open", "about:blank");
  browser("set", "viewport", "1440", "900");
  browser("network", "route", "**/api/github", "--body", JSON.stringify(workshopFeed));
  browser("network", "route", "**/api/weather", "--body", JSON.stringify(weather));
  // Defense in depth: even if the fetch fixture below is removed, no test email is sent.
  browser("network", "route", "**/api/contact", "--body", '{"ok":true}');
  browser("open", `${base}/de/`);
  check(
    "welcome opens immediately",
    evaluate('!document.querySelector("#window-welcome").hidden'),
  );

  // --- menu bar -----------------------------------------------------------
  click('[aria-controls="menu-projects"]');
  check(
    "a menu opens on click",
    evaluate(
      'document.querySelector("#menu-projects").hidden === false && document.querySelector(\'[aria-controls="menu-projects"]\').getAttribute("aria-expanded") === "true"',
    ),
  );
  browser("press", "ArrowRight");
  check(
    "arrow keys walk the menu bar and carry the open menu across",
    evaluate(
      'document.querySelector("#menu-windows").hidden === false && document.querySelector("#menu-projects").hidden === true',
    ),
  );
  browser("press", "Escape");
  check(
    "Escape closes the menu",
    evaluate('document.querySelector("#menu-windows").hidden === true'),
  );
  click('[aria-controls="menu-windows"]');
  check(
    "the Window menu ticks what is open",
    evaluate(
      'document.querySelector(\'[data-window-menu-item="welcome"]\').getAttribute("aria-checked") === "true" && document.querySelector(\'[data-window-menu-item="terminal"]\').getAttribute("aria-checked") === "false"',
    ),
  );
  browser("press", "Escape");
  click('[aria-controls="menu-language"]');
  check(
    "the language menu marks the current locale and links to the other one",
    evaluate(
      '(()=>{const de=document.querySelector(\'[data-set-lang="de"]\'),en=document.querySelector(\'[data-set-lang="en"]\');return de.getAttribute("aria-checked")==="true" && en.getAttribute("aria-checked")==="false" && new URL(en.href).pathname==="/";})()',
    ),
  );
  browser("press", "Escape");

  // --- weather ------------------------------------------------------------
  await until('document.querySelector("[data-weather]").dataset.state === "ready"');
  check(
    "the weather widget shows the visitor's place beside mine",
    evaluate(
      'document.querySelector("[data-weather-visitor]").textContent.includes("Graz") && document.querySelector("[data-weather-home]").textContent.includes("Feldbach")',
    ),
  );
  check(
    "the menu bar carries the visitor's temperature",
    evaluate(
      '!document.querySelector("[data-weather-status]").hidden && document.querySelector("[data-weather-status]").textContent.includes("21")',
    ),
  );

  // --- finder and projects ------------------------------------------------
  click('.dock [data-open="finder"]');
  fill("[data-project-search]", "this-project-does-not-exist");
  check(
    "Finder empty state",
    evaluate('!document.querySelector("[data-project-empty]").hidden'),
  );
  fill("[data-project-search]", "BriskEdit");
  check(
    "Finder filters the real catalogue",
    evaluate(
      '[...document.querySelectorAll(".project-file")].filter(e=>!e.hidden).length === 1',
    ),
  );
  // The home page ships no project article at all; each one is fetched from
  // /partials/projects/:slug/ the first time it is opened.
  check(
    "no project article is shipped with the home page",
    evaluate(
      'document.querySelectorAll("[data-project-detail]").length === 1 && document.querySelector("[data-project-detail]").dataset.projectDetail === "oeffigo"',
    ),
  );
  click('.project-file[data-project="briskedit"]');
  await until('document.querySelector("[data-project-detail=briskedit]") !== null');
  check(
    "an opened project is fetched and has its downloads",
    evaluate(
      '!document.querySelector("[data-project-detail=briskedit]").hidden && document.querySelector("[data-project-detail=briskedit] .project-downloads a") !== null',
    ),
  );
  check(
    "the fetched article is localised",
    evaluate(
      'document.querySelector("[data-project-detail=briskedit]").textContent.includes("Das Problem")',
    ),
  );
  click('#window-project [data-window-action="minimize"]');
  check(
    "minimize hides the project",
    evaluate('document.querySelector("#window-project").hidden'),
  );
  click('.project-file[data-project="briskedit"]');
  click('#window-project [data-window-action="maximize"]');
  check(
    "maximize fills the workspace",
    evaluate(
      'document.querySelector("#window-project").getBoundingClientRect().width === innerWidth - 20',
    ),
  );
  click('#window-project [data-window-action="maximize"]');
  const before = evaluate(
    '(()=>{const r=document.querySelector("#window-project").getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};})()',
  );
  browser("mouse", "move", String(before.x + 250), String(before.y + 25));
  browser("mouse", "down", "left");
  browser("mouse", "move", String(before.x + 325), String(before.y + 15));
  browser("mouse", "up", "left");
  check(
    "pointer drag moves the window and releases capture",
    evaluate(
      `document.querySelector('#window-project').getBoundingClientRect().x > ${before.x} && !document.body.classList.contains('window-dragging')`,
    ),
  );
  browser("focus", "#window-project [data-resize-handle]");
  browser("press", "ArrowRight");
  check(
    "keyboard resizing works",
    evaluate(
      `document.querySelector('#window-project').getBoundingClientRect().width > ${before.width}`,
    ),
  );

  // --- notes and spotlight ------------------------------------------------
  click('.dock [data-open="editor"]');
  const note =
    "Persistent note\n<script>window.__unexpectedExecution=true</script>";
  fill("[data-editor]", note);
  browser("reload");
  check(
    "editor content survives reload as plain text",
    evaluate(
      `document.querySelector('[data-editor]').value === ${JSON.stringify(note)} && !window.__unexpectedExecution`,
    ),
  );
  browser("press", "Control+k");
  fill("[data-spotlight-search]", "Terminal");
  browser("press", "Enter");
  check(
    "Spotlight opens an app with the keyboard",
    evaluate(
      '!document.querySelector("#window-terminal").hidden && !document.querySelector(".spotlight").open',
    ),
  );

  // --- terminal -----------------------------------------------------------
  fill("#terminal-input", "whoami");
  browser("press", "Enter");
  await until(
    'document.querySelector("[data-terminal-output]").textContent.includes("HTL Kaindorf")',
  );
  check(
    "terminal answers a command",
    evaluate(
      'document.querySelector("[data-terminal-output]").textContent.includes("HTL Kaindorf")',
    ),
  );
  fill("#terminal-input", "gh");
  browser("press", "Enter");
  await until(
    'document.querySelector("[data-terminal-output]").textContent.includes("caret visible")',
  );
  check(
    "terminal reads the same GitHub feed as the workshop",
    evaluate(
      'document.querySelector("[data-terminal-output]").textContent.includes("BriskEdit")',
    ),
  );
  browser("press", "ArrowUp");
  check(
    "terminal history restores the last command",
    evaluate('document.querySelector("#terminal-input").value === "gh"'),
  );
  fill("#terminal-input", "project briskedit");
  browser("press", "Enter");
  await until('!document.querySelector("#window-project").hidden');
  check(
    "terminal opens a project by name",
    evaluate(
      '!document.querySelector("[data-project-detail=briskedit]").hidden',
    ),
  );

  // --- preview ------------------------------------------------------------
  click('.dock [data-open="preview"]');
  check(
    "preview shows its first screenshot before its module loads",
    evaluate(
      '[...document.querySelectorAll("[data-preview-entry]")].filter(e=>!e.hidden).length === 1',
    ),
  );
  await until('document.querySelector("[data-preview-note]").textContent !== ""');
  click('[data-preview-pick="briskedit"]');
  check(
    "picking a project switches the screenshot",
    evaluate(
      '!document.querySelector(\'[data-preview-entry="briskedit"]\').hidden',
    ),
  );
  check(
    "the desktop frames no third-party site",
    evaluate("document.querySelectorAll('iframe:not([src*=\"challenges.cloudflare.com\"])').length === 0"),
  );

  // --- archive ------------------------------------------------------------
  click('.dock [data-open="archive"]');
  check(
    "the archive lists real archived projects, not invented filenames",
    evaluate(
      'document.querySelectorAll(".archive-list button").length > 0 && document.querySelector(".archive-list").textContent.includes("SlamX")',
    ),
  );

  // --- contact ------------------------------------------------------------
  // Test the app's integration, not Cloudflare's challenge: callbacks and the
  // delivery response are controlled fixtures. No live contact POST is made.
  evaluate(`(()=>{
    window.__contactCalls=[]; window.__contactFixture={status:200,body:{ok:true}};
    const originalFetch=window.fetch.bind(window);
    window.fetch=async (url,options)=>{
      if(String(url)==='/api/contact') {
        window.__contactCalls.push(JSON.parse(options.body));
        return new Response(JSON.stringify(window.__contactFixture.body),{status:window.__contactFixture.status,headers:{'Content-Type':'application/json'}});
      }
      return originalFetch(url,options);
    };
    window.turnstile={
      render:(element,options)=>{
        window.__challenge=options; window.__challengeElement=element;
        element.textContent='Local verification fixture';
        setTimeout(()=>options.callback('local-test-token'),0);
        return 'local-fixture';
      },
      remove:()=>{window.__challengeElement?.replaceChildren();},
      reset:()=>{setTimeout(()=>window.__challenge.callback('fresh-local-test-token'),0);}
    };
  })()`);
  click('.dock [data-open="contact"]');
  await until(
    'document.querySelector(".contact-verification").dataset.state === "verified"',
  );
  fill("#contact-name", "Local browser test");
  fill("#contact-email", "test@example.com");
  fill("#contact-message", "This message only reaches the test fixture.");
  click('#window-contact [data-window-action="minimize"]');
  click('.dock [data-open="contact"]');
  check(
    "minimizing preserves the contact draft",
    evaluate(
      'document.querySelector("#contact-message").value.includes("test fixture")',
    ),
  );
  browser("set", "viewport", "360", "844");
  await until(
    'document.querySelector(".contact-verification").dataset.state === "verified" && window.__challenge.size === "compact"',
  );
  check(
    "Turnstile uses compact layout when needed",
    evaluate('window.__challenge.size === "compact"'),
  );
  click(".contact-submit");
  await until(
    'document.querySelector(".contact-status-card").dataset.state === "success"',
  );
  check(
    "successful mocked delivery clears the form and carries a verification token",
    evaluate(
      'document.querySelector("#contact-message").value === "" && window.__contactCalls.length === 1 && !!window.__contactCalls[0]["cf-turnstile-response"]',
    ),
  );
  evaluate(
    'window.__contactFixture={status:503,body:{ok:false,error:"unavailable"}}',
  );
  fill("#contact-name", "Local browser test");
  fill("#contact-email", "test@example.com");
  fill("#contact-message", "Preserve this draft after failure.");
  click(".contact-submit");
  await until(
    'document.querySelector(".contact-status-card").dataset.state === "server"',
  );
  check(
    "delivery failure preserves the draft",
    evaluate(
      'document.querySelector("#contact-message").value === "Preserve this draft after failure."',
    ),
  );
  evaluate('window.__challenge["expired-callback"]()');
  check(
    "expired challenge blocks submission",
    evaluate(
      'document.querySelector(".contact-submit").disabled && !document.querySelector(".verification-retry").hidden',
    ),
  );
  click(".verification-retry");
  await until(
    'document.querySelector(".contact-verification").dataset.state === "verified"',
  );
  check(
    "verification retry recovers",
    evaluate('!document.querySelector(".contact-submit").disabled'),
  );

  // --- widgets on a phone -------------------------------------------------
  click('[data-open="widgets"]');
  click("[data-focus-toggle]");
  await until(
    'document.querySelector("[data-focus-time]").textContent !== "25:00"',
  );
  check(
    "focus countdown runs on mobile",
    evaluate(
      'document.querySelector("[data-focus-time]").textContent !== "25:00"',
    ),
  );
  click("[data-focus-toggle]");
  const paused = evaluate(
    'document.querySelector("[data-focus-time]").textContent',
  );
  await delay(1100);
  check(
    "focus countdown pauses",
    evaluate(
      `document.querySelector('[data-focus-time]').textContent === ${JSON.stringify(paused)}`,
    ),
  );
  click("[data-focus-reset]");
  check(
    "focus countdown resets",
    evaluate(
      'document.querySelector("[data-focus-time]").textContent === "25:00"',
    ),
  );
  check(
    "mobile exposes only its front window to keyboard navigation",
    evaluate(
      '[...document.querySelectorAll("[data-window]")].filter(e=>!e.hidden&&!e.inert).length === 1',
    ),
  );
  check(
    "mobile has no horizontal page overflow",
    evaluate("document.documentElement.scrollWidth <= innerWidth"),
  );
  browser("screenshot", join(artifacts, "mobile-widgets.png"));

  // --- appearance ---------------------------------------------------------
  click('.dock [data-open="settings"]');
  click('button[data-desktop-theme="dark"]');
  click('button[data-wallpaper="styria"]');
  browser("reload");
  check(
    "appearance and wallpaper persist",
    evaluate(
      'document.documentElement.dataset.desktopTheme === "dark" && document.documentElement.dataset.wallpaper === "styria"',
    ),
  );
  click('button[data-desktop-theme="light"]');
  click('button[data-wallpaper="dawn"]');
  browser("set", "viewport", "1440", "900");

  // --- workshop, and what it does when GitHub is down ---------------------
  click('.dock [data-open="workshop"]');
  await until('document.querySelector("[data-commit-feed]").children.length > 0');
  check(
    "the workshop lists commits, releases and repositories",
    evaluate(
      'document.querySelector("[data-commit-feed]").textContent.includes("caret visible") && document.querySelector("[data-release-feed]") !== null && document.querySelector("[data-repo-feed]") !== null',
    ),
  );
  click('[data-workshop-tab="releases"]');
  check(
    "the tabs switch panels",
    evaluate(
      '!document.querySelector(\'[data-workshop-panel="releases"]\').hidden && document.querySelector(\'[data-workshop-panel="commits"]\').hidden',
    ),
  );
  browser("network", "unroute", "**/api/github");
  // agent-browser's route only supports --abort or --body, and an aborted
  // fetch lands in the same catch branch a 503 would.
  browser("network", "route", "**/api/github", "--abort");
  click("[data-refresh-github]");
  await until('!document.querySelector("[data-refresh-github]").disabled');
  check(
    "a failed refresh keeps the saved snapshot and says so",
    evaluate(
      'document.querySelector("[data-github-status]").textContent.includes("Gespeicherter Stand") && document.querySelector("[data-commit-feed]").children.length > 0',
    ),
  );

  // --- deep links ---------------------------------------------------------
  browser("open", `${base}/projects/briskedit/`);
  check(
    "direct project URLs render inside the desktop without a fetch",
    evaluate(
      'document.body.dataset.initialProject === "briskedit" && !document.querySelector("#window-project").hidden && document.querySelector("#window-welcome").hidden && document.querySelector("[data-project-detail=briskedit]") !== null',
    ),
  );
  check(
    "project metadata stays specific",
    evaluate(
      'document.title === "BriskEdit · Johannes Grof" && document.querySelector("link[rel=canonical]").href === "https://johannesgrof.me/projects/briskedit/"',
    ),
  );
  browser("screenshot", join(artifacts, "project-desktop.png"));
  browser("open", `${base}/de/classic/`);
  check(
    "classic reading layout remains available",
    evaluate(
      '!document.documentElement.dataset.desktop && document.querySelector("h1") !== null',
    ),
  );
  check(
    "the reading view points search engines at the desktop URL",
    evaluate(
      'document.querySelector("link[rel=canonical]").href === "https://johannesgrof.me/de/"',
    ),
  );
  browser("open", `${base}/de/`);
  browser("screenshot", join(artifacts, "desktop.png"));
  console.log(`Screenshots: ${artifacts}`);
} catch (error) {
  try {
    browser("screenshot", join(artifacts, "failure.png"));
  } catch {}
  console.error(`Browser check failed. Screenshots: ${artifacts}`);
  throw error;
} finally {
  try {
    browser("close");
  } catch {}
}
