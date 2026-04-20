export enum Screens {
    landing = 'landing',
    main = 'main',
    styles = 'styles',
    icons = 'icons',
    backgrounds = 'backgrounds',
    languages = 'languages',
    thirdScreen = 'thirdScreen',
    audio = 'audio'
}

export type LanguageData = Record<string, Record<string, string>>

// export interface CustomConfigData {
//     primaryColor: string
//     secondaryColor: string
//     errorMessageColor: string
//     buttonBorder: string
//     buttonBorderRadius: string
//     buttonColor: string
//     buttonBackground: string
// }

export interface AppSettingsData {
    Modules: {
        Assembly: string
        Options?: AppSettingsConfigModule
    }[]
}
interface ContextDataEntry {
    Type: string
    Value: string
}
export interface ConfigContextData {
    Environment: ContextDataEntry
    AudioEnabled: ContextDataEntry
    TimerRetryQR: ContextDataEntry
    TimerRefreshQR: ContextDataEntry
    CustomStylesEnabled: ContextDataEntry
    PrimaryColor: ContextDataEntry
    SecondaryColor: ContextDataEntry
    ErrorMessageColor: ContextDataEntry
}
export interface AppSettingsConfigModule {
    Contexts: {
        Data: ConfigContextData
    }[]
}

export const DefaultStylesData = {
    primaryColor: '',
    secondaryColor: '',
    errorMessageColor: '',
    buttonBorder: '',
    buttonBorderRadius: '',
    buttonColor: '',
    buttonBackground: ''
} as const
export type StylesData = Record<keyof typeof DefaultStylesData, string>

type AssetType = 'icon' | 'background' | 'audio' | 'thirdscreen' | 'other'
export interface AssetData {
    name: string
    assetType: AssetType
    filePath: string
    customPath: string
    base64: string
    customBase64: string
    mimeType: string
}
export interface AssetList {
    icon: AssetData[]
    background: AssetData[]
    audio: AssetData[]
    thirdscreen: AssetData[]
    other: AssetData[]
}

export enum filterType {
    Imagenes = 'Imagenes',
    Videos = 'Videos',
    Audio = 'Audio',
    Todos = 'Todos',
    ImgVideo = 'ImgVideo'
}

export interface FinalAssetData {
    name: string
    original: { path: string; fileType: string } | string
    custom?: { path: string; fileType: string } | string
}

export interface CustomConfig {
    icon: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: FinalAssetData[]
    audio: FinalAssetData[]
    styles: StylesData
    language: LanguageData
}
