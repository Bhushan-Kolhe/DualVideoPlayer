const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path')

const createWindow = () => 
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, './src/js/preload.js')
        }
    });

    win.loadFile('src/html/index.html');
    win.setMenuBarVisibility(false);

    const OpenFile = async () =>
    {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
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
        win.minimize();
    }

    const ToggleMaximizeWindow = async() =>
    {
        if(win.isMaximized())
        {
            win.restore();
            return false;
        }else
        {
            win.maximize();
            return true;
        }
    }

    const CloseWindow = async() =>
    {
        win.close();
    }

    ipcMain.handle('dialog:openFile', OpenFile)

    ipcMain.handle('window:minimizeWindow', MinimizeWindow)
    ipcMain.handle('window:toggleMaximizeWindow', ToggleMaximizeWindow)
    ipcMain.handle('window:closeWindow', CloseWindow)
}


app.whenReady().then(() => 
{
    createWindow()
});

