import { readFileSync } from 'fs'
import { IpcResponse } from '../../../shared/types'

export const getJsonData = async (_event, filePath: string): Promise<IpcResponse<string>> => {
    try {
        const content = readFileSync(filePath, 'utf-8')
        return { success: true, data: JSON.parse(content) }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
