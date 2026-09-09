# Desktop asset provenance

## App icons — two sets, one switch

`src/lib/appIcons.ts` exports `ICON_SOURCE`. It decides which artwork every
`<AppIcon />` draws, and nothing else has to change to swap between them.

**`"apple"` (current).** The macOS application icons in `public/desktop/`,
exported from an installed macOS with Apple's `sips` and converted to 256-pixel
PNGs. This is Apple's copyrighted artwork, kept deliberately: it is the look the
site is going for, and the practical risk to a portfolio of this size is low.
`APPLE_ICON_FILES` maps app ids to files — the names follow the applications
they came from, so Preview uses Safari's icon, Workshop uses Activity Monitor's,
and Archive uses the Trash.

| File | Original resource |
| --- | --- |
| `finder.png` | Finder.app, `Finder.icns` |
| `browser.png` | Safari.app, `AppIcon.icns` |
| `editor.png` | TextEdit.app, `AppIcon.icns` |
| `terminal.png` | Terminal.app, `Terminal.icns` |
| `contact.png` | Mail.app, `ApplicationIcon.icns` |
| `settings.png` | System Settings.app, `SystemSettings.icns` |
| `activity.png` | Activity Monitor.app, `AppIcon.icns` |
| `folder.png`, `trash.png`, `document.png`, `welcome.png` | CoreTypes.bundle, `GenericFolderIcon.icns`, `FullTrashIcon.icns`, `GenericDocumentIcon.icns`, `HomeFolderIcon.icns` |

**`"drawn"`.** The set defined in the same file: one superellipse shared by every
tile, a two-stop gradient per app and one stroked glyph each, emitted once as an
SVG sprite (`DesktopAppIconSprite.astro`) and referenced with `<use>`. This
repository's own material, and about eighty bytes per use. The sprite is left
out of the document entirely while `ICON_SOURCE` is `"apple"`.

## Wallpapers

Three stacked radial gradients each, in `src/styles/desktop.css` (`dawn`,
`styria`, `ink`). No image file and no request. The Apple desktop pictures the
first draft used are held in `.backup-original-desktop/public-desktop/`, out of
the build: `sonoma.jpg`, `horizon.jpg` and `imac-blue.jpg` came to 2.1 MB
between them, which is a lot of bandwidth for a background.

## Project icons

Project logos and screenshots under `public/projects/` come from the projects
themselves and keep their own provenance:

- NotchTray: `jx-grxf/NotchTray`, `Assets/AppIcon.png`.
- poise: `jx-grxf/poise`, `Resources/Assets.xcassets/AppIcon.appiconset/icon_256x256.png`.

Retrieved through GitHub on 2026-09-09, retained as 256-pixel PNGs.

## Fonts

Geist and Geist Mono, self-hosted from `@fontsource-variable`, served from this
origin so they load under a strict CSP. No proprietary font files are shipped.
