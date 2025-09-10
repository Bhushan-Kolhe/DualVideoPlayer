const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    OpenFile: () => ipcRenderer.invoke('dialog:openFile')
});