import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../../shared/types'
import { libraryDir, moveFilesToLibrary, moveThemeToApps, parseCustomConfig } from '../utils'
import { basename, join } from 'path'
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

export const applyThemeData = async (
    _event,
    themeName: string,
    clientDir: string,
    thirdDir: string,
    supDir: string
): Promise<IpcResponse<undefined>> => {
    try {
        const themeConfigDir = join(libraryDir, themeName, CUSTOM_CONFIG_FILE_NAME)
        // Leemos el customConfig.json del tema
        const themeConfig: CustomConfig = JSON.parse(readFileSync(themeConfigDir, 'utf-8'))

        // Modificamos los paths de cada archivo para poder moverlos
        // (se hace de esta forma para que el customConfig cuardado en la libreria pueda pegarse manualmente en las apps y funcione)
        const tempData = await parseCustomConfig(themeConfig, join(libraryDir, themeName))
        console.log('tempData: ', tempData)

        // Movemos archivos a las apps
        await moveThemeToApps(tempData!, { clientDir, thirdDir, supDir })

        // Movemos el customConfig.json al directorio de cada app
        copyFileSync(themeConfigDir, join(clientDir, basename(themeConfigDir)))
        copyFileSync(themeConfigDir, join(thirdDir, basename(themeConfigDir)))
        copyFileSync(themeConfigDir, join(supDir, basename(themeConfigDir)))

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}

export const deleteThemeData = async (
    _event,
    themeName: string
): Promise<IpcResponse<undefined>> => {
    try {
        // Movemos el customConfig.json al directorio de libreria de temas
        rmSync(join(libraryDir, themeName), { recursive: true, force: true })

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
