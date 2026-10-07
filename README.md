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

| Script                            | What it does                                                          |
| --------------------------------- | --------------------------------------------------------------------- |
| `npm run dev` / `build` / `start` | Normal Next.js                                                        |
| `npm run electron:dev`            | Electron window showing your running `npm run dev` (start that first) |
| `npm run electron:start`          | Static export, then run it in Electron (nothing packaged)             |
| `npm run electron:build`          | Static export + packaged app for the current platform                 |
| `npm run electron:build:win`      | Static export + packaged app for Windows 32-bit                       |

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
