const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getServerPort: () => ipcRenderer.invoke("get-server-port"),
  selectDGTPath: () => ipcRenderer.invoke("select-dgt-path"),
  openViewerWindow: () => ipcRenderer.invoke("open-viewer-window"),
  isElectron: true,
});
