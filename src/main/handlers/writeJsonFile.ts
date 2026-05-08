import { writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'
import { moveFilesToApps, parseCustomConfig } from '../utils'

export const writeJsonFile = async (
    _event,
    fileData: CustomConfig,
    clientDir: string,
    thirdDir: string,
    supDir?: string
): Promise<IpcResponse<undefined>> => {
    try {
        // Movemos archivos a directorios de las apps
        await moveFilesToApps(fileData, clientDir, thirdDir, supDir)
        // Ordenamos y generamos archivo customConfig.json
        const finalData = await parseCustomConfig(fileData, clientDir, thirdDir, supDir)
        const jsonName = '/customConfig.json'

        // Movemos el customConfig.json a cada app
        writeFileSync(clientDir + jsonName, JSON.stringify(finalData, null, 2), 'utf-8')
        writeFileSync(thirdDir + jsonName, JSON.stringify(finalData, null, 2), 'utf-8')
        if (supDir) writeFileSync(supDir + jsonName, JSON.stringify(finalData, null, 2), 'utf-8')

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
