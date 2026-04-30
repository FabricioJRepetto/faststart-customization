import { dialog } from 'electron'
import { IpcResponse } from '../../../shared/types'

export const selectDirectory = async (): Promise<IpcResponse<string>> => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })

        if (result.canceled) return { success: false, error: 'Cancelado' }
        return { success: true, data: result.filePaths[0] }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
