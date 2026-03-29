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
interface ContextEntryData {
    Type: string
    Value: string
}
export interface AppSettingsConfigModule {
    Contexts: {
        Data: {
            Environment: ContextEntryData
            AudioEnabled: ContextEntryData
            TimerRetryQR: ContextEntryData
            TimerRefreshQR: ContextEntryData
            CustomStylesEnabled: ContextEntryData
            PrimaryColor: ContextEntryData
            SecondaryColor: ContextEntryData
            ErrorMessageColor: ContextEntryData
        }
    }[]
}

type AssetType = 'icon' | 'background' | 'audio' | 'thirdscreen' | 'other'
interface AssetData {
    name: string
    assetType: AssetType
    filePath: string
    customDir: string
    base64: string
    mimeType: string
}
export interface AssetList {
    icon: AssetData[]
    background: AssetData[]
    audio: AssetData[]
    thirdscreen: AssetData[]
    other: AssetData[]
}
