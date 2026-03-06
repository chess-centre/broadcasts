const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

let mainWindow = null;

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
  const port = startEmbeddedServer();
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
