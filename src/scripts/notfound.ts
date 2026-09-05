const projects = document.querySelector<HTMLAnchorElement>('.site-nav a[href="/#projects"]');
const contact = document.querySelector<HTMLAnchorElement>('.site-nav a[href="/#contact"]');
const home = document.querySelector<HTMLAnchorElement>(".site-header .brand");
const skip = document.querySelector<HTMLAnchorElement>(".skip-link");

function setLanguage(lang: "en" | "de") {
  document.documentElement.lang = lang;
  const de = lang === "de";
  if (projects) { projects.textContent = de ? "Projekte" : "Projects"; projects.href = de ? "/de/#projects" : "/#projects"; }
  if (contact) { contact.textContent = de ? "Kontakt" : "Contact"; contact.href = de ? "/de/#contact" : "/#contact"; }
  if (home) home.href = de ? "/de/" : "/";
  if (skip) skip.textContent = de ? "Zum Inhalt springen" : "Skip to content";
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
