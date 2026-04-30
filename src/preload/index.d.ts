import { ElectronAPI } from '@electron-toolkit/preload'
import { CustomConfig, filterType, IpcResponse, IpcResponseFileData } from 'shared/types'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        electronAPI: {
            selectDirectory: () => Promise<string | null>
            selectFile: (filter?: filterType) => IpcResponse<IpcResponseFileData>
            getFilesList: (dirPaths: string[]) => IpcResponse<unknown>
            getFoldersList: (dirPath: string) => IpcResponse<string[]>
            getJsonData: (filePath: string) => IpcResponse<unknown>
            writeJsonData: (
                data: CustomConfig,
                clientDir: string,
                thirdDir: string
            ) => IpcResponse<unknown>
        }
    }
}
