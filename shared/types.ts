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
    fileName: string
    filePath: string
    mimeType: string
    customMimeType: string
}

export enum Screens {
    landing = 'landing',
    main = 'main',
    architect = 'architect',
    test = 'test',
    fileManager = 'fileManager',
    preview = 'preview',
    styles = 'styles',
    icons = 'icons',
    backgrounds = 'backgrounds',
    languages = 'languages',
    thirdScreen = 'thirdScreen',
    audio = 'audio',
    collections = 'collections'
}

export interface BaseLangueage {
    general: {
        button_exit: string
        button_confirm: string
        executingTransaction: string
        clear: string
        printTitle: string
        printSubtitle: string
        menuTitle: string
    }
    idle: { button_start: string }
    info: {
        oos: string
        wait: string
        thankYou: string
        errorTitle: string
        moneyRetracted: string
        contactSupport: string
        welcomeUser: string
    }
    dispense: {
        takeMoney: string
        enterAmount: string
        scanQR: string
        withdrawalOf: string
        notEnoughBillsErrorMessage: string
        amountNotPossibleErrorMessage: string
        recommendedAmount: string
        withdrawOption: string
        withdrawARS: string
        withdrawUSD: string
    }
    exchange: {
        takeMoney: string
        enterAmount: string
        insertMoney: string
        executingTransaction: string
        scanQR: string
        notEnoughBillsErrorMessage: string
        amountNotPossibleErrorMessage: string
        recommendedAmount: string
        PreviewTitle: string
        PreviewSubtitle: string
        Option: string
        noChange: string
        Currency: string
        ConfirmDeposit: string
        AmountTooLowTitle: string
        AmountTooLowSubtitle: string
        InsertMoreBills: string
        USDtoARS: string
        ARStoUSD: string
        PreviewRate: string
        PreviewDepositAmount: string
        PreviewDispenseAmount: string
    }
}
export type LanguageData = Record<string, BaseLangueage>

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
    assetName: string
    custom: {
        /** Path, URL, Blob, Base64, etc. */
        source?: string
        /** Extensión del archivo */
        extension?: string
    }
}

export type AssetType = 'icon' | 'image' | 'background' | 'audio' | 'thirdscreen' | 'other'
export interface AssetData extends AssetDataBase {
    assetName: string
    assetType: AssetType
    original: {
        source?: string
        mime?: string
    }
    custom: {
        source?: string
        file?: File
        fileName?: string
        extension?: string
        mime?: string
    }
}
export interface AssetList {
    icon: AssetData[]
    image: AssetData[]
    background: AssetData[]
    audio: AssetData[]
    thirdscreen: AssetData[]
    other?: AssetData[]
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
    blobUrl?: string
}

export enum StylesParentKeys {
    logo = 'logo',
    idle = 'idle',
    userAction = 'userAction',
    infoScreen = 'infoScreen',
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
    idle: {
        primaryColor: undefined,
        secondaryColor: undefined
    },
    userAction: {
        primaryColor: undefined,
        secondaryColor: undefined,
        errorMessageColor: undefined
    },
    infoScreen: {
        primaryColor: undefined,
        secondaryColor: undefined
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
    idle: {
        primaryColor: string
        secondaryColor: string
    }
    userAction: {
        primaryColor: string
        secondaryColor: string
        errorMessageColor: string
    }
    infoScreen: {
        primaryColor: string
        secondaryColor: string
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
        dark: string | undefined
        light: string | undefined
    }
    idle: {
        primaryColor: string | undefined
        secondaryColor: string | undefined
    }
    userAction: {
        primaryColor: string | undefined
        secondaryColor: string | undefined
        errorMessageColor: string | undefined
    }
    infoScreen: {
        primaryColor: string | undefined
        secondaryColor: string | undefined
    }
    successScreen: {
        primaryColor: string | undefined
        secondaryColor: string | undefined
    }
    errorScreen: {
        primaryColor: string | undefined
        secondaryColor: string | undefined
    }
    button: {
        border: string | undefined
        borderRadius: string | undefined
        color: string | undefined
        background: string | undefined
    }
    secondaryButton: {
        border: string | undefined
        borderRadius: string | undefined
        color: string | undefined
        background: string | undefined
    }
    inputButton: {
        border: string | undefined
        borderRadius: string | undefined
        color: string | undefined
        background: string | undefined
    }
}

export interface ThirdScreendata {
    config: ThirdScreenConfig
    assets: FinalAssetData[]
}
export interface TemplateRawConfig {
    icon: { assetName: string }[]
    image: { assetName: string }[]
    background: { assetName: string }[]
    thirdscreen: { assetName: string }[]
    audio: { assetName: string }[]
    styles: FinalStylesData
    language: LanguageData
}
export interface TemplateConfig {
    icon: AssetData[]
    image: AssetData[]
    background: AssetData[]
    thirdscreen: AssetData[]
    audio: AssetData[]
    styles: FinalStylesData
    language: LanguageData
}

export interface CustomConfig {
    version: string
    ID: string
    themeName: string
    customEnabled: boolean
    isDefaultTheme: boolean
    isActive: boolean
    icon: FinalAssetData[]
    image: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: ThirdScreendata
    audio: FinalAssetData[]
    styles: FinalStylesData
    language: LanguageData
}

export type CustomConfigKey = keyof CustomConfig
interface ThmeBackground {
    base64: string
    mime: string
    blobUrl?: string
}
interface ThemeLogo {
    name: string
    base64: string
    mime: string
}

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
    background: ThmeBackground
    logo: ThemeLogo
}

