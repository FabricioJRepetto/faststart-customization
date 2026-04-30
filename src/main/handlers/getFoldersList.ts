import { readdirSync } from 'fs'
import { IpcResponse } from '../../../shared/types'

export const getFoldersList = async (_event, dirPath: string): Promise<IpcResponse<string[]>> => {
    try {
        const aux = readdirSync(dirPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((e) => e.name)

        return { success: true, data: aux }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
