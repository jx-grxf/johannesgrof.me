// Sends the hero train through once at express speed. Shared by the hidden
// terminal and the typed "train" easter egg. Returns false off the home page.
export function expressTrain(): boolean {
  const train = document.querySelector<HTMLElement>(".hero-train");
  if (!train) return false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  train.style.animation = "none";
  void train.offsetWidth;
  train.style.animation = "train-ride 4.5s linear 1";
  train.addEventListener("animationend", () => train.style.removeProperty("animation"), { once: true });
  return true;
}
