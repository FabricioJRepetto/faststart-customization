import { readdirSync } from 'fs'
import { getBase64 } from '../utils'

export const getFilesList = async (_event, dirPaths: string[]): Promise<unknown> => {
    try {
        const types = ['icon', 'background', 'audio', 'thirdscreen', 'other']
        const aux = {
            icon: [],
            background: [],
            audio: [],
            thirdscreen: [],
            other: []
        }
        const read = (dirPath: string): void => {
            readdirSync(dirPath, { withFileTypes: true })
                .filter((entry) => !entry.isDirectory())
                .map((entry) => {
                    const auxType = entry.name.split('_')[0]
                    const assetType = types.includes(auxType) ? auxType : 'other'
                    const filePath = dirPath + '/' + entry.name
                    const _name = entry.name.replace(/\.[\w\d]*$/g, '') || entry.name

                    let base64 = ''
                    let mime = ''
                    if (assetType !== 'other') {
                        const { base64: b, mime: m } = getBase64(filePath)
                        base64 = b
                        mime = m
                    }

                    aux[assetType].push({
                        name: _name,
                        assetType,
                        filePath,
                        base64,
                        customPath: '',
                        customBase64: '',
                        mimeType: mime
                    })
                })
        }
        for (const dir of dirPaths) read(dir)

        return { success: true, data: aux }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
