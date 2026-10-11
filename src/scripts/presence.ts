// Counts open tabs for "who". A random id is made up per page load and sent
// every two minutes while the tab is visible; nothing is stored in the
// browser and no cookie is set.
const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (byte) => (byte % 36).toString(36)).join("");
let lastBeat = 0;
let count: number | null = null;
let started = false;

async function beat() {
  if (document.hidden) return;
  lastBeat = Date.now();
  try {
    const response = await fetch("/api/hi/here", { method: "POST", body: id, keepalive: true });
    if (response.ok) count = ((await response.json()) as { count: number }).count;
  } catch {}
}

export function startPresence() {
  if (started) return;
  started = true;
  window.setTimeout(() => void beat(), 5_000);
  window.setInterval(() => void beat(), 120_000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - lastBeat > 60_000) void beat();
  });
}

/** The number of open tabs including this one, or null when the count is unavailable. */
export async function peopleHere(): Promise<number | null> {
  if (count === null || Date.now() - lastBeat > 60_000) await beat();
  return count;
}
