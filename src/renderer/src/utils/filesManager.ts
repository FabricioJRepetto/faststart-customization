import { CUSTOM_CONFIG_FILE_NAME } from '@renderer/CONSTANTS'

export async function extractFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
    const items = Array.from(dataTransfer.items)
    const entries = items
        .map((item) => item.webkitGetAsEntry && item.webkitGetAsEntry())
        .filter((e) => !!e)

    if (entries.length === 0) {
        return Array.from(dataTransfer.files)
    }

    const nested = await Promise.all(entries.map(readEntry))
    return nested.flat()
}

export const ACCEPTED_EXTENSIONS = [
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.mp3',
    '.wav',
    '.ogg',
    '.mp4',
    '.webm',
    '.mov'
]

export function getAssetNameFromFile(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, '')
}

export function isConfigFile(file: File): boolean {
    return file.name === CUSTOM_CONFIG_FILE_NAME
}

export function hasAllowedExtension(file: File, customExtensions?: string[]): boolean {
    const lowerName = file.name.toLowerCase()
    return (customExtensions ?? ACCEPTED_EXTENSIONS).some((ext) => lowerName.endsWith(ext))
}

export function getFileExtension(file: File): string {
    const lowerName = file.name.toLowerCase()
    return lowerName.split('.')!.pop()!
}

// Recorre recursivamente una carpeta soltada vía drag & drop
export async function readEntry(entry: FileSystemEntry): Promise<File[]> {
    if (entry.isFile) {
        const _entry = entry as FileSystemFileEntry
        return new Promise((resolve) => {
            _entry.file((file) => resolve([file]))
        })
    }

    if (entry.isDirectory) {
        const reader = (entry as FileSystemDirectoryEntry).createReader()
        const entries: FileSystemEntry[] = await new Promise((resolve) => {
            reader.readEntries(resolve)
        })
        const nested = await Promise.all(entries.map((e) => readEntry(e)))
        return nested.flat()
    }

    return []
}

export const fileToBase64 = async (f: File): Promise<string | ArrayBuffer | null> => {
    try {
        const b64 = new Promise((resolve: (v: string | ArrayBuffer | null) => void, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(f)
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(null)
        })
        return b64
    } catch (error) {
        console.error(error)
        return null
    }
}
