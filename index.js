const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path')

const createWindow = () => 
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
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

    ipcMain.handle('dialog:openFile', OpenFile)
}


app.whenReady().then(() => 
{
    createWindow()
});

