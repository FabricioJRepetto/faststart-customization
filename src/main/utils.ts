import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'fs'
import { basename, dirname, extname, join } from 'path'
import { CustomConfig, CustomConfigKey } from '../../shared/types'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { CUSTOMS_FOLDER_NAME, THEMES_LIBRARY_DIR } from '../../shared/CONSTANTS'

const getLibraryDir = (): string => {
    if (is.dev) {
        return join(app.getAppPath(), THEMES_LIBRARY_DIR) // raíz del proyecto en dev
    }
    return join(dirname(app.getPath('exe')), THEMES_LIBRARY_DIR) // junto al exe en prod
}

export const libraryDir = getLibraryDir()

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
        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        const newConfig: CustomConfig = {
            version: rawConfig.version,
            ID: rawConfig.ID,
            themeName: rawConfig.themeName,
            customEnabled: rawConfig.customEnabled,
            styles: rawConfig.styles,
            language: rawConfig.language,
            icon: [],
            background: [],
            thirdscreen: [],
            audio: []
        }

        for await (const key of keys) {
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'thirdscreen' ||
                key === 'audio'
            ) {
                for await (const entry of rawConfig[key]) {
                    // Modifica el path para que sea relativo
                    const relativePath = join(
                        CUSTOMS_FOLDER_NAME,
                        entry.path.split(/\/|\\/g).pop() || entry.path
                    )
                    // Actualiza el pre customConfig
                    newConfig[key].push({ ...entry, path: relativePath })
                }
            }
        }

        return newConfig
    } catch (error) {
        console.error(error)
        throw error
    }
}

/** Mueve los archivos necesarios a las apps indicadas */
export const moveFilesToApps = async (
    rawConfig: CustomConfig,
    paths: {
        clientDir: string
        thirdDir?: string
        supDir?: string
    }
): Promise<void> => {
    try {
        const clientCustomDir = join(paths.clientDir, CUSTOMS_FOLDER_NAME)
        const thirdCustomDir = paths.thirdDir ? join(paths.thirdDir, CUSTOMS_FOLDER_NAME) : null
        const supCustomDir = paths.supDir ? join(paths.supDir, CUSTOMS_FOLDER_NAME) : null

        console.log(supCustomDir)

        // Limpiamos y creamos directorios
        rmSync(clientCustomDir, { recursive: true, force: true })
        mkdirSync(clientCustomDir, { recursive: true })

        if (thirdCustomDir) {
            rmSync(thirdCustomDir, { recursive: true, force: true })
            mkdirSync(thirdCustomDir, { recursive: true })
        }
        if (supCustomDir) {
            rmSync(supCustomDir, { recursive: true, force: true })
            mkdirSync(supCustomDir, { recursive: true })
        }

        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        for await (const key of keys) {
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'thirdscreen' ||
                key === 'audio'
            ) {
                for await (const entry of rawConfig[key]) {
                    // Mueve los archivos
                    if (key === 'thirdscreen') {
                        if (thirdCustomDir)
                            copyFileSync(entry.path, join(thirdCustomDir, basename(entry.path)))
                    } else {
                        copyFileSync(entry.path, join(clientCustomDir, basename(entry.path)))
                        if (supCustomDir)
                            copyFileSync(entry.path, join(supCustomDir, basename(entry.path)))
                    }
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

/** Mueve los archivos al directorio de libreria de temas */
export const moveFilesToLibrary = async (rawConfig: CustomConfig): Promise<void> => {
    try {
        const distDir = join(libraryDir, rawConfig.themeName, CUSTOMS_FOLDER_NAME)
        console.log('Directorio Libreria:\n', distDir)

        // Creamos directorios
        mkdirSync(distDir, { recursive: true })

        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        for await (const key of keys) {
            // Ignoramos keys que no son necesarias modificar
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'thirdscreen' ||
                key === 'audio'
            ) {
                for await (const entry of rawConfig[key]) {
                    // Mueve los archivos
                    copyFileSync(entry.path, join(distDir, basename(entry.path)))
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}
