import {
    BACKEND_DELETE,
    BACKEND_GET_FILE,
    BACKEND_GET_FILELIST,
    BACKEND_POST_UPLOAD
} from '@shared/CONSTANTS'
import {
    CustomConfig,
    DBFile,
    MediaServiceBase,
    RawDBFilesListRes,
    RawDBUploadFileRes
} from '@shared/types'

export default class _TempMediaServer implements MediaServiceBase {
    private async getFilesList(): Promise<RawDBFilesListRes | null> {
        try {
            const res = await fetch(BACKEND_GET_FILELIST)
                .then((r) => r.json())
                .then((r) => r as RawDBFilesListRes)
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    private async getFile<T>(filePath: string): Promise<T | null> {
        try {
            const res = await fetch(`${BACKEND_GET_FILE}/${filePath}`)
                .then((r) => r.json())
                .then((r) => r)
            return res as T
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async delete(path: string): Promise<boolean> {
        try {
            const res = await fetch(`${BACKEND_DELETE}/${path}`)
            return res.ok
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async uploadFile(file: File | Blob, path: string, fileName?: string): Promise<DBFile | null> {
        try {
            const formData = new FormData()
            formData.append('file', file, fileName)
            formData.append('folder', path)

            const res = await fetch(BACKEND_POST_UPLOAD, {
                method: 'POST',
                body: formData
            })
                .then((r) => r.json())
                .then((r) => r as RawDBUploadFileRes)

            if (!res.ok) return null

            return res.file
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getThemesList(): Promise<CustomConfig[] | null> {
        try {
            const res = await this.getFilesList()

            if (res?.files) {
                const regEx = new RegExp(/^themes\/configurations\/[\w-]+_themeConfig.json$/)
                const filesList = res.files.filter((file) => regEx.test(file.path))

                if (filesList.length === 0) return null

                const aux: CustomConfig[] = []
                for await (const file of filesList) {
                    const res = await this.getFile<CustomConfig>(file.path)
                    if (res) aux.push(res)
                }
                return aux
            } else {
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getDefaultConfig(): Promise<CustomConfig | null> {
        try {
            const res = await this.getFile<CustomConfig>('customConfig.json')
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }
}
