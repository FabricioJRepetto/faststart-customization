import { copyFileSync, mkdirSync, readFileSync } from 'fs'
import { basename, extname, join } from 'path'
import { CustomConfig } from '../../shared/types'

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

export const manageRawCustomConfig = async (
    rawConfig: CustomConfig,
    clientDir: string,
    thirdDir: string
): Promise<CustomConfig | null> => {
    try {
        const customsDir = 'customs'
        const destDir = clientDir + '/' + customsDir
        mkdirSync(clientDir + '/customs', { recursive: true })

        const keys = Object.keys(rawConfig)
        console.log(keys)

        const newConfig: CustomConfig = {
            version: '1.0.2',
            customEnabled: rawConfig.customEnabled,
            icon: [],
            background: [],
            thirdscreen: [],
            audio: [],
            styles: rawConfig.styles,
            language: rawConfig.language
        }

        for await (const key of keys) {
            if (key === 'language') {
                // newConfig[key] = rawConfig[key]
                // console.log(rawConfig[key])
                break
            }
            if (key === 'styles') {
                // newConfig[key] = rawConfig[key]
                break
            }
            for await (const entry of rawConfig[key]) {
                const custom = entry.custom?.path
                const originalPath = join('defaults', entry.original.path.split('/').pop())

                const newEntry = { ...entry, original: { ...entry.original, path: originalPath } }

                if (custom) {
                    const fileName = basename(custom)
                    const dest = join(key === 'thirdscreen' ? thirdDir : destDir, fileName)
                    console.log('file name:', fileName, '\ndest:\n', dest)

                    // renameSync(custom, dest) // mueve el archivo
                    copyFileSync(custom, dest)

                    newConfig[key].push({
                        ...newEntry,
                        custom: { ...newEntry.custom, path: join(customsDir, fileName) }
                    })
                } else {
                    console.log('No custom for', entry.name)
                    newConfig[key].push(newEntry)
                }
            }
        }
        console.log('[TEST] final configData:\n', newConfig)

        return newConfig as CustomConfig
    } catch (error) {
        console.error(error)
        return null
    }
}
