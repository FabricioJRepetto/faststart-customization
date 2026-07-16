import {
    BACKEND_THEMES_CONFIGS_PATH,
    DEFAULT_CONFIG_FILENAME,
    TEMPLATE_CONFIG_FILENAME
} from '@shared/CONSTANTS'
import { AssetData, AssetType, FinalAssetData, TemplateConfig } from '@shared/types'
import {
    AssetsDataAtom,
    CustomEnabledAtom,
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedImagesDataAtom,
    EditedLanguageDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom,
    store,
    TemplateConfigAtom,
    ThemesLibraryDataAtom
} from './context/context'
import { objectFullStructure } from './LangStructureBuilder'
import mediaServiceController from './controllers/mediaServer/mediaServiceController'
import { getMime } from './assetsUtils'
import { preloadThemeMedia } from './AssetsPreLoader'

export const loadTemplate = async (): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            `- fetching ${TEMPLATE_CONFIG_FILENAME}...\n`
        )
        const res = await mediaServiceController.getTemplateConfigFile()

        if (res) {
            console.log(
                `- fetching ${TEMPLATE_CONFIG_FILENAME}. data OK\n`,
                '- Parsing and saving data'
            )
            console.log(res)
            const aux: TemplateConfig = {
                icon: [...parseToAssetData(res.icon, 'icon')],
                image: [...parseToAssetData(res.image, 'image')],
                background: [...parseToAssetData(res.background, 'background')],
                thirdscreen: [],
                audio: [...parseToAssetData(res.audio, 'audio')],
                styles: objectFullStructure(res.styles),
                language: res.language
            }
            store.set(TemplateConfigAtom, aux)
        } else {
            throw new Error(`Error al cargar archivo ${TEMPLATE_CONFIG_FILENAME}`)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

const loadCustomConfig = async (): Promise<void> => {
    try {
        console.log('-----------------------------\n', `- fetching ${DEFAULT_CONFIG_FILENAME}...\n`)
        const res = await mediaServiceController.getDefaultConfigFile()

        if (res) {
            console.log(`- fetching ${DEFAULT_CONFIG_FILENAME}. data OK\n`, '- Saving data')
            console.log(res)
            store.set(DefaultConfigAtom, res)
            store.set(CustomEnabledAtom, res.customEnabled)

            if (res.thirdscreen?.config) {
                store.set(EditedThirdScreenConfigDataAtom, res.thirdscreen.config)
            }
        } else {
            throw new Error(`Error al cargar archivo ${DEFAULT_CONFIG_FILENAME}`)
        }
    } catch (error) {
        console.warn(error)
    }
}

export const loadThemesCollection = async (): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            `- fetching ${BACKEND_THEMES_CONFIGS_PATH}...\n`
        )
        const res = await mediaServiceController.getThemes()

        if (res.length) {
            console.log(`- Themes Collection Library. data OK\n`, '- Saving data')
            console.log(`Collection found (${res.length} themes):`)

            console.log(`Caching themes Assets...`)
            const cachedThemes = await Promise.all(res.map((t) => preloadThemeMedia(t)))

            store.set(ThemesLibraryDataAtom, cachedThemes)
        } else {
            console.warn(`- Libreria de temas vacía\n`)
        }
    } catch (error) {
        console.error(`- Error al libreria de temas:\n`, error)
    }
}

/** Carga assets basandose en la configuración por defecto actual */
export const parseAssets = (): void => {
    try {
        console.log('-----------------------------\n', '- Parsing remote assets...\n')

        const data = store.get(TemplateConfigAtom)
        if (data) {
            // const data = parseConfigToAssetList(config)
            store.set(AssetsDataAtom, data)
            store.set(EditedIconsDataAtom, [...data.icon])
            store.set(EditedImagesDataAtom, [...data.image])
            store.set(EditedBackgroundsDataAtom, [...data.background])
            store.set(EditedAudiosDataAtom, [...data.audio])
            store.set(EditedThirdScreenAssetsDataAtom, [...data.thirdscreen])
        } else {
            throw new Error('No config found')
        }
    } catch (error) {
        console.error(`- Error al parsear assets remotos:\n`, error)
    }
}

const parseToAssetData = (
    list: FinalAssetData[] | { assetName: string }[],
    assetType: AssetType
): AssetData[] => {
    return (
        list?.map((e) => ({
            assetName: e.assetName,
            assetType: assetType,
            original: {
                source: e?.blobUrl || e?.path || '',
                mime: getMime(e?.path)
            },
            custom: {}
        })) || []
    )
}

// const parseConfigToAssetList = (config: CustomConfig): AssetList => {
//     try {
//         const aux: AssetList = {
//             icon: parseToAssetData(config.icon, 'icon'),
//             image: parseToAssetData(config.image, 'image'),
//             background: parseToAssetData(config.background, 'background'),
//             audio: parseToAssetData(config.audio, 'audio'),
//             thirdscreen: parseToAssetData(config.thirdscreen.assets, 'thirdscreen'),
//             other: []
//         }

//         return aux
//     } catch (error) {
//         console.error(error)
//         throw error
//     }
// }

export const remoteBootSequence = async (): Promise<void> => {
    try {
        //* LOAD : template_assets.json
        await loadTemplate()
        validateFiles()
        //* LOAD : customConfig.json
        await loadCustomConfig()

        //* PRE-LOAD : Assets
        // await preloadAssets('blobUrl')
        //* LOAD : Assets
        parseAssets()
        //* Libreria de temas
        await loadThemesCollection()
    } catch (error) {
        console.error('Remote Boot Sequence Error')
        throw error
    }
}

/** Valída que no falten archivos necesarios. EJECUTAR LUEGO DE loadLanguageFile, loadStylesFile Y loadCustomConfigFile*/
export const validateFiles = (): void => {
    const languages = !!Object.keys(store.get(DefaultLanguageDataAtom)).length
    const styles = store.get(DefaultStylesDataAtom)

    if (!languages || !styles) {
        const config = store.get(TemplateConfigAtom)
        if (!config)
            throw new Error(
                `Archivos esenciales no encontrados: ${languages ? '' : 'language.json '}${styles ? '' : 'styles.json '}${config ? '' : 'customConfig.json'}`
            )
        if (!languages) {
            store.set(DefaultLanguageDataAtom, config.language)
            store.set(EditedLanguageDataAtom, objectFullStructure(config.language))
        }
        if (!styles) {
            store.set(DefaultStylesDataAtom, {
                ...config.styles,
                button: {
                    ...config.styles.button,
                    border: config.styles.button?.border.toString()
                },
                secondaryButton: {
                    ...config.styles.secondaryButton,
                    border: config.styles.secondaryButton?.border.toString()
                },
                inputButton: {
                    ...config.styles.inputButton,
                    border: config.styles.inputButton?.border.toString()
                }
            })
        }
    }
}
