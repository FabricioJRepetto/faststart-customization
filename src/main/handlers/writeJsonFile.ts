import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'
import { moveFilesToApps, parseCustomConfig } from '../utils'
import { CUSTOM_CONFIG_FILE_NAME } from '../../../shared/CONSTANTS'

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
            clientDir + CUSTOM_CONFIG_FILE_NAME,
            JSON.stringify(finalData, null, 2),
            'utf-8'
        )
        if (thirdDir)
            writeFileSync(
                thirdDir + CUSTOM_CONFIG_FILE_NAME,
                JSON.stringify(finalData, null, 2),
                'utf-8'
            )
        if (supDir)
            writeFileSync(
                supDir + CUSTOM_CONFIG_FILE_NAME,
                JSON.stringify(finalData, null, 2),
                'utf-8'
            )

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
