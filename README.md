# Next.js + Electron template

A Next.js (Pages Router) app that builds into an Electron desktop app **from the
project root**: no `renderer` folder, no copying files, no Nextron.

- `next dev` / `next build` / `next start` work as normal (and the Dockerfile still works).
- For Electron, Next makes a static export (`./out`) and a small Electron main
  process (`electron/main.js`) loads it. `electron-builder` packages the two.

## Starting a new project from this template

1. Copy this folder and rename it.
2. In `package.json` change `name`, `description` and `author`.
3. In `electron-builder.yml` change `appId`, `productName` and `copyright`.
4. In `electron/main.js` set the window size/frame at the top of the file.
5. Install and go:

```bash
npm install
```

```bash
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Normal Next.js |
| `npm run electron:dev` | Electron window showing your running `npm run dev` (start that first) |
| `npm run electron:start` | Static export, then run it in Electron (nothing packaged) |
| `npm run electron:build` | Static export + packaged app for the current platform |
| `npm run electron:build:win` | Static export + packaged app for Windows 32-bit |

Packaged apps are written to `electron-dist/`.

To get just the unpacked Windows folder (no installer, no Wine needed on a Mac):

```bash
npm run electron:export && npx electron-builder --win --ia32 --dir
```

## Project structure

```
pages/        Next.js pages (_app.js, _document.js, index.js ...)
components/   One folder per component, plus a barrel file
data/         Content and settings (dummy content in content.js)
hooks/        Custom React hooks
styles/       Global styles (globals.scss)
public/       Static files: fonts, images, audio, video (served from /)
electron/     Electron main process + preload
```

Components use barrel files, so pages import from one place:

```
components/
  index.js                  export { Example } from "./Example";
  Example/
    index.js                export { default as Example } from "./Example";
    Example.js              the component
    Example.module.scss     its styles (CSS modules)
```

```js
import { Example } from "../components";
import content from "../data/content.js";
```

To add a component, copy `components/Example/`, rename the three files and the
names inside them, then add a line to `components/index.js`.

## How it fits together

- `next.config.mjs`: turns on `output: "export"` only when `ELECTRON=1`
  (set by the `electron:*` scripts via `cross-env`).
- `electron/main.js`: opens the window, remembers its position, loads `app://./`
  (the exported `out/` folder, served by `electron-serve`) or, with `--dev`, the dev server.
- `electron/preload.js`: exposes `window.ipc.send/on` to the page.
- `electron-builder.yml`: packages `out/` + `electron/` only, and leaves out
  Next/React/Sass so the app is about 40 MB instead of 300+ MB.
- `Dockerfile`: sets `ELECTRON_SKIP_BINARY_DOWNLOAD=1` so the server image
  doesn't download Electron.

## Gotchas

- **Don't create a root folder called `app/`.** Next treats it as the App Router
  directory, and the build breaks. (Use `pages/`, `components/`, etc.)
- **Static export limits:** no API routes, `getServerSideProps`, middleware or
  the Next image optimiser (`images.unoptimized` is already set). Plain pages,
  client-side code and `public/` files are fine.
- **Absolute asset paths** like `/fonts/x.woff2` or `/audio/x.mp3` work, because
  `app://./` serves the `out/` folder as its root.
- **Restart `npm run dev`** after renaming or moving top-level folders.
- **Page-only packages:** anything the pages import (e.g. `classnames`) is already
  compiled into `out/`, but if it's listed under `dependencies` electron-builder
  also copies it into the app. Either put it in `devDependencies`, or add it to the
  exclusion list in `electron-builder.yml`. Check what shipped with
  `npx @electron/asar list electron-dist/<platform>/<app>/Contents/Resources/app.asar`.
- Sound/video autoplay: browsers (and Electron) only allow audio after a user
  gesture. Touch screens are the usual place this bites.
