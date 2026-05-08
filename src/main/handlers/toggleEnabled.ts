import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'

export const toggleCustomEnabled = async (
    _event,
    fileData: CustomConfig,
    clientDir: string,
    thirdDir: string,
    supDir?: string
): Promise<IpcResponse<undefined>> => {
    try {
        const jsonName = '/customConfig.json'

        writeFileSync(clientDir + jsonName, JSON.stringify(fileData, null, 2), 'utf-8').catch(
            console.error
        )
        writeFileSync(thirdDir + jsonName, JSON.stringify(fileData, null, 2), 'utf-8').catch(
            console.error
        )
        if (supDir)
            writeFileSync(supDir + jsonName, JSON.stringify(fileData, null, 2), 'utf-8').catch(
                console.error
            )

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
