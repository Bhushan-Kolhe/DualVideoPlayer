const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path')

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

let mainWindow;

autoUpdater.on('update-available', (updateEvent) => {
    mainWindow.webContents.send('autoUpdater:updateAvailable', updateEvent);
});

autoUpdater.on('update-not-available', (updateEvent) => {
    mainWindow.webContents.send('autoUpdater:updateNotAvailable', updateEvent);
});

autoUpdater.on('update-downloaded', (updateEvent) => {
    mainWindow.webContents.send('autoUpdater:updateDownloaded', updateEvent);
    autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (updateEvent) => {
    mainWindow.webContents.send('autoUpdater:error', updateEvent);
});

autoUpdater.on('download-progress', (updateEvent) => {
    mainWindow.webContents.send("autoUpdater:downloadProgress", updateEvent);
});

const InstallUpdate = () =>
{
    autoUpdater.downloadUpdate();
}

ipcMain.handle('autoUpdater:InstallUpdate', InstallUpdate)

const createWindow = () => 
{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, './src/js/preload.js'),
            devTools: false,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('src/html/index.html');
    mainWindow.setMenuBarVisibility(false);

    const OpenFile = async () =>
    {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            filters: [{ name:'Videos', extensions: ['mp4','mkv','mov','avi'] }],
            properties: ['openFile']
        });

        if (canceled) {
            return null;
        } else {
            return filePaths[0];
        }
    }

    const MinimizeWindow = async() =>
    {
        mainWindow.minimize();
    }

    const ToggleMaximizeWindow = async() =>
    {
        if(mainWindow.isMaximized())
        {
            mainWindow.restore();
            return false;
        }else
        {
            mainWindow.maximize();
            return true;
        }
    }

    const CloseWindow = async() =>
    {
        mainWindow.close();
    }

    ipcMain.handle('dialog:openFile', OpenFile)

    ipcMain.handle('window:minimizeWindow', MinimizeWindow)
    ipcMain.handle('window:toggleMaximizeWindow', ToggleMaximizeWindow)
    ipcMain.handle('window:closeWindow', CloseWindow)

    autoUpdater.checkForUpdatesAndNotify();
}




app.whenReady().then(() => 
{
    createWindow()
});

