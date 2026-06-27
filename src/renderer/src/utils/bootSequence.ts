import {
    BACKEND_THEMES_CONFIGS_PATH,
    CUSTOM_CONFIG_FILE_NAME,
    DEFAULT_ASSETS_DIR,
    DEFAULT_CONFIG_FILENAME,
    DEFAULT_LANGUAGE_DATA_DIR,
    DEFAULT_STYLES_DATA_DIR,
    THEMES_LIBRARY_DIR
} from '@shared/CONSTANTS'
import {
    AssetData,
    AssetList,
    AssetType,
    CustomConfig,
    FinalAssetData,
    LanguageData,
    StylesData,
    ThemeConfig,
    ThirdScreenConfig
} from '@shared/types'
import {
    AssetsDataAtom,
    CustomEnabledAtom,
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom,
    store,
    ThemesLibraryDataAtom
} from './context/context'
import { langDataShell } from './LangStructureBuilder'
import mediaServiceController from './controllers/mediaServer/mediaServiceController'
import { getMime } from './assetsUtils'

/** Consulta y guarda los assets encontrados en las apps Cliente y Tercera pantalla */
export const loadLocalAssets = async (
    clientVersion: string,
    thirdVersion: string
): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            '- Searching assets...\n',
            'Client:',
            clientVersion + '/' + DEFAULT_ASSETS_DIR,
            '\nThirdScreen:',
            thirdVersion + '/' + DEFAULT_ASSETS_DIR
        )

        const aux = [clientVersion, thirdVersion].filter((e) => !!e)

        const resAssets = await window.electronAPI.getFilesList(aux)
        if (resAssets.success) {
            console.log('- Assets data OK\n', '- Saving data')
            const data = resAssets.data as AssetList
            // console.log(JSON.stringify(data))
            store.set(AssetsDataAtom, data as AssetList)
            store.set(EditedIconsDataAtom, [...data.icon] as AssetData[])
            store.set(EditedBackgroundsDataAtom, [...data.background] as AssetData[])
            store.set(EditedAudiosDataAtom, [...data.audio] as AssetData[])
            store.set(EditedThirdScreenAssetsDataAtom, [...data.thirdscreen] as AssetData[])
        } else {
            // console.error('- Error al cargar assets: ' + resAssets.error)
            throw resAssets.error
        }
    } catch (error) {
        console.error('- Error al cargar assets: ', error)
        throw error
    }
}

/** Consulta y guarda el archivo language.json encontrado en la app Cliente */
export const loadLocalLanguageFile = async (clientVersion: string): Promise<boolean> => {
    try {
        console.log(
            '-----------------------------\n',
            '- Searching language.json ...\n',
            'Client:',
            clientVersion + DEFAULT_LANGUAGE_DATA_DIR
        )
        const res = await window.electronAPI.getJsonData(clientVersion + DEFAULT_LANGUAGE_DATA_DIR)
        if (res.success) {
            console.log('- languages.json data OK\n', '- Saving data')

            store.set(DefaultLanguageDataAtom, res.data as LanguageData)
            store.set(EditedLanguageDataAtom, langDataShell(res.data as LanguageData))

            return true
        } else {
            console.warn('- Error al cargar archivo de idioma por defecto:\n' + res.error)
            return false
        }
    } catch (error) {
        console.warn('- Error al cargar archivo de idioma por defecto:\n', error)
        return false
    }
}

/** Consulta y guarda el archivo styles.json encontrado en la app Cliente */
export const loadLocalStylesFile = async (clientVersion: string): Promise<boolean> => {
    try {
        console.log(
            '-----------------------------\n',
            '- Searching styles.json ...\n',
            'Client:',
            clientVersion + DEFAULT_STYLES_DATA_DIR
        )
        const resStyles = await window.electronAPI.getJsonData(
            clientVersion + DEFAULT_STYLES_DATA_DIR
        )
        if (resStyles.success) {
            console.log('- styles.json data OK\n', '- Saving data')
            const data = resStyles.data as StylesData
            store.set(DefaultStylesDataAtom, {
                ...data,
                button: { ...data.button, border: data.button.border?.toString() },
                secondaryButton: { ...data.button, border: data.button.border?.toString() }
            })

            return true
        } else {
            console.warn('- Error al cargar archivo de estilos por defecto:\n' + resStyles.error)
            return false
        }
    } catch (error) {
        console.warn('- Error al cargar archivo de estilos por defecto:\n', error)
        return false
    }
}