export interface ThirdScreenConfig {
    intervalSeconds: number
}

export const DefaultThirdConfigData: ThirdScreenConfig = {
    intervalSeconds: 5
}

export interface MediaServiceBase {
    getFiles: () => Promise<DBFile[] | null>
    getThemesList: () => Promise<CustomConfig[] | null>
    getTemplateConfig: () => Promise<TemplateConfig | null>
    getDefaultConfig: () => Promise<CustomConfig | null>
    uploadFile: (file: File | Blob, themeName: string, fileName?: string) => Promise<DBFile | null>
    delete: (path: string) => Promise<boolean>
}

export interface FileForUpload {
    file: File
    assetName: string
}
export interface UploadedFile extends AssetDataBase {
    assetName: string
    custom: {
        source: string
    }
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

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_ WebSocket

export enum WSClientStatus {
    IDLE,
    OPERATING,
    RUNNING_TASK,
    SUPERVISOR,
    OOS,
    MANDATORY_OOS,
    OFFLINE
}

//* <-- Incoming Message
// Type
export enum WSIncomingMessageType {
    login_confirmation = 'login_confirmation',
    update_connections = 'update_connections',
    run_task = 'run_task'
}

// Login Confirm
export interface WSLoginConfim {
    id: string
}

// Update Connections
export interface WSConnectedClient {
    id: string
    name: string
    type: WSClientType
    ip: string
    status: WSClientStatus
    lastUpdate: string
}

// Run Task
export interface WSRunTask {
    task: TASK
}

// Payload
export type WSIncomingMessagePayload =
    | {
          type: WSIncomingMessageType.login_confirmation
          data: { loginID: string }
      }
    | {
          type: WSIncomingMessageType.update_connections
          data: WSConnectedClient[]
      }
    | {
          type: WSIncomingMessageType.run_task
          data: { task: TASK; instruction?: unknown }
      }

//___________________________________

//? Send Message -->
// Type
export enum WSMessageType {
    login = 'login',
    fire_task = 'fire_task',
    update_status = 'update_status'
}

// Login
export type WSClientType = 'terminal' | 'admin'
interface WSClientData {
    name: string
    type: WSClientType
}

// Fire Task
export enum TASK {
    SYNC_THEME = 'SYNC_THEME',
    SYNC_ADS = 'SYNC_ADS',
    OOS = 'OOS',
    ALERT = 'ALERT',
    REBOOT = 'REBOOT'
}
interface WSTaskData {
    task: TASK
    terminals?: string[]
    instruction?: unknown
}

// Payload
export type WSMessagePayload =
    | { type: WSMessageType.login; data: WSClientData }
    | { type: WSMessageType.fire_task; data: WSTaskData }
    | { type: WSMessageType.update_status; data: { status: WSClientStatus } }
