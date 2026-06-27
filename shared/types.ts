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

export enum DistributionMethod {
    LOCAL = 'LOCAL',
    REMOTE = 'REMOTE'
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
    collections = 'collections',
    thePit = 'thePit'
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

export interface AssetDataBase {
    name: string
    customPath: string
}

export type AssetType = 'icon' | 'background' | 'audio' | 'thirdscreen' | 'other'
export interface AssetData extends AssetDataBase {
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
    logo = 'logo',
    general = 'general',
    successScreen = 'successScreen',
    errorScreen = 'errorScreen',
    button = 'button',
    secondaryButton = 'secondaryButton',
    inputButton = 'inputButton'
}
export const DefaultStylesData = {
    logo: {
        dark: undefined,
        light: undefined
    },
    general: {
        primaryColor: undefined,
        secondaryColor: undefined,
        errorMessageColor: undefined
    },
    successScreen: {
        primaryColor: undefined,
        secondaryColor: undefined
    },
    errorScreen: {
        primaryColor: undefined,
        secondaryColor: undefined
    },
    button: {
        border: undefined,
        borderRadius: undefined,
        color: undefined,
        background: undefined
    },
    secondaryButton: {
        border: undefined,
        borderRadius: undefined,
        color: undefined,
        background: undefined
    },
    inputButton: {
        border: undefined,
        borderRadius: undefined,
        color: undefined,
        background: undefined
    }
}
export interface FinalStylesData {
    logo: {
        dark: string
        light: string
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
    inputButton: {
        border: boolean
        borderRadius: string
        color: string
        background: string
    }
}
export interface StylesData {
    logo: {
        dark: string
        light: string
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
    inputButton: {
        border: string
        borderRadius: string
        color: string
        background: string
    }
}

export interface ThirdScreendata {
    config: ThirdScreenConfig
    assets: FinalAssetData[]
}
export interface CustomConfig {
    version: string
    ID: string
    themeName: string
    customEnabled: boolean
    isDefaultTheme: boolean
    isActive: boolean
    icon: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: ThirdScreendata
    audio: FinalAssetData[]
    styles: FinalStylesData
    language: LanguageData
}

export type CustomConfigKey = keyof CustomConfig

export interface ThemeConfig {
    themeName: string
    customEnabled: boolean
    isDefaultTheme: boolean
    isActive: boolean
    color: {
        primaryColor: string
        secondaryColor: string
        errorMessageColor: string
    }
    background: {
        base64: string
        mime: string
    }
    logo: {
        base64: string
        mime: string
    }
}

export interface ThirdScreenConfig {
    intervalSeconds: number
}

export const DefaultThirdConfigData: ThirdScreenConfig = {
    intervalSeconds: 5
}

export interface MediaServiceBase {
    getThemesList: () => Promise<CustomConfig[] | null>
    getDefaultConfig: () => Promise<CustomConfig | null>
    uploadFile: (file: File | Blob, themeName: string, fileName?: string) => Promise<DBFile | null>
    delete: (path: string) => Promise<boolean>
}

export interface FileForUpload {
    file: File
    assetName: string
}
export interface UploadedFile extends AssetDataBase {
    name: string
    customPath: string
}

export enum UPLOAD_STAGE {
    NAME = 'name',
    PROCESSING = 'processing',
    UPLOADING = 'uploading',
    FINISHING = 'finishing',
    DONE = 'done',
    ERROR = 'error',
    NOTHING_TO_DO = 'nothingToDo'
}

//_-_-_-_-_-_-_- TEMPORAL _-_-_-_-_-_-_-
export interface DBFile {
    /** Nombre del archivo */
    name: string
    /** Path, muestra subcarpetas si hay. @example test/bbva_sparks.png */
    path: string
    /** URL sin la Base. @example /files/test/bbva_sparks.png */
    url: string
    /** Tamaño del archivo */
    sizeBytes: number
    /** ISO string */
    modified: string
}
export interface DBTheme {
    name: string
    config: DBFile
    assets: DBFile[]
}
export interface RawDBFilesListRes {
    count: number
    files: DBFile[]
}

export interface RawDBUploadFileRes {
    ok: number
    file: DBFile
}
