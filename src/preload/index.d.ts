import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        electronAPI: {
            selectDirectory: () => Promise<string | null>
            selectFile: () => Promise<string | null>
            getFilesList: (dirPath: string) => Promise<
                | {
                      success: boolean
                      data: unknown
                      error?: undefined
                  }
                | {
                      success: boolean
                      error: string
                      data?: undefined
                  }
            >
            getJsonData: (filePath: string) => Promise<
                | {
                      success: boolean
                      data: unknown
                      error?: undefined
                  }
                | {
                      success: boolean
                      error: string
                      data?: undefined
                  }
            >
        }
    }
}
