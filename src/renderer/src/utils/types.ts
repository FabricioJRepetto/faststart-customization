export enum Screens {
    landing = 'landing',
    main = 'main',
    colors = 'colors',
    icons = 'icons',
    backgrounds = 'backgrounds',
    languages = 'languages',
    thirdScreen = 'thirdScreen',
    audio = 'audio'
}

export type LanguageData = Record<string, Record<string, string>>

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

export const DefaultColorsData = {
    PrimaryColor: '',
    SecondaryColor: '',
    ErrorMessageColor: ''
} as const
export type ColorsData = Record<keyof typeof DefaultColorsData, string>

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
    color: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: FinalAssetData[]
    audio: FinalAssetData[]
    language: LanguageData
}
