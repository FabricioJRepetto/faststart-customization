import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        electronAPI: {
            selectDirectory: () => Promise<string | null>
            selectFile: () => Promise<string | null>
            getDefaultLanguageData: (filePath: string) => Promise<
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
            >
        }
    }
}
