const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getServerPort: () => ipcRenderer.invoke("get-server-port"),
  selectDGTPath: () => ipcRenderer.invoke("select-dgt-path"),
  isElectron: true,
});
