const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    OpenFile: () => ipcRenderer.invoke('dialog:openFile'),
    MinimizeWindow: () => ipcRenderer.invoke('window:minimizeWindow'),
    ToggleMaximizeWindow: () => ipcRenderer.invoke('window:toggleMaximizeWindow'),
    CloseWindow: () => ipcRenderer.invoke('window:closeWindow'),
});

contextBridge.exposeInMainWorld('autoUpdater',{
    UpdateAvailable: (callback) => ipcRenderer.on("autoUpdater:updateAvailable", callback),
    UpdateNotAvailable: (callback) => ipcRenderer.on("autoUpdater:updateNotAvailable", callback),
    UpdateDownloaded: (callback) => ipcRenderer.on("autoUpdater:updateDownloaded", callback),
    Error: (callback) => ipcRenderer.on("autoUpdater:error", callback),
    DownloadProgress: (callback) => ipcRenderer.on("autoUpdater:downloadProgress", callback),
    InstallUpdate: () => ipcRenderer.invoke("autoUpdater:InstallUpdate")
})