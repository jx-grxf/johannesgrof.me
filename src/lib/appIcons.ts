/** The desktop's app-icon set.
 *
 *  Two sources, one switch. `apple` uses the macOS application icons in
 *  `public/desktop/`, exported from an installed system — Apple's artwork, kept
 *  because that is the look Johannes wants. `drawn` uses the set defined below,
 *  which is this repository's own material: one squircle, one two-stop gradient
 *  and one stroked glyph per app, shipped as an SVG sprite.
 *
 *  Flip ICON_SOURCE to compare the two. Nothing else has to change: the same
 *  `<AppIcon app="finder" />` renders either. */
export type IconSource = "apple" | "drawn";

export const ICON_SOURCE: IconSource = "apple";

/** App id to file in `public/desktop/`. The files are named after the macOS
 *  applications they came from, which is not always the app id here: Preview is
 *  Safari's icon, Workshop is Activity Monitor's, Archive is the Trash. */
export const APPLE_ICON_FILES: Record<string, string> = {
  welcome: "welcome.png",
  finder: "finder.png",
  preview: "browser.png",
  editor: "editor.png",
  terminal: "terminal.png",
  workshop: "activity.png",
  contact: "contact.png",
  settings: "settings.png",
  archive: "trash.png",
  folder: "folder.png",
  document: "document.png",
};

export interface AppIconDesign {
  /** Gradient stops, top-left to bottom-right. */
  from: string;
  to: string;
  /** Glyph stroke colour; the light tiles need dark ink. */
  ink?: string;
  /** Glyph path on a 100×100 grid, inside the tile's safe area. */
  glyph: string;
  width?: number;
}

/** A superellipse close to the macOS icon shape: the corners bend into the
 *  straight edges instead of meeting them at a tangent, which is what stops a
 *  rounded rectangle from reading as an app icon. */
export const SQUIRCLE =
  "M50 0C20.2 0 8.6 2.6 3.9 10.5 0 17.1 0 26.6 0 50s0 32.9 3.9 39.5C8.6 97.4 20.2 100 50 100s41.4-2.6 46.1-10.5C100 82.9 100 73.4 100 50s0-32.9-3.9-39.5C91.4 2.6 79.8 0 50 0Z";

export const APP_ICONS: Record<string, AppIconDesign> = {
  // About me — a roof over a doorway.
  welcome: {
    from: "#ffb463",
    to: "#f0623c",
    glyph: "M28 50 50 31l22 19M34 46v24h32V46M45 70V58h10v12",
  },
  // Projects — a folder with a raised tab.
  finder: {
    from: "#6fb8ff",
    to: "#2f6ddb",
    glyph: "M27 39v-4a3 3 0 0 1 3-3h12l4 6h21a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H30a3 3 0 0 1-3-3V39Zm0 2h46",
  },
  // Preview — a window with a title bar.
  preview: {
    from: "#5fd6c4",
    to: "#1f8f8a",
    glyph: "M26 34h48a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V36a2 2 0 0 1 2-2Zm-2 10h52M31 39h.5m4 0h.5m4 0h.5",
  },
  // Notes — a sheet with a folded corner.
  editor: {
    from: "#fdfcf8",
    to: "#ddd8cc",
    ink: "#3b382f",
    glyph: "M34 26h20l12 12v36a2 2 0 0 1-2 2H34a2 2 0 0 1-2-2V28a2 2 0 0 1 2-2Zm20 0v12h12M40 52h20M40 60h20M40 68h12",
  },
  // Terminal — a prompt.
  terminal: {
    from: "#4a4a52",
    to: "#1c1c22",
    glyph: "M32 38l12 12-12 12M52 62h18",
  },
  // Workshop — a pulse line, the shape of activity.
  workshop: {
    from: "#8ee06a",
    to: "#2f9e44",
    glyph: "M24 50h12l7-16 10 32 8-19 5 3h10",
  },
  // Contact — an envelope.
  contact: {
    from: "#7fc4ff",
    to: "#2b62c9",
    glyph: "M26 35h48a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V37a2 2 0 0 1 2-2Zm-1 2 25 20 25-20",
  },
  // Settings — a gear.
  settings: {
    from: "#cdd0d6",
    to: "#8b8f98",
    ink: "#2f3238",
    glyph: "M50 40a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0-14 3 8 8 3 8-4 5 8-6 6v9l6 6-5 8-8-4-8 3-3 8h-9l-3-8-8-3-8 4-5-8 6-6v-9l-6-6 5-8 8 4 8-3 3-8Z",
    width: 3.4,
  },
  // Archive — a tray with a lid.
  archive: {
    from: "#b9bec7",
    to: "#767b86",
    ink: "#2f3238",
    glyph: "M28 34h44v10H28zM32 44v28a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V44M42 54h16",
  },
};

export const APP_ICON_IDS = Object.keys(APP_ICONS);
