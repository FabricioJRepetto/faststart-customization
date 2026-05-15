export type IpcResponse<T> = Promise<
    | {
          success: true
          data: T
          error?: undefined
      }
    | {
          success: false
          error: string
          data?: undefined
      }
>

export interface IpcResponseFileData {
    base64: string
    filePath: string
    mimeType: string
    customMimeType: string
}

export enum Screens {
    landing = 'landing',
    main = 'main',
    styles = 'styles',
    icons = 'icons',
    backgrounds = 'backgrounds',
    languages = 'languages',
    thirdScreen = 'thirdScreen',
    audio = 'audio',
    collections = 'collections'
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

type AssetType = 'icon' | 'background' | 'audio' | 'thirdscreen' | 'other'
export interface AssetData {
    name: string
    assetType: AssetType
    filePath: string
    customPath: string
    base64: string
    mimeType: string
    customBase64: string
    customMimeType: string
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
    ImgSvg = 'ImgSvg',
    ImgVideo = 'ImgVideo'
}

export interface FinalAssetData {
    name: string
    path: string
    fileType: string
}

export enum StylesParentKeys {
    general = 'general',
    successScreen = 'successScreen',
    errorScreen = 'errorScreen',
    button = 'button',
    secondaryButton = 'secondaryButton'
}
export const DefaultStylesData = {
    logo: {
        primaryColor: '',
        secondaryColor: ''
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
        border: '',
        borderRadius: '',
        color: '',
        background: ''
    },
    secondaryButton: {
        border: '',
        borderRadius: '',
        color: '',
        background: ''
    }
}
export interface FinalStylesData {
    general: {
        primaryColor: string
        secondaryColor: string
        errorMessageColor: string
    }
    successScreen: {
        primaryColor: string
        secondaryColor: string
    }
    errorScreen: {
        primaryColor: string
        secondaryColor: string
    }
    button: {
        border: boolean
        borderRadius: string
        color: string
        background: string
    }
    secondaryButton: {
        border: boolean
        borderRadius: string
        color: string
        background: string
    }
}
export interface StylesData {
    logo: {
        primaryColor: string
        secondaryColor: string
    }
    general: {
        primaryColor: string
        secondaryColor: string
        errorMessageColor: string
    }
    successScreen: {
        primaryColor: string
        secondaryColor: string
    }
    errorScreen: {
        primaryColor: string
        secondaryColor: string
    }
    button: {
        border: string
        borderRadius: string
        color: string
        background: string
    }
    secondaryButton: {
        border: string
        borderRadius: string
        color: string
        background: string
    }
}

export interface CustomConfig {
    version: string
    ID: string
    themeName: string
    customEnabled: boolean
    icon: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: FinalAssetData[]
    audio: FinalAssetData[]
    styles: FinalStylesData
    language: LanguageData
}

export type CustomConfigKey = keyof CustomConfig

export interface ThemeConfig {
    themeName: string
    color: string
    background: {
        base64: string
        mime: string
    }
    logo: {
        base64: string
        mime: string
    }
}
