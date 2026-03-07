const { app, BrowserWindow, dialog, ipcMain, screen } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

let mainWindow = null;
let viewerWindow = null;

const isDev = !app.isPackaged;

function startEmbeddedServer() {
  // Set environment for the embedded server
  if (!process.env.DGT_BASE_PATH) {
    process.env.DGT_BASE_PATH = path.join(app.getPath("userData"), "Live");
  }

  // Ensure the Live directory exists
  const fs = require("fs");
  fs.mkdirSync(process.env.DGT_BASE_PATH, { recursive: true });

  // Load the server — it starts listening on require
  const serverPath = isDev
    ? path.join(__dirname, "..", "server", "server.js")
    : path.join(process.resourcesPath, "server", "server.js");

  // We need to require the config to know the port before starting
  const configPath = isDev
    ? path.join(__dirname, "..", "server", "config.js")
    : path.join(process.resourcesPath, "server", "config.js");

  // In production, the server lives in extraResources (outside the asar).
  // Add the asar node_modules to the module search path so the server
  // can resolve dependencies like express, chokidar, ws, etc.
  if (!isDev) {
    const Module = require("module");
    const asarNodeModules = path.join(
      process.resourcesPath,
      "app.asar",
      "node_modules",
    );
    Module.globalPaths.push(asarNodeModules);
  }

  const config = require(configPath);
  const port = config.server.port;

  require(serverPath);

  return port;
}

function createWindow(serverPort) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "Chess Broadcast",
    icon: path.join(__dirname, "..", "assets", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT || 3002}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "..", "build", "index.html"),
        protocol: "file:",
        slashes: true,
      }),
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// IPC handlers
ipcMain.handle("get-server-port", () => {
  const configPath = isDev
    ? path.join(__dirname, "..", "server", "config.js")
    : path.join(process.resourcesPath, "server", "config.js");
  const config = require(configPath);
  return config.server.port;
});

ipcMain.handle("open-viewer-window", () => {
  if (viewerWindow && !viewerWindow.isDestroyed()) {
    viewerWindow.focus();
    return;
  }

  const displays = screen.getAllDisplays();
  const external = displays.find((d) => d.id !== screen.getPrimaryDisplay().id);
  const bounds = external ? external.bounds : screen.getPrimaryDisplay().bounds;

  viewerWindow = new BrowserWindow({
    x: bounds.x + 50,
    y: bounds.y + 50,
    width: Math.min(bounds.width - 100, 1600),
    height: Math.min(bounds.height - 100, 1000),
    title: "Live Viewer",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    viewerWindow.loadURL(`http://localhost:${process.env.PORT || 3002}#/live`);
  } else {
    viewerWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "..", "build", "index.html"),
        protocol: "file:",
        slashes: true,
        hash: "/live",
      }),
    );
  }

  viewerWindow.on("closed", () => {
    viewerWindow = null;
  });
});

ipcMain.handle("select-dgt-path", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Select DGT LiveChess PGN Output Directory",
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

app.whenReady().then(() => {
  // Set dock icon on macOS (in dev the default Electron icon shows otherwise)
  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(path.join(__dirname, "..", "assets", "icon.png"));
  }

  let port;
  if (isDev) {
    // In dev mode, server is started separately by concurrently
    const configPath = path.join(__dirname, "..", "server", "config.js");
    const config = require(configPath);
    port = config.server.port;
  } else {
    try {
      port = startEmbeddedServer();
    } catch (err) {
      console.error("Failed to start embedded server:", err);
      // Fall back to default port so the window still opens
      port = 8080;
    }
  }
  createWindow(port);

  // Check for updates in production
  if (!isDev) {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // Server cleanup happens via its own SIGINT handler
});
