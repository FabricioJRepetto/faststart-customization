import { copyFileSync, mkdirSync, readFileSync } from 'fs'
import { basename, extname, join } from 'path'

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

interface FinalAssetData {
    name: string
    original: { path: string; fileType: string } | string
    custom?: { path: string; fileType: string } | string
}
export interface CustomConfig {
    icon: FinalAssetData[]
    color: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: FinalAssetData[]
    audio: FinalAssetData[]
    language: Record<string, Record<string, string>>
}
export const manageRawCustomConfig = async (
    rawConfig: CustomConfig,
    clientDir: string,
    thirdDir: string
): Promise<CustomConfig | null> => {
    try {
        const destDir = clientDir + '/customs'
        mkdirSync(clientDir + '/customs', { recursive: true })

        const keys = Object.keys(rawConfig)

        const aux: CustomConfig = {
            icon: [],
            color: [],
            background: [],
            thirdscreen: [],
            audio: [],
            language: {}
        }

        for await (const key of keys) {
            if (key === 'language') {
                aux[key] = rawConfig[key]
                break
            }
            for await (const entry of rawConfig[key]) {
                if (key === 'color') {
                    aux[key] = rawConfig[key]
                    break
                } else {
                    const custom = entry.custom?.path
                    if (custom) {
                        const fileName = basename(custom)
                        const dest = join(key === 'thirdscreen' ? thirdDir : destDir, fileName)
                        console.log('file name:', fileName, '\ndest:\n', dest)

                        // renameSync(custom, dest) // mueve el archivo
                        copyFileSync(custom, dest)

                        aux[key].push({ ...entry, custom: { ...entry.custom, path: dest } })
                    } else {
                        console.log('No custom for', entry.name)
                        aux[key].push(entry)
                    }
                }
            }
        }
        console.log('[TEST] final configData:\n', aux)

        return aux as CustomConfig
    } catch (error) {
        console.error(error)
        return null
    }
}
