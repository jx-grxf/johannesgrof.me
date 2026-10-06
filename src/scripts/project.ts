// Clipboard API first; where it is blocked, fall back to a hidden textarea and
// the old copy command, which still works on a user click.
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (!ok) throw new Error("Copy failed");
  }
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

// Copy buttons next to the developer-setup commands.
document.querySelectorAll<HTMLButtonElement>("[data-command-copy]").forEach((button) => {
  const label = button.textContent ?? "Copy";
  let resetTimer: number | undefined;
  button.addEventListener("click", async () => {
    window.clearTimeout(resetTimer);
    try {
      await copyText(button.dataset.commandCopy ?? "");
      button.textContent = button.dataset.copied ?? "Copied";
      button.dataset.copyState = "success";
    } catch {
      button.dataset.copyState = "error";
    }
    resetTimer = window.setTimeout(() => {
      button.textContent = label;
      delete button.dataset.copyState;
    }, 1800);
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
