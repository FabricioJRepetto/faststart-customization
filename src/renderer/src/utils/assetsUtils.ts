import {
    AssetData,
    FinalAssetData,
    FinalStylesData,
    LanguageData,
    StylesData,
    ThirdScreendata
} from '@shared/types'
import {
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom,
    store
} from './context/context'
import { langDataFullStructure } from './LangStructureBuilder'

/** Retorna el nombre del archivo */
export const assetName = (fileName: string): string => {
    return fileName.replace(/^[A-Z]*_/i, '').split('.')[0]
}

type assetType = 'image' | 'svg' | 'video' | 'audio' | 'unknown'
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
        wav: 'audio'
    }

    const ext = fileName.split('.').pop() || ''
    const mime = mimeTypes[ext] ?? 'unknown'
    mime === 'unknown' && console.warn('El tipo de archivo', fileName, 'no está contemplado')
    return mime as assetType
}

export const dataParser = (
    originalDataList: AssetData[],
    newDataList: AssetData[]
): FinalAssetData[] => {
    return originalDataList.map((e) => {
        const custom = newDataList.find((c) => c.name === e.name)
        const _path = custom?.customPath || e.filePath
        const _fileType = assetExtention(custom?.customPath || e.filePath)
        return {
            name: e.name,
            path: _path,
            fileType: _fileType
        }
    })
}

export const thirdDataParser = (): ThirdScreendata => {
    const config = store.get(EditedThirdScreenConfigDataAtom)
    const newThirdAssets = store.get(EditedThirdScreenAssetsDataAtom)

    const assets = newThirdAssets!.map((e) => {
        const _path = e?.customPath || e.filePath
        const _fileType = assetExtention(e?.customPath || e.filePath)
        return {
            name: e.name,
            path: _path,
            fileType: _fileType
        }
    })

    return { config, assets }
}

/** Convierte 'true' o 'false' a booleano */
export const stylesDataParser = (newList: StylesData): FinalStylesData => {
    const ogStyles = store.get(DefaultStylesDataAtom) as StylesData

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
            if ((parent === 'button' || parent === 'secondaryButton') && key === 'border') {
                aux[parent][key] = newList?.[parent]?.[key] === 'true'
            } else if ((parent === 'button' || parent === 'secondaryButton') && key === 'borderRadius') {
                aux[parent][key] = newList?.[parent]?.[key] + 'px'
            } else {
                aux[parent][key] = newList?.[parent]?.[key] || ogStyles![parent][key]
            }
        })
    })
    return aux as FinalStylesData
}

export const languageParser = (newLang: LanguageData): LanguageData => {
    const ogLang = store.get(DefaultLanguageDataAtom)

    const aux = langDataFullStructure(ogLang)
    Object.keys(ogLang).map((lang) => {
        Object.keys(ogLang[lang]).map((key) => {
            aux[lang][key] = newLang[lang][key] ?? ogLang[lang][key]
        })
    })
    return aux
}
