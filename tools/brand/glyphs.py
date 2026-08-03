"""Convert the `jg` mark to outlines for public/favicon.svg.

An SVG favicon cannot load a webfont, so the mark has to ship as paths or it
renders in whatever monospace face the browser defaults to. This pulls `j` and
`g` out of Geist Mono Variable at wght 700 and prints the path data plus the
numbers needed to place it in the 64x64 tile.

Run only when the mark or the typeface changes — the output is committed:

    python3 -m venv /tmp/brand-venv
    /tmp/brand-venv/bin/pip install "fonttools[woff]" brotli
    /tmp/brand-venv/bin/python tools/brand/glyphs.py

Nothing here is part of the site build; fonttools stays out of package.json.
"""

import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SOURCE = "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2"
GLYPHS = "jg"
WEIGHT = 700
# Pulled off the mono advance so the pair reads as one mark at 16px instead of
# two thin marks. Font units.
TRACKING = -70
# Share of the tile width the pair should span, and the tile itself.
COVERAGE = 0.74
TILE = 64


def main(source: str = SOURCE) -> None:
    font = instantiateVariableFont(TTFont(source), {"wght": WEIGHT}, inplace=True)
    glyphset = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    paths = []
    pen_x = 0
    ink = [None, None, None, None]  # xMin, yMin, xMax, yMax, y-up

    for index, char in enumerate(GLYPHS):
        name = cmap[ord(char)]
        offset = pen_x + index * TRACKING

        svg_pen = SVGPathPen(glyphset, ntos=lambda v: f"{v:.2f}")
        glyphset[name].draw(TransformPen(svg_pen, Transform(1, 0, 0, 1, offset, 0)))
        paths.append((char, svg_pen.getCommands()))

        bounds_pen = BoundsPen(glyphset)
        glyphset[name].draw(bounds_pen)
        x_min, y_min, x_max, y_max = bounds_pen.bounds
        x_min, x_max = x_min + offset, x_max + offset
        ink[0] = x_min if ink[0] is None else min(ink[0], x_min)
        ink[1] = y_min if ink[1] is None else min(ink[1], y_min)
        ink[2] = x_max if ink[2] is None else max(ink[2], x_max)
        ink[3] = y_max if ink[3] is None else max(ink[3], y_max)

        pen_x += hmtx[name][0]

    width = ink[2] - ink[0]
    height = ink[3] - ink[1]
    # Scale to the target coverage, then centre the ink box — not the em box.
    # Both letters sit below the cap line with descenders, so em-box centring
    # would park the mark visibly low in the tile.
    scale = (TILE * COVERAGE) / width
    tx = (TILE - width * scale) / 2 - ink[0] * scale
    ty = (TILE - height * scale) / 2 + ink[3] * scale

    print(f"ink bounds (font units, y-up): {ink}")
    print(f'transform="translate({tx:.2f} {ty:.2f}) scale({scale:.6f} -{scale:.6f})"')
    print()
    for char, data in paths:
        print(f"<!-- {char} -->")
        print(f'<path d="{data}"/>')
        print()


if __name__ == "__main__":
    main(*sys.argv[1:])
