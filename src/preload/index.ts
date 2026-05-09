import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CustomConfig } from '../../shared/types'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
        contextBridge.exposeInMainWorld('electronAPI', {
            selectDirectory: () => ipcRenderer.invoke('select-directory'),
            selectFile: (filterType?: string) => ipcRenderer.invoke('select-file', filterType),
            getFilesList: (dirPaths: string[]) => ipcRenderer.invoke('get-files-list', dirPaths),
            getFoldersList: (dirPath: string) => ipcRenderer.invoke('get-folders-list', dirPath),
            getJsonData: (filePath: string) => ipcRenderer.invoke('get-json-data', filePath),
            getLibraryThemesList: () => ipcRenderer.invoke('get-library-list'),
            applyCurrentConfig: (
                data: CustomConfig,
                clientDir: string,
                thirdDir: string,
                supDir: string
            ) => ipcRenderer.invoke('apply-current-config', data, clientDir, thirdDir, supDir),
            toggleEnabled: (data: boolean, clientDir: string, thirdDir: string, supDir: string) =>
                ipcRenderer.invoke(
                    'toggle-enable-custom-config',
                    data,
                    clientDir,
                    thirdDir,
                    supDir
                ),
            saveThemeData: (rawData: CustomConfig) => ipcRenderer.invoke('save-theme-data', rawData)
        })
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
