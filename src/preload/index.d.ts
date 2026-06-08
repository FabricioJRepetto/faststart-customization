import { ElectronAPI } from '@electron-toolkit/preload'
import { CustomConfig, filterType, IpcResponse, IpcResponseFileData } from 'shared/types'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        electronAPI: {
            selectDirectory: () => IpcResponse<string>
            selectFile: (filter?: filterType) => IpcResponse<IpcResponseFileData>
            getFilesList: (dirPaths: string[]) => IpcResponse<unknown>
            getFoldersList: (dirPath: string) => IpcResponse<string[]>
            getJsonData: (filePath: string) => IpcResponse<unknown>
            getLibraryThemesList: () => IpcResponse<CustomConfig[]>
            applyCurrentConfig: (
                data: CustomConfig,
                clientDir: string,
                thirdDir: string,
                supDir: string
            ) => IpcResponse<unknown>
            toggleEnabled: (
                data: boolean,
                clientDir: string,
                thirdDir: string,
                supDir: string
            ) => IpcResponse<number>
            saveThemeData: (rawData: CustomConfig) => IpcResponse<unknown>
            applyTheme: (
                themeName: string,
                clientDir: string,
                thirdDir: string,
                supDir: string
            ) => IpcResponse<unknown>
            deleteTheme: (themeName: string) => IpcResponse<unknown>
        }
    }
}
