const path = require("path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const serve = require("electron-serve");
const Store = require("electron-store");

// ---- Settings to change per project ---------------------------------------
const WINDOW_NAME = "main"; // window position/size is remembered under this name
const WINDOW_OPTIONS = {
  width: 3840,
  height: 2160,
  frame: false, // true for a normal window with a title bar
  // fullscreen: true,
  // kiosk: true,
};
// ----------------------------------------------------------------------------

// `npm run electron:dev` starts with --dev: load the running Next dev server
// (npm run dev) instead of the exported build in ./out
const isDev = process.argv.includes("--dev");
const devUrl = process.env.ELECTRON_DEV_URL || "http://localhost:3000/";

if (isDev) {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
} else {
  serve({ directory: "out" });
}

// A BrowserWindow that remembers its position and size between runs
function createWindow(windowName, options) {
  const key = "window-state";
  const store = new Store({ name: `window-state-${windowName}` });
  const defaultSize = { width: options.width, height: options.height };
  let state = {};

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const [x, y] = win.getPosition();
    const [width, height] = win.getSize();
    return { x, y, width, height };
  };

  const windowWithinBounds = (windowState, bounds) =>
    windowState.x >= bounds.x &&
    windowState.y >= bounds.y &&
    windowState.x + windowState.width <= bounds.x + bounds.width &&
    windowState.y + windowState.height <= bounds.y + bounds.height;

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen
      .getAllDisplays()
      .some((display) => windowWithinBounds(windowState, display.bounds));
    // Partially or fully off-screen now (e.g. a display was unplugged)
    return visible ? windowState : resetToDefaults();
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const win = new BrowserWindow({
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      ...options.webPreferences,
    },
  });

  win.on("close", saveState);

  return win;
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow(WINDOW_NAME, {
    ...WINDOW_OPTIONS,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    await mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL("app://./");
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

// Example of talking to the page: window.ipc.send("message", "Hello") in the
// page, window.ipc.on("message", callback) to receive the reply.
ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
