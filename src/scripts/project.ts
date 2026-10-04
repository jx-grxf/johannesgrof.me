const copyText = async (text: string) => {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API is unavailable");
  }

  await navigator.clipboard.writeText(text);
};

document.querySelectorAll<HTMLButtonElement>("[data-install-copy]").forEach((button) => {
  const status = button.querySelector<HTMLElement>("[data-copy-status]");
  let resetTimer: number | undefined;

  button.addEventListener("click", async () => {
    const command = button.dataset.copyCommand;

    if (!command || !status) {
      return;
    }

    window.clearTimeout(resetTimer);

    try {
      await copyText(command);
      button.dataset.copyState = "success";
      status.textContent = button.dataset.copySuccess ?? "Copied";
    } catch {
      button.dataset.copyState = "error";
      status.textContent = button.dataset.copyError ?? "Copy failed";
    }

    resetTimer = window.setTimeout(() => {
      delete button.dataset.copyState;
      status.textContent = button.dataset.copyLabel ?? "Copy npm command";
    }, 2400);
  });
});

const downloadMenus = document.querySelectorAll<HTMLDetailsElement>("[data-download-menu]");
downloadMenus.forEach(menu => {
  menu.addEventListener("toggle", () => {
    if (menu.open) downloadMenus.forEach(other => { if (other !== menu) other.open = false; });
  });
});
document.addEventListener("click", event => {
  if (!(event.target instanceof Node)) return;
  const target = event.target;
  downloadMenus.forEach(menu => { if (!menu.contains(target)) menu.open = false; });
});
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  downloadMenus.forEach(menu => {
    if (!menu.open) return;
    menu.open = false;
    menu.querySelector<HTMLElement>("summary")?.focus();
  });
});
export {};
