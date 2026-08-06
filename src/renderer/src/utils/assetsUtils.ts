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
import { objectFullStructure } from './LangStructureBuilder'

/** Retorna el nombre del archivo */
export const assetName = (fileName: string): string => {
    return fileName.replace(/^[A-Z]*_/i, '').split('.')[0]
}

export type FinalAssetType = 'image' | 'svg' | 'video' | 'audio' | 'json' | 'text' | 'unknown'
/** Retorna el tipo de archivo.
 * @returns
 */
export const assetExtention = (fileName: string): FinalAssetType => {
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
    return mime as FinalAssetType
}

export const assetsToFiles = async (
    originalDataList: AssetData[],
    newDataList: AssetData[],
    uploadEverything: boolean,
): Promise<FileForUpload[]> => {
    const aux: FileForUpload[] = []

    // Itera la lista "template" de assets requeridos
    for await (const e of originalDataList) {
        const asset = newDataList.find((c) => c.assetName === e.assetName)
        console.error("asset")
        console.log(asset)
        
        // Hay archivo nuevo?
        if (asset?.custom.source) {
            const file = await b64ToFile(asset.custom.source, asset.custom.fileName!)
            aux.push({ file, assetName: e.assetName })

            // Subir original si existe?
        } else if (uploadEverything && asset?.original?.source && asset?.original?.fileName) {
            // oldPath = themeConfig?.find((a) => a.name === e.assetName)?.path
            const ogFile = await b64ToFile(asset.original.source, asset.original.fileName)
            aux.push({ file: ogFile, assetName: e.assetName })
        }
    }
    
    return aux
}

export const thirdAssetsToFiles = async (dataList: AssetData[]): Promise<FileForUpload[]> => {
    const aux: FileForUpload[] = []

    for await (const e of dataList) {
        if (e?.custom.source) {
            const file = await b64ToFile(e.custom.source, e.custom.fileName!)
            aux.push({ file, assetName: e.assetName })
        }
    }

    return aux
}

export async function b64ToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type })
}

/**  */
export const dataParser = (
    originalDataList: AssetData[],
    newDataList: AssetDataBase[],
    originalConfig?: FinalAssetData[]
): FinalAssetData[] => {
    return originalDataList
        .map((e) => {
            const original = originalConfig?.find((o) => o.name === e.assetName)
            const custom = newDataList.find((c) => c.assetName === e.assetName)

            const _path = custom ? custom.custom.source : original?.path
            if (!_path) return null

            return {
                name: e.assetName,
                path: _path,
                fileType: assetExtention(_path)
            }
        })
        .filter((e) => e !== null)
}

export const thirdDataParser = (remotePaths: AssetDataBase[]): ThirdScreendata => {
    const config = store.get(EditedThirdScreenConfigDataAtom)
    const newThirdAssets = store.get(EditedThirdScreenAssetsDataAtom)

    const assets =
        newThirdAssets
            ?.map((e) => {
                const remote = remotePaths.find((t) => t.assetName === e.assetName)
                if (!remote) return null
                const _path = remote.custom.source!
                return {
                    name: e.assetName,
                    path: _path,
                    fileType: assetExtention(_path)
                }
            })
            .filter((e) => e !== null) || []

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
        idle: {
            primaryColor: '',
            secondaryColor: ''
        },
        userAction: {
            primaryColor: '',
            secondaryColor: '',
            errorMessageColor: ''
        },
        infoScreen: {
            primaryColor: '',
            secondaryColor: ''
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

    const aux: LanguageData = objectFullStructure(ogLang)
    Object.keys(ogLang).map((lang) => {
        Object.keys(ogLang[lang]).map((section) => {
            const finalSection: Record<string, string> = {}
            Object.keys(ogLang[lang][section]).map((key) => {
                finalSection[key] = newLang[lang][section][key] || ogLang[lang][section][key]
            })
            aux[lang][section] = finalSection
        })
    })
    return aux
}

export const getMime = (path: string): string => {
    try {
        const ext = path?.split('/')?.pop()?.split('.')?.pop()?.toLowerCase() ?? ''
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
        return mimeTypes[ext] ?? ''
    } catch (error) {
        console.error(error)
        return ''
    }
}
