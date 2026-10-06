const projects = document.querySelector<HTMLAnchorElement>('.site-nav a[href$="#projects"]');
const contact = document.querySelector<HTMLAnchorElement>('.site-nav a[href$="#contact"]');
const home = document.querySelector<HTMLAnchorElement>(".site-header .brand");
const skip = document.querySelector<HTMLAnchorElement>(".skip-link");
const boardHome = document.querySelector<HTMLAnchorElement>("[data-error-home]");
const boardProjects = document.querySelector<HTMLAnchorElement>("[data-error-projects]");

function setLanguage(lang: "en" | "de") {
  document.documentElement.lang = lang;
  const de = lang === "de";
  if (projects) { projects.textContent = de ? "Projekte" : "Projects"; projects.href = de ? "/de/#projects" : "/#projects"; }
  if (contact) { contact.textContent = de ? "Kontakt" : "Contact"; contact.href = de ? "/de/#contact" : "/#contact"; }
  if (home) home.href = de ? "/de/" : "/";
  if (boardHome) boardHome.href = de ? "/de/" : "/";
  if (boardProjects) boardProjects.href = de ? "/de/projects/" : "/projects/";
  if (skip) skip.textContent = de ? "Zum Inhalt springen" : "Skip to content";
  const toLight = document.querySelector<HTMLElement>('[data-theme-word="dark"]');
  const toDark = document.querySelector<HTMLElement>('[data-theme-word="light"]');
  if (toLight) toLight.textContent = de ? "Hell" : "Light";
  if (toDark) toDark.textContent = de ? "Dunkel" : "Dark";
  document.querySelectorAll<HTMLButtonElement>("[data-error-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.errorLanguage === lang));
  });
}

setLanguage(document.documentElement.lang === "de" ? "de" : "en");
document.querySelectorAll<HTMLButtonElement>("[data-error-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.errorLanguage === "de" ? "de" : "en"));
});

const path = document.querySelector<HTMLElement>("[data-notfound-path]");
if (path) path.textContent = window.location.pathname;

const clock = document.querySelector<HTMLElement>("[data-error-clock]");
if (clock) {
  const format = new Intl.DateTimeFormat("de-AT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" });
  const tick = () => (clock.textContent = format.format(new Date()));
  tick();
  window.setInterval(tick, 20_000);
}

export {};
