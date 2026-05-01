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
            writeJsonData: (data: CustomConfig, clientDir: string, thirdDir: string) =>
                ipcRenderer.invoke('write-json-file', data, clientDir, thirdDir),
            toggleEnabled: (data: CustomConfig, clientDir: string) =>
                ipcRenderer.invoke('toggle-enable-custom-config', data, clientDir)
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
