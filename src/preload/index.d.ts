import { ElectronAPI } from '@electron-toolkit/preload'
import { CustomConfig, filterType } from 'shared/types'

type IpcResponse<T> = Promise<
    | {
          success: true
          data: T
          error?: undefined
      }
    | {
          success: false
          error: string
          data?: undefined
      }
>
declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        electronAPI: {
            selectDirectory: () => Promise<string | null>
            selectFile: (filter?: filterType) => IpcResponse<{ base64: string; filePath: string }>
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
