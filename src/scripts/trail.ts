// The hero sits on the page's printed grid. Moving the pointer over it fills
// the cell underneath for a moment, aligned to the same grid as the paper.
const stage = document.querySelector<HTMLElement>(".hero-stage");
const layer = stage?.querySelector<HTMLElement>(".hero-trail");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (stage && layer && finePointer && !reduceMotion) {
  const size = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--grid-size")) || 28;
  let lastCell = "";

  stage.addEventListener("pointermove", (event) => {
    const box = stage.getBoundingClientRect();
    // The grid starts at the top left of the document, not of the stage.
    const pageX = event.clientX + window.scrollX;
    const pageY = event.clientY + window.scrollY;
    const col = Math.floor(pageX / size);
    const row = Math.floor(pageY / size);
    const cell = `${col}:${row}`;
    if (cell === lastCell) return;
    lastCell = cell;

    const dot = document.createElement("span");
    dot.style.left = `${col * size - (box.left + window.scrollX)}px`;
    dot.style.top = `${row * size - (box.top + window.scrollY)}px`;
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
    layer.append(dot);
  });

  stage.addEventListener("pointerleave", () => {
    lastCell = "";
  });
}
