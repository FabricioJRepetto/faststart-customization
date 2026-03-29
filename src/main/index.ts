import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { extname, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { readdirSync, readFileSync } from 'fs'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    //_ ============ IPC Handlers ============ _\\

    ipcMain.handle('select-directory', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })

        if (result.canceled) return null
        return result.filePaths[0]
    })

    ipcMain.handle('select-file', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile']
        })

        if (result.canceled) return null
        return result.filePaths[0]
    })

    ipcMain.handle(
        'get-json-data',
        async (
            _event,
            filePath: string
        ): Promise<
            | {
                  success: boolean
                  data: Record<string, Record<string, string>>
                  error?: undefined
              }
            | {
                  success: boolean
                  error: string
                  data?: undefined
              }
        > => {
            try {
                const content = readFileSync(filePath, 'utf-8')
                return { success: true, data: JSON.parse(content) }
            } catch (error) {
                return { success: false, error: (error as Error).message }
            }
        }
    )

    ipcMain.handle('get-files-list', async (_event, dirPath: string): Promise<unknown> => {
        try {
            const types = ['icon', 'background', 'audio', 'thirdscreen', 'other']
            const aux = {
                icon: [],
                background: [],
                audio: [],
                thirdscreen: [],
                other: []
            }
            readdirSync(dirPath, { withFileTypes: true })
                .filter((entry) => !entry.isDirectory())
                .map((entry) => {
                    const auxType = entry.name.split('_')[0]
                    const assetType = types.includes(auxType) ? auxType : 'other'
                    const filePath = dirPath + '/' + entry.name

                    let base64 = ''
                    let mime = ''
                    if (assetType !== 'other') {
                        const buffer = readFileSync(filePath)
                        const ext = extname(filePath).slice(1).toLowerCase()

                        const mimeTypes: Record<string, string> = {
                            png: 'image/png',
                            jpg: 'image/jpeg',
                            jpeg: 'image/jpeg',
                            webp: 'image/webp',
                            svg: 'image/svg+xml',
                            gif: 'image/gif',
                            webm: 'video/webm',
                            mp4: 'video/mp4',
                            mp3: 'audio/mpeg',
                            wav: 'audio/wav'
                        }

                        mime = mimeTypes[ext] ?? 'application/octet-stream'
                        const _base64 = buffer.toString('base64')

                        base64 = `data:${mime};base64,${_base64}`
                    }

                    aux[assetType].push({
                        name: entry.name,
                        customDir: '',
                        assetType,
                        filePath,
                        base64,
                        mimeType: mime
                    })
                })
            return { success: true, data: aux }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        }
    })

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
