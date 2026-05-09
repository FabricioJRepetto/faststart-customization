import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'
import { libraryDir, moveFilesToLibrary, parseCustomConfig } from '../utils'
import { join } from 'path'
import { CUSTOM_CONFIG_FILE_NAME } from '../../../shared/CONSTANTS'

export const saveThemeData = async (
    _event,
    rawData: CustomConfig
): Promise<IpcResponse<undefined>> => {
    try {
        // Movemos archivos al directorio de libreria de temas
        await moveFilesToLibrary(rawData)
        // Ordenamos y generamos archivo customConfig.json
        const finalData = await parseCustomConfig(rawData)

        // Movemos el customConfig.json al directorio de libreria de temas
        writeFileSync(
            join(libraryDir, rawData.themeName, CUSTOM_CONFIG_FILE_NAME),
            JSON.stringify(finalData, null, 2),
            'utf-8'
        )

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
