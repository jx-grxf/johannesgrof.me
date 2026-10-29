// The sprite grids from lib/sprites.ts, built in the browser as inline SVG for
// things the scripts add to the page.
import { palette, sprites, type SpriteName } from "@/lib/sprites";

// The animated letters of PixelSprite.astro, as their still colour.
const STILL: Record<string, string> = { C: "R", Q: "Y" };

const fillOf = (cell: string, colors: Record<string, string>) => colors[STILL[cell] ?? cell] ?? palette[STILL[cell] ?? cell];

const gridOf = (name: SpriteName) => sprites[name] as readonly string[];

export function spriteSvg(name: SpriteName, colors: Record<string, string> = {}): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const grid = gridOf(name);
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("xmlns", ns);
  svg.setAttribute("viewBox", `0 0 ${Math.max(...grid.map((row) => row.length))} ${grid.length}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const cell = row[x]!;
      let run = 1;
      while (row[x + run] === cell) run++;
      const fill = cell === "." ? undefined : fillOf(cell, colors);
      if (fill) {
        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(run));
        rect.setAttribute("height", "1");
        // A style, not the fill attribute: K, S and R are var() tokens.
        rect.setAttribute("style", `fill:${fill}`);
        svg.append(rect);
      }
      x += run;
    }
  });
  return svg;
}
