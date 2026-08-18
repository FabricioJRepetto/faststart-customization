import { readFileSync } from 'fs'
import { IpcResponse } from '../../renderer/src/types/types'

export const getJsonData = async (_event, filePath: string): IpcResponse<unknown> => {
    try {
        const content = readFileSync(filePath, 'utf-8')
        return { success: true, data: JSON.parse(content) }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
