const form = document.querySelector<HTMLFormElement>("[data-project-search]");
if (form) {
  const input = form.querySelector<HTMLInputElement>("input")!;
  const items = [...document.querySelectorAll<HTMLElement>("[data-project-item]")];
  const groups = [...document.querySelectorAll<HTMLElement>("[data-project-group]")];
  const results = document.querySelector<HTMLElement>("[data-project-results]")!;
  const empty = document.querySelector<HTMLElement>("[data-project-empty]")!;
  const de = document.documentElement.lang.startsWith("de");
  const apply = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    items.forEach(item => {
      item.hidden = Boolean(query) && !item.dataset.search?.includes(query);
      if (!item.hidden) count++;
    });
    groups.forEach(group => {
      const members = [...group.querySelectorAll<HTMLElement>("[data-project-item]")];
      group.hidden = members.length ? members.every(item => item.hidden) : Boolean(query);
    });
    empty.hidden = count > 0;
    results.textContent = query ? `${count} ${de ? "Projekte gefunden" : "projects found"}` : "";
  };
  const readUrl = () => { input.value = new URL(location.href).searchParams.get("q") ?? ""; apply(); };
  const updateUrl = () => {
    const url = new URL(location.href);
    const query = input.value.trim();
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    apply();
  };
  form.addEventListener("submit", event => { event.preventDefault(); updateUrl(); });
  input.addEventListener("input", updateUrl);
  window.addEventListener("popstate", readUrl);
  readUrl();
}