/** Consulta y guarda el archivo customConfig.json encontrado en la app Cliente */
export const loadLocalCustomConfigFile = async (clientVersion: string): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            '- Searching customConfig.json...\n',
            'Client:\n',
            clientVersion
        )
        const resCustoms = await window.electronAPI.getJsonData(
            clientVersion + '/' + CUSTOM_CONFIG_FILE_NAME
        )
        if (resCustoms.success) {
            console.log('- customConfig.json data OK\n', '- Saving data')
            // console.log(resCustoms.data)
            store.set(DefaultConfigAtom, resCustoms.data as CustomConfig)
            store.set(CustomEnabledAtom, (resCustoms.data as CustomConfig).customEnabled)

            if (resCustoms.data.thirdScreen?.config) {
                store.set(
                    EditedThirdScreenConfigDataAtom,
                    resCustoms.data.thirdScreen.config as ThirdScreenConfig
                )
            }
        } else {
            console.warn('- Error al cargar archivo customConfig.json:\n' + resCustoms.error)
        }
    } catch (error) {
        console.warn('- Error al cargar archivo customConfig.json:\n', error)
    }
}

/** Valída que no falten archivos necesarios. EJECUTAR LUEGO DE loadLanguageFile, loadStylesFile Y loadCustomConfigFile*/
export const validateFiles = (): void => {
    const languages = !!Object.keys(store.get(DefaultLanguageDataAtom)).length
    const styles = store.get(DefaultStylesDataAtom)

    if (!languages || !styles) {
        const customConfig = store.get(DefaultConfigAtom)
        if (!customConfig)
            throw new Error(
                `Archivos esenciales no encontrados: ${languages ? '' : 'language.json '}${styles ? '' : 'styles.json '}${customConfig ? '' : 'customConfig.json'}`
            )
        if (!languages) {
            store.set(DefaultLanguageDataAtom, customConfig.language)
            store.set(EditedLanguageDataAtom, langDataShell(customConfig.language))
        }
        if (!styles) {
            store.set(DefaultStylesDataAtom, {
                ...customConfig.styles,
                button: {
                    ...customConfig.styles.button,
                    border: customConfig.styles.button?.border.toString()
                },
                secondaryButton: {
                    ...customConfig.styles.secondaryButton,
                    border: customConfig.styles.secondaryButton?.border.toString()
                },
                inputButton: {
                    ...customConfig.styles.inputButton,
                    border: customConfig.styles.inputButton?.border.toString()
                }
            })
        }
    }
}

/** Consulta y guarda en la store los temas guardados en la libreria */
export const loadLocalThemesLibrary = async (): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            '- Searching Themes Library...\n',
            THEMES_LIBRARY_DIR
        )
        const resLibrary = await window.electronAPI.getLibraryThemesList()
        if (resLibrary.success) {
            console.log('- Themes Library data OK\n', '- Saving data')
            console.log(resLibrary.data)
            store.set(ThemesLibraryDataAtom, resLibrary.data as ThemeConfig[])
        } else {
            console.error('- Error al cargar libreria de temas:\n' + resLibrary.error)
        }
    } catch (error) {
        console.error('- Error al cargar libreria de temas:\n', error)
    }
}

//_-_-_-_-_-_-_-_-_-_- REMOTE _-_-_-_-_-_-_-_-_-_-_-

export const loadRemoteCustomConfig = async (): Promise<void> => {
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
        console.error(error)
        throw error
    }
}

export const loadRemoteThemesCollection = async (): Promise<void> => {
    try {
        console.log(
            '-----------------------------\n',
            `- fetching ${BACKEND_THEMES_CONFIGS_PATH}...\n`
        )
        const res = await mediaServiceController.getThemes()

        if (res.length) {
            console.log(`- Themes Collection Library. data OK\n`, '- Saving data')
            console.log(`Collection found (${res.length} themes):`)
            res.map((t) => {
                console.log(' --- ', t.themeName)
                console.log('  · isActive ' + t.isActive)
                console.log('  · isDefaultTheme ' + t.isDefaultTheme)
                console.log('  · customEnabled ' + t.customEnabled)
            })

            store.set(ThemesLibraryDataAtom, res)
        } else {
            console.warn(`- Libreria de temas vacía\n`)
        }
    } catch (error) {
        console.error(`- Error al libreria de temas:\n`, error)
    }
}

/** Carga assets basandose en la configuración por defecto actual */
export const parseRemoteAssets = (): void => {
    try {
        console.log('-----------------------------\n', '- Parsing remote assets...\n')

        const config = store.get(DefaultConfigAtom)
        if (config) {
            const data = parseConfigToAssetList(config)
            store.set(AssetsDataAtom, data)
            store.set(EditedIconsDataAtom, [...data.icon])
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

const parseConfigToAssetList = (config: CustomConfig): AssetList => {
    try {
        const parse = (list: FinalAssetData[], assetType: AssetType): AssetData[] => {
            return list.map((e) => ({
                name: e.name,
                assetType: assetType,
                filePath: e.path,
                base64: '',
                mimeType: getMime(e.path),
                customPath: '',
                customBase64: '',
                customMimeType: ''
            }))
        }
        const aux: AssetList = {
            icon: parse(config.icon, 'icon'),
            background: parse(config.background, 'background'),
            audio: parse(config.audio, 'audio'),
            thirdscreen: parse(config.thirdscreen.assets, 'thirdscreen'),
            other: []
        }

        return aux
    } catch (error) {
        console.error(error)
        throw error
    }
}
