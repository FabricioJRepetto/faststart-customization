import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import icon from '../../resources/icon.png?asset'
import { getBase64, manageRawCustomConfig } from './utils'
import { CustomConfig } from '../../shared/types'

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

    ipcMain.handle('select-file', async (_, filter?: string) => {
        try {
            console.log('select-file', filter)

            const auxFilters = {
                Imagenes: {
                    name: 'Imágenes',
                    extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif']
                },
                Videos: { name: 'Videos', extensions: ['webm', 'mp4'] },
                Audio: { name: 'Audio', extensions: ['mp3', 'wav'] },
                ImgSvg: {
                    name: 'Imágenes',
                    extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']
                },
                ImgVideo: {
                    name: 'Imagenes y video',
                    extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'webm', 'mp4']
                },
                Todos: { name: 'Todos', extensions: ['*'] }
            }

            const result = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [auxFilters[filter || 'Todos']]
            })

            if (result.canceled) return null

            const filePath = result.filePaths[0]
            const { base64 } = getBase64(filePath)

            return { success: true, data: { filePath, base64 } }
        } catch (error) {
            console.error(error)
            return { success: false, error: (error as Error).message }
        }
    })

    ipcMain.handle('get-json-data', async (_event, filePath: string): Promise<unknown> => {
        try {
            const content = readFileSync(filePath, 'utf-8')
            return { success: true, data: JSON.parse(content) }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        }
    })

    ipcMain.handle(
        'write-json-file',
        async (
            _event,
            fileData: CustomConfig,
            clientDir: string,
            thirdDir: string
        ): Promise<unknown> => {
            try {
                const finalData = await manageRawCustomConfig(fileData, clientDir, thirdDir)
                const jsonName = '/customConfig.json'

                writeFileSync(clientDir + jsonName, JSON.stringify(finalData, null, 2), 'utf-8')

                return { success: true }
            } catch (error) {
                console.error(error)
                return { success: false }
            }
        }
    )

    ipcMain.handle('get-folders-list', async (_event, dirPath: string): Promise<unknown> => {
        try {
            const aux = readdirSync(dirPath, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .map((e) => e.name)

            return { success: true, data: aux }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        }
    })

    ipcMain.handle('get-files-list', async (_event, dirPaths: string[]): Promise<unknown> => {
        try {
            const types = ['icon', 'background', 'audio', 'thirdscreen', 'other']
            const aux = {
                icon: [],
                background: [],
                audio: [],
                thirdscreen: [],
                other: []
            }
            const read = (dirPath: string): void => {
                readdirSync(dirPath, { withFileTypes: true })
                    .filter((entry) => !entry.isDirectory())
                    .map((entry) => {
                        const auxType = entry.name.split('_')[0]
                        const assetType = types.includes(auxType) ? auxType : 'other'
                        const filePath = dirPath + '/' + entry.name
                        const _name = entry.name.replace(/\.[\w\d]*$/g, '') || entry.name

                        let base64 = ''
                        let mime = ''
                        if (assetType !== 'other') {
                            const { base64: b, mime: m } = getBase64(filePath)
                            base64 = b
                            mime = m
                        }

                        aux[assetType].push({
                            name: _name,
                            assetType,
                            filePath,
                            base64,
                            customPath: '',
                            customBase64: '',
                            mimeType: mime
                        })
                    })
            }
            for (const dir of dirPaths) read(dir)

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
