import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { selectDirectory } from './handlers/selectDirectory'
import { selectFile } from './handlers/selectFile'
import { getJsonData } from './handlers/getJsonData'
import { applyCurrentConfig } from './handlers/writeJsonFile'
import { getFoldersList } from './handlers/getFoldersList'
import { getFilesList } from './handlers/getFilesList'
import { toggleCustomEnabled } from './handlers/toggleEnabled'
import { applyThemeData, deleteThemeData, saveThemeData } from './handlers/ThemeData'
import { getLibraryThemesList } from './handlers/getLibraryThemesList'

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        minWidth: 900,
        minHeight: 800,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        icon: join(__dirname, '../../resources/icon.png')
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    //_ ============ IPC Handlers ============ _\\

    ipcMain.handle('select-directory', selectDirectory)

    ipcMain.handle('select-file', selectFile)

    ipcMain.handle('get-json-data', getJsonData)

    ipcMain.handle('get-folders-list', getFoldersList)

    ipcMain.handle('get-files-list', getFilesList)

    ipcMain.handle('apply-current-config', applyCurrentConfig)

    ipcMain.handle('toggle-enable-custom-config', toggleCustomEnabled)

    // Library
    ipcMain.handle('get-library-list', getLibraryThemesList)

    ipcMain.handle('save-theme-data', saveThemeData)

    ipcMain.handle('apply-theme-data', applyThemeData)

    ipcMain.handle('delete-theme-data', deleteThemeData)

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
