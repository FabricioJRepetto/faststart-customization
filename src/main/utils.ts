import { copyFileSync, mkdirSync, readFileSync, renameSync, rmSync } from 'fs'
import { basename, dirname, extname, join } from 'path'
import { CustomConfig, CustomConfigKey } from '../renderer/src/types/types'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { CUSTOMS_FOLDER_NAME, TEMP_FOLDER, THEMES_LIBRARY_DIR } from '../renderer/src/CONSTANTS'

const getLibraryDir = (): string => {
    if (is.dev) {
        return join(app.getAppPath(), THEMES_LIBRARY_DIR) // raíz del proyecto en dev
    }
    return join(dirname(app.getPath('exe')), THEMES_LIBRARY_DIR) // junto al exe en prod
}

export const libraryDir = getLibraryDir()

export const getBase64 = (filePath: string): { base64: string; mime: string; fileName: string } => {
    try {
        const buffer = readFileSync(filePath)
        const ext = extname(filePath).slice(1).toLowerCase()
        const name = filePath.replaceAll('\\', '/').split('/').pop()!

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

        return { fileName: name, base64: `data:${mime};base64,${_base64}`, mime }
    } catch (error) {
        console.error(error)
        throw error as Error
    }
}

/** Devuelve los datos finales para el archivo customConfig.json */
export const parseCustomConfig = async (
    rawConfig: CustomConfig,
    basePath?: string
): Promise<CustomConfig | null> => {
    try {
        const keys = Object.keys(rawConfig) as CustomConfigKey[]

        const newConfig: CustomConfig = {
            version: rawConfig.version,
            ID: rawConfig.ID,
            themeName: rawConfig.themeName,
            customEnabled: rawConfig.customEnabled,
            isActive: true,
            styles: rawConfig.styles,
            language: rawConfig.language,
            icon: [],
            image: [],
            background: [],
            thirdscreen: { config: rawConfig.thirdscreen.config, assets: [] },
            audio: []
        }

        for await (const key of keys) {
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'audio' ||
                key === 'thirdscreen'
            ) {
                const parentKey = key === 'thirdscreen' ? rawConfig[key].assets : rawConfig[key]
                const newKey = key === 'thirdscreen' ? newConfig[key].assets : newConfig[key]

                for await (const entry of parentKey) {
                    const root = basePath
                        ? basePath + '/' + CUSTOMS_FOLDER_NAME
                        : CUSTOMS_FOLDER_NAME
                    const newName = entry.name + extname(basename(entry.path))

                    // Modifica el path para que sea relativo
                    const relativePath = root + '/' + newName
                    // Actualiza el pre customConfig
                    newKey.push({ ...entry, path: relativePath })
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
        const client_Temp_Dir = join(paths.clientDir, TEMP_FOLDER)
        const third_Temp_Dir = paths.thirdDir ? join(paths.thirdDir, TEMP_FOLDER) : null
        const sup_Temp_Dir = paths.supDir ? join(paths.supDir, TEMP_FOLDER) : null

        //* 1# - Creamos carpeta _temp_
        mkdirSync(client_Temp_Dir, { recursive: true })
        if (third_Temp_Dir) mkdirSync(third_Temp_Dir, { recursive: true })
        if (sup_Temp_Dir) mkdirSync(sup_Temp_Dir, { recursive: true })

        //* 2# - Movemos archivos a carpeta _temp_
        const keys = Object.keys(rawConfig) as CustomConfigKey[]
        for await (const key of keys) {
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'thirdscreen' ||
                key === 'audio'
            ) {
                const parentKey = key === 'thirdscreen' ? rawConfig[key].assets : rawConfig[key]

                for await (const entry of parentKey) {
                    // Mueve los archivos
                    if (key === 'thirdscreen') {
                        if (third_Temp_Dir)
                            copyFileSync(
                                entry.path,
                                join(third_Temp_Dir, entry.name + extname(basename(entry.path)))
                            )
                    } else {
                        copyFileSync(
                            entry.path,
                            join(client_Temp_Dir, entry.name + extname(basename(entry.path)))
                        )
                        if (sup_Temp_Dir)
                            copyFileSync(
                                entry.path,
                                join(sup_Temp_Dir, entry.name + extname(basename(entry.path)))
                            )
                    }
                }
            }
        }

        //* 3# - Borramos carpeta _customs_
        const client_Custom_Dir = join(paths.clientDir, CUSTOMS_FOLDER_NAME)
        const third_Custom_Dir = paths.thirdDir ? join(paths.thirdDir, CUSTOMS_FOLDER_NAME) : null
        const sup_Custom_Dir = paths.supDir ? join(paths.supDir, CUSTOMS_FOLDER_NAME) : null

        rmSync(client_Custom_Dir, { recursive: true, force: true })
        if (third_Custom_Dir) rmSync(third_Custom_Dir, { recursive: true, force: true })
        if (sup_Custom_Dir) rmSync(sup_Custom_Dir, { recursive: true, force: true })

        //* 4# - Renombramos carpeta _temp_ a _customs_
        renameSync(client_Temp_Dir, client_Custom_Dir)
        if (third_Temp_Dir && third_Custom_Dir) renameSync(third_Temp_Dir, third_Custom_Dir)
        if (sup_Custom_Dir && sup_Temp_Dir) renameSync(sup_Temp_Dir, sup_Custom_Dir)
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
                const parentKey = key === 'thirdscreen' ? rawConfig[key].assets : rawConfig[key]

                for await (const entry of parentKey) {
                    // Mueve los archivos
                    const newName = entry.name + extname(basename(entry.path))
                    copyFileSync(entry.path, join(distDir, newName))
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}

/** Mueve los archivos del tema a las apps indicadas */
export const moveThemeToApps = async (
    rawConfig: CustomConfig,
    paths: {
        clientDir: string
        thirdDir?: string
        supDir?: string
    }
): Promise<void> => {
    try {
        const client_Custom_Dir = join(paths.clientDir, CUSTOMS_FOLDER_NAME)
        const third_Custom_Dir = paths.thirdDir ? join(paths.thirdDir, CUSTOMS_FOLDER_NAME) : null
        const sup_Custom_Dir = paths.supDir ? join(paths.supDir, CUSTOMS_FOLDER_NAME) : null

        //* 1# - Limpiamos carpeta _customs_ para evitar assets duplicados
        rmSync(client_Custom_Dir, { recursive: true, force: true })
        mkdirSync(client_Custom_Dir, { recursive: true })
        if (third_Custom_Dir) {
            rmSync(third_Custom_Dir, { recursive: true, force: true })
            mkdirSync(third_Custom_Dir, { recursive: true })
        }
        if (sup_Custom_Dir) {
            rmSync(sup_Custom_Dir, { recursive: true, force: true })
            mkdirSync(sup_Custom_Dir, { recursive: true })
        }

        //* 2# - Movemos archivos a carpeta _customs_
        const keys = Object.keys(rawConfig) as CustomConfigKey[]
        for await (const key of keys) {
            if (
                key === 'icon' ||
                key === 'background' ||
                key === 'thirdscreen' ||
                key === 'audio'
            ) {
                const parentKey = key === 'thirdscreen' ? rawConfig[key].assets : rawConfig[key]

                for await (const entry of parentKey) {
                    // Mueve los archivos
                    if (key === 'thirdscreen') {
                        if (third_Custom_Dir)
                            copyFileSync(entry.path, join(third_Custom_Dir, basename(entry.path)))
                    } else {
                        copyFileSync(entry.path, join(client_Custom_Dir, basename(entry.path)))
                        if (sup_Custom_Dir && key === 'background')
                            copyFileSync(entry.path, join(sup_Custom_Dir, basename(entry.path)))
                    }
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
