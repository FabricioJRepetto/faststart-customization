import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'

export const toggleCustomEnabled = async (
    _event,
    fileData: CustomConfig,
    clientDir: string
): Promise<IpcResponse<undefined>> => {
    try {
        const jsonName = '/customConfig.json'

        writeFileSync(clientDir + jsonName, JSON.stringify(fileData, null, 2), 'utf-8')

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
