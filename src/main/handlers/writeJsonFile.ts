import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../renderer/src/types/types'
import { moveFilesToApps, parseCustomConfig } from '../utils'
import { CUSTOM_CONFIG_FILE_NAME } from '../../renderer/src/CONSTANTS'
import { join } from 'path'

export const applyCurrentConfig = async (
    _event,
    fileData: CustomConfig,
    clientDir: string,
    thirdDir: string,
    supDir: string
): Promise<IpcResponse<undefined>> => {
    try {
        // Movemos archivos a directorios de las apps
        await moveFilesToApps(fileData, { clientDir, thirdDir, supDir })
        // Ordenamos y generamos archivo customConfig.json
        const finalData = await parseCustomConfig(fileData)

        // Movemos el customConfig.json a cada app
        writeFileSync(
            join(clientDir, CUSTOM_CONFIG_FILE_NAME),
            JSON.stringify(finalData, null, 2),
            'utf-8'
        )
        if (thirdDir)
            writeFileSync(
                join(thirdDir, CUSTOM_CONFIG_FILE_NAME),
                JSON.stringify(finalData, null, 2),
                'utf-8'
            )
        if (supDir)
            writeFileSync(
                join(supDir, CUSTOM_CONFIG_FILE_NAME),
                JSON.stringify(finalData, null, 2),
                'utf-8'
            )

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
