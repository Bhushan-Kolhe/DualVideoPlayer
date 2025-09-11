const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    OpenFile: () => ipcRenderer.invoke('dialog:openFile'),
    MinimizeWindow: () => ipcRenderer.invoke('window:minimizeWindow'),
    ToggleMaximizeWindow: () => ipcRenderer.invoke('window:toggleMaximizeWindow'),
    CloseWindow: () => ipcRenderer.invoke('window:closeWindow'),
});