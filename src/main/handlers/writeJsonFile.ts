import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'
import { manageRawCustomConfig } from '../utils'

export const writeJsonFile = async (
    _event,
    fileData: CustomConfig,
    clientDir: string,
    thirdDir: string
): Promise<IpcResponse<undefined>> => {
    try {
        const finalData = await manageRawCustomConfig(fileData, clientDir, thirdDir)
        const jsonName = '/customConfig.json'

        writeFileSync(clientDir + jsonName, JSON.stringify(finalData, null, 2), 'utf-8')

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
