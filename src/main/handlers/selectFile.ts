import { dialog } from 'electron'
import { getBase64 } from '../utils'
import { IpcResponse, IpcResponseFileData } from '../../../shared/types'

const auxFilters = {
    Imagenes: {
        name: 'Imágenes',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif']
    },
    Videos: { name: 'Videos', extensions: ['webm'] },
    Audio: { name: 'Audio', extensions: ['mp3', 'wav'] },
    ImgSvg: {
        name: 'Imágenes',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']
    },
    ImgVideo: {
        name: 'Imagenes y video',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'webm']
    },
    Todos: { name: 'Todos', extensions: ['*'] }
}

export const selectFile = async (_, filter?: string): Promise<IpcResponse<IpcResponseFileData>> => {
    try {
        console.log('select-file', filter)

        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [auxFilters[filter || 'Todos']]
        })

        if (result.canceled) return { success: false, error: 'Cancelado' }

        const filePath = result.filePaths[0]
        const { fileName, base64, mime } = getBase64(filePath)

        return {
            success: true,
            data: {
                fileName,
                filePath,
                base64,
                customMimeType: mime,
                mimeType: ''
            }
        }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
