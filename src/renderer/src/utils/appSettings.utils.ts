// import { APPSETTINGS_CONFIGURATION_MODULE } from './CONSTANTS'
// import { AppSettingsAtom, DefaultConfigAtom, store } from './context/context'
// import { StylesData, ConfigContextData } from '@shared/types'

/** Retorna todos los datos seteados en el appSettings de TerminalServices */
// export const getAppSettingsData = (): ConfigContextData | undefined => {
//     try {
//         const appsettings = store.get(AppSettingsAtom)

//         if (!appsettings) {
//             console.error('AppSettings not found in store')
//             return
//         }

//         return appsettings?.Modules.find((e) => e.Assembly === APPSETTINGS_CONFIGURATION_MODULE)
//             ?.Options?.Contexts[0].Data
//     } catch (error) {
//         console.error('getConfigData', error)
//         return
//     }
// }

/** Retorna todos los datos seteados en el CustomConfig por defecto */
// export const getConfigData = (): StylesData | undefined => {
//     try {
//         const config = store.get(DefaultConfigAtom)

//         if (!config) {
//             console.error('Default CustomConfig not found in store')
//             return
//         }

//         return { ...config.styles, buttonBorder: config.styles.buttonBorder ? 'true' : 'false' }
//     } catch (error) {
//         console.error('getConfigData', error)
//         return
//     }
// }

/** Retorna los datos de colores seteados en el appSettings deTerminalServices */
// export const getStylesData = (): StylesData => {
//     const defaultData = {
//         primaryColor: '',
//         secondaryColor: '',
//         errorMessageColor: '',
//         buttonBorder: '',
//         buttonBorderRadius: '',
//         buttonColor: '',
//         buttonBackground: ''
//     }

//     try {
//         const configData = getConfigData()
//         if (!configData) return defaultData

//         return {
//             primaryColor: configData?.primaryColor || '',
//             secondaryColor: configData?.secondaryColor || '',
//             errorMessageColor: configData?.errorMessageColor || '',
//             buttonBorder: configData?.buttonBorder || '',
//             buttonBorderRadius: configData?.buttonBorderRadius || '',
//             buttonColor: configData?.buttonColor || '',
//             buttonBackground: configData?.buttonBackground || ''
//         }
//     } catch (error) {
//         console.error('getColorData', error)
//         return defaultData
//     }
// }
