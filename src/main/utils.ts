import { copyFileSync, mkdirSync, readFileSync } from 'fs'
import { basename, extname, join } from 'path'
import { CustomConfig, CustomConfigKey } from '../../shared/types'

export const getBase64 = (filePath: string): { base64: string; mime: string } => {
    try {
        const buffer = readFileSync(filePath)
        const ext = extname(filePath).slice(1).toLowerCase()

        const mimeTypes: Record<string, string> = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            webp: 'image/webp',
            svg: 'image/svg+xml',
            gif: 'image/gif',
            webm: 'video/webm',
            mp4: 'video/mp4',
            mp3: 'audio/mpeg',
            wav: 'audio/wav'
        }

        const mime = mimeTypes[ext] ?? 'application/octet-stream'
        const _base64 = buffer.toString('base64')

        return { base64: `data:${mime};base64,${_base64}`, mime }
    } catch (error) {
        console.error(error)
        throw error as Error
    }
}

/** Devuelve los datos finales para el archivo customConfig.json */
export const parseCustomConfig = async (rawConfig: CustomConfig): Promise<CustomConfig | null> => {
    try {
        const customsDir = 'customs'
        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        const newConfig: CustomConfig = {
            version: rawConfig.version,
            ID: rawConfig.ID,
            customEnabled: rawConfig.customEnabled,
            icon: [],
            background: [],
            thirdscreen: [],
            audio: [],
            styles: rawConfig.styles,
            language: rawConfig.language
        }

        for await (const key of keys) {
            // Ignoramos keys que no son necesarias modificar
            if (
                key === 'language' ||
                key === 'styles' ||
                key === 'version' ||
                key === 'ID' ||
                key === 'customEnabled'
            )
                break
            for await (const entry of rawConfig[key]) {
                // Modifica el path para que sea relativo
                const relativePath = join(customsDir, entry.path.split('/').pop())
                // Actualiza el pre customConfig
                newConfig[key].push({ ...entry, path: relativePath })
            }
        }
        console.log('[TEST] final configData:\n', newConfig)

        return newConfig
    } catch (error) {
        console.error(error)
        return null
    }
}

/** Mueve los archivos necesarios a las apps */
export const moveFilesToApps = async (
    rawConfig: CustomConfig,
    clientDir: string,
    thirdDir: string,
    supDir?: string
): Promise<void> => {
    try {
        const customsDir = 'customs'
        const clientCustomDir = clientDir + '/' + customsDir
        const thirdCustomDir = thirdDir + '/' + customsDir
        const supCustomDir = supDir ? supDir + '/' + customsDir : null
        // Creamos directorios
        mkdirSync(clientCustomDir, { recursive: true })
        mkdirSync(thirdCustomDir, { recursive: true })
        if (supCustomDir) mkdirSync(supCustomDir, { recursive: true })

        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        for await (const key of keys) {
            // Ignoramos keys que no son necesarias modificar
            if (
                key === 'language' ||
                key === 'styles' ||
                key === 'version' ||
                key === 'ID' ||
                key === 'customEnabled'
            )
                break
            for await (const entry of rawConfig[key]) {
                // Mueve los archivos
                if (key === 'thirdscreen') {
                    copyFileSync(entry.path, join(thirdCustomDir, basename(entry.path)))
                } else {
                    copyFileSync(entry.path, join(clientCustomDir, basename(entry.path)))
                    if (supCustomDir)
                        copyFileSync(entry.path, join(supCustomDir, basename(entry.path)))
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}

/** Mueve los archivos al directorio de libreria de temas */
export const moveFilesToLibrary = async (
    rawConfig: CustomConfig,
    themeName: string,
    configFile: string
): Promise<void> => {
    try {
        const customsDir = 'customs'
        // Creamos directorios
        mkdirSync(clientCustomDir, { recursive: true })

        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        for await (const key of keys) {
            // Ignoramos keys que no son necesarias modificar
            if (
                key === 'language' ||
                key === 'styles' ||
                key === 'version' ||
                key === 'ID' ||
                key === 'customEnabled'
            )
                break
            for await (const entry of rawConfig[key]) {
                // Mueve los archivos
                copyFileSync(entry.path, join(thirdCustomDir, basename(entry.path)))
            }
        }
    } catch (error) {
        console.error(error)
    }
}
