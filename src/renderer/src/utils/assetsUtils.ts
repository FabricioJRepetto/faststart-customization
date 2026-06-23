import {
    AssetData,
    AssetDataBase,
    FileForUpload,
    FinalAssetData,
    FinalStylesData,
    LanguageData,
    StylesData,
    ThirdScreendata
} from '@shared/types'
import {
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom,
    store
} from './context/context'
import { langDataFullStructure } from './LangStructureBuilder'

/** Retorna el nombre del archivo */
export const assetName = (fileName: string): string => {
    return fileName.replace(/^[A-Z]*_/i, '').split('.')[0]
}

type assetType = 'image' | 'svg' | 'video' | 'audio' | 'json' | 'text' | 'unknown'
/** Retorna el tipo de archivo.
 * @returns
 */
export const assetExtention = (fileName: string): assetType => {
    const mimeTypes: Record<string, string> = {
        png: 'image',
        jpg: 'image',
        jpeg: 'image',
        webp: 'image',
        gif: 'image',
        svg: 'svg',
        webm: 'video',
        mp4: 'video',
        mp3: 'audio',
        wav: 'audio',
        json: 'json',
        txt: 'text'
    }

    const ext = fileName.split('.').pop() || ''
    const mime = mimeTypes[ext] ?? 'unknown'
    mime === 'unknown' && console.warn('El tipo de archivo', fileName, 'no está contemplado')
    return mime as assetType
}

export const assetsToFiles = async (
    originalDataList: AssetData[],
    newDataList: AssetData[]
): Promise<FileForUpload[]> => {
    const aux: FileForUpload[] = []

    for await (const e of originalDataList) {
        const custom = newDataList.find((c) => c.name === e.name)
        if (custom?.customBase64) {
            const _fileName = custom.customPath.replaceAll('\\', '/').split('/').pop()!
            const file = await b64ToFile(custom.customBase64, _fileName)
            aux.push({ file, assetName: e.name })
        }
    }

    return aux
}

export const thirdAssetsToFiles = async (
    dataList: AssetData[]
): Promise<FileForUpload[]> => {
    const aux: FileForUpload[] = []

    for await (const e of dataList) {
        if (e?.customBase64) {
            const _fileName = e.customPath.replaceAll('\\', '/').split('/').pop()!
            const file = await b64ToFile(e.customBase64, _fileName)
            aux.push({ file, assetName: e.name })
        }
    }

    return aux
}

export async function b64ToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type })
}

export const dataParser = (
    originalDataList: AssetData[],
    newDataList: AssetDataBase[]
): FinalAssetData[] => {
    return originalDataList.map((e) => {
        const custom = newDataList.find((c) => c.name === e.name)
        const _path = custom?.customPath || e.filePath
        return {
            name: e.name,
            path: _path,
            fileType: assetExtention(_path)
        }
    })
}

export const thirdDataParser = (remotePaths?: AssetDataBase[]): ThirdScreendata => {
    const config = store.get(EditedThirdScreenConfigDataAtom)
    const newThirdAssets = store.get(EditedThirdScreenAssetsDataAtom)

    const assets = newThirdAssets!.map((e) => {
        const remote = remotePaths?.find((e) => e.name)
        const _path = remote?.customPath || e?.customPath || e.filePath
        return {
            name: e.name,
            path: _path,
            fileType: assetExtention(_path)
        }
    })

    return { config, assets }
}

/** Convierte 'true' o 'false' a booleano */
export const stylesDataParser = (): FinalStylesData => {
    const ogStyles = store.get(DefaultStylesDataAtom) as StylesData
    const newList = store.get(EditedStylesDataAtom)

    const aux: FinalStylesData = {
        logo: {
            dark: '',
            light: ''
        },
        general: {
            primaryColor: '',
            secondaryColor: '',
            errorMessageColor: ''
        },
        successScreen: {
            primaryColor: '',
            secondaryColor: ''
        },
        errorScreen: {
            primaryColor: '',
            secondaryColor: ''
        },
        button: {
            border: false,
            borderRadius: '',
            color: '',
            background: ''
        },
        secondaryButton: {
            border: false,
            borderRadius: '',
            color: '',
            background: ''
        },
        inputButton: {
            border: false,
            borderRadius: '',
            color: '',
            background: ''
        }
    }
    Object.keys(ogStyles!).map((_parent) => {
        const parent = _parent as keyof FinalStylesData
        Object.keys(ogStyles![parent]).map((key) => {
            if (
                (parent === 'button' || parent === 'secondaryButton' || parent === 'inputButton') &&
                key === 'border'
            ) {
                aux[parent][key] = newList?.[parent]?.[key] === 'true'
            } else if (
                (parent === 'button' || parent === 'secondaryButton' || parent === 'inputButton') &&
                key === 'borderRadius'
            ) {
                aux[parent][key] = (newList?.[parent]?.[key] ?? 0) + 'px'
            } else {
                aux[parent][key] = newList?.[parent]?.[key] || ogStyles![parent][key]
            }
        })
    })
    return aux as FinalStylesData
}

export const languageParser = (): LanguageData => {
    const ogLang = store.get(DefaultLanguageDataAtom)
    const newLang = store.get(EditedLanguageDataAtom)

    const aux = langDataFullStructure(ogLang)
    Object.keys(ogLang).map((lang) => {
        Object.keys(ogLang[lang]).map((key) => {
            aux[lang][key] = newLang[lang][key] ?? ogLang[lang][key]
        })
    })
    return aux
}

export const getMime = (path: string): string => {
    try {
        const ext = path.split('/').pop()!.split('.').pop()!.toLowerCase()
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
        return mimeTypes[ext] ?? 'application/octet-stream'
    } catch (error) {
        console.error(error)
        return 'application/octet-stream'
    }
}
