import { FlowDiagram } from './fluid_types'

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
        fileName?: string
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

export type FinalAssetType = 'image' | 'svg' | 'video' | 'audio' | 'json' | 'text' | 'unknown'
export interface FinalAssetData {
    name: string
    path: string
    fileType: FinalAssetType
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
    isActive: boolean
    icon: FinalAssetData[]
    image: FinalAssetData[]
    background: FinalAssetData[]
    thirdscreen: ThirdScreendata
    audio: FinalAssetData[]
    styles: FinalStylesData
    language: LanguageData
}

export type Icons =
    | 'icon_logo'
    | 'icon_qr_logo'
    | 'icon_left_arrow'
    | 'icon_right_arrow'
    | 'icon_bills'
    | 'icon_exchange'
    | 'icon_return'
    | 'icon_world'
    | 'icon_button_continue'
    | 'icon_button_confirm'
    | 'icon_button_exit'

export type Images =
    | 'image_insert_bills'
    | 'image_take_bills'
    | 'image_take_ticket'
    | 'image_warning'
    | 'image_oos'
    | 'image_error'
    | 'image_success'
    | 'image_thankyou'
    | 'image_wait'

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
    getDiagramsList: () => Promise<FlowDiagram[] | null>
    getTemplateConfig: () => Promise<TemplateConfig | null>
    getDefaultConfigs: () => Promise<DefaultConfigurations | null>
    getDefaultConfigsFile: () => Promise<DefaultConfigurationsFile | null>
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
    ONLINE,
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
    ip: string
    name: string
    type: WSClientType
    status: WSClientStatus
    lastUpdate: string
    description?: string
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
    id?: string
}

// Fire Task
export enum TASK {
    SYNC_DIAGRAM = 'SYNC_DIAGRAM',
    SYNC_THEME = 'SYNC_THEME',
    SYNC_ADS = 'SYNC_ADS',
    OOS = 'OOS',
    ALERT = 'ALERT',
    REBOOT = 'REBOOT',
    SERVE_LOGS = 'SERVE_LOGS'
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
    | { type: WSMessageType.update_status; data: { status: WSClientStatus; description?: string } }

export interface DefaultConfigurations {
    theme: {
        enabled: boolean
        name: string
        data: CustomConfig
    } | null
    diagram: {
        enabled: boolean
        name: string
        data: FlowDiagram
    } | null
}
export interface DefaultConfigurationsFile {
    error?: string
    theme: {
        enabled: boolean
        name: string
        path: string
    } | null
    diagram: {
        enabled: boolean
        name: string
        path: string
    } | null
}

//______________________________________________________________________
//___________________________ FLOW DIAGRAM _____________________________
//______________________________________________________________________

export interface FlowDiagram {
    name: string
    version: string
    entry: string
    nodes: Record<string, FlowNode>
    edges: EdgesById
}

// Un handle es un punto de conexión con id propio (único dentro del nodo).
// El label es opcional, útil cuando una salida representa una acción
// concreta (ej: "Guardar", "Cancelar").
export interface HandleDef {
    /** @example [NodoID]+[ActionType]+[ActionID]+[ReactionCode] */
    id: string
    label?: string
}

// Un nodo vive en coordenadas del "mundo" (no de pantalla). El viewport
// (pan+zoom) es lo que después las transforma a coordenadas de pantalla.
export interface FlowNode {
    id: string
    flowConfig: {
        x: number
        y: number
        width: number
        height: number
        color?: string
        /** @deprecated */
        entradas?: HandleDef[]
    }
    data: NodeData
}

// Un edge conecta un handle de salida puntual con uno de entrada puntual
// (no solo nodo con nodo), así un nodo con varias salidas puede tener cada
// una yendo a un destino distinto.
export interface FlowEdge {
    id: string
    source: string
    sourceHandle: string
    target: string
    targetHandle: string
}

// Diccionario de edges indexado por id. Agregar/editar/borrar un edge
// puntual es O(1) en vez de recorrer un array con filter/map.
export type EdgesById = Record<string, FlowEdge>

// Estado de la "cámara": x/y es el desplazamiento en píxeles de pantalla,
// zoom es el factor de escala.
export interface Viewport {
    x: number
    y: number
    zoom: number
}

// Conexión en progreso: se está arrastrando desde un handle de salida
// hacia donde sea que esté el mouse ahora (en coordenadas del mundo)
export interface ConnectionDraft {
    sourceNodeId: string
    sourceHandleId: string
    pointer: { x: number; y: number }
}

// Tipos de Pantalla. Incluye todos los tipo de pantalla
export enum ScreenType {
    idle = 'idle',
    config = 'config',
    close = 'close',
    OutOfService = 'OutOfService',
    userAction = 'userAction',
    infoScreen = 'infoScreen',
    successScreen = 'successScreen',
    errorScreen = 'errorScreen'
}

export interface NodeData {
    screenType: Type<ScreenType>
    screenName: string
    /** Flujo/Grupo al que pertenece */
    flow?: string
    /** Timeout de cierre automático */
    timeout: boolean
    /** Variables que necesita del storage */
    storage: string[]
    actions: NodeAction[]
    views: Record<string, UIElement[]>
    subFlow?: FlowDiagram
}

export interface NodeAction {
    /** Apunta al registry necesario, Terminal, Service, etc. */
    type: Type<ActionType>
    /** TODO - Esta ID tiene que pegar contra el registry de service, terminal, etc.
     * @example Terminal: MixedMedia.Start - Dispenser.Start - etc
     * @example Service: Login.Qr - Login.Bio - etc
     * */
    actionID: string
    /** Forma en la que se dispara la acción. Auto: al entrar al nodo, User: cuando el usuario toca un botón, por ejemplo, 'continuar' */
    trigger: { type: 'auto' | 'user' }
    /** Posibles outcomes */
    reactions: ReactionType[]
    /** Flujo lógico */
    steps: LogicalStep[]
}
export enum ActionType {
    user = 'user',
    timeout = 'timeout',
    terminal = 'terminal',
    service = 'service'
}
/** Mantener ID sincronizada con flogConfig.salidas */
export interface ReactionType extends HandleDef {
    /** Este CODE identifica la respuesta que devuelve el registry involucrado.
     * @example Terminal: Dispenser.cashDispenseFailed - MixMedia.mediaCollected - etc
     * @example Service: Login.Error - Login.Ok - etc
     */
    reactionCode: string
    /** ID del Nodo objetivo */
    target?: string
}

export type UIElementType =
    | 'NavigationButton'
    | 'NumericInput'
    | 'TextInput'
    | 'OptionsList'
    | 'Table'
    | 'Information'

interface UIElementBase {
    type: UIElementType
    config: UIElementBaseConfig
    style?: string
}
interface UIElementBaseConfig {
    onAction?: string
    order?: number
    region?: 'header' | 'body' | 'footer'
}

interface UIElementNavigationButton extends UIElementBase {
    type: 'NavigationButton'
    config: NavigationButtonConfig
    style?: string
}
export interface NavigationButtonButtonConfig {
    /** Referencia a un reactionCode (el actionID siempre va a ser 'click') */
    onAction: string
    text: string
    position: 'left' | 'center' | 'right' | 'auto'
    /** Solo necesario para el Architect */
    id: string
}
export interface NavigationButtonConfig {
    buttons: NavigationButtonButtonConfig[]
    region: 'footer'
    order: number
}

interface UIElementNumericInput extends UIElementBase {
    type: 'NumericInput'
    config: NumericInputConfig
    style?: string
}
export interface NumericInputConfig {
    /** Alias con el que se guarda el valor del input */
    storageAlias: string
    obfuscate?: boolean
    minimum?: number
    maximum?: number
    length?: number
    direction?: 'column' | 'row'
    region: 'body'
    order: number
}

interface UIElementTextInput extends UIElementBase {
    type: 'TextInput'
    config: TextInputConfig
    style?: string
}
export interface TextInputConfig {
    /** Alias con el que se guarda el valor del input */
    storageAlias: string
    obfuscate?: boolean
    length?: number
    validator?: string
    region: 'body'
    order: number
}

interface UIElementOptionsList extends UIElementBase {
    type: 'OptionsList'
    config: OptionsListConfig
    style?: string
}
export interface OptionsListConfig {
    region: 'body'
    order: number
    options: OptionsListOptions[]
    overflow?: 'scroll' | 'pagination'
    optionsDirection?: 'horizontal' | 'vertical'
    display?:
        | { type: 'grid'; columns: number; rows: number }
        | { type: 'flex'; direction: 'column' | 'row' }
}
export interface OptionsListOptions {
    /** Solo necesario para el Architect */
    id: string
    /** Referencia a un reactionCode (el actionID siempre va a ser 'click') */
    onAction: string
    text: string
    icon?: { asset: Icons; order?: 'first' | 'last' }
}

interface UIElementTable extends UIElementBase {
    type: 'Table'
    config: TableConfig
    style?: string
}
export interface TableConfig {
    data: string
    region: 'body'
    order: number
}

interface UIElementInformation extends UIElementBase {
    type: 'Information'
    config: InformationConfig
    style?: string
}
export interface InformationConfig {
    title?: string
    subtitle?: string
    text?: string
    illustration?: Images
    region: 'body'
    order: number
}

export type UIelementConfigs =
    | NavigationButtonConfig
    | NumericInputConfig
    | TextInputConfig
    | OptionsListConfig
    | TableConfig
    | InformationConfig

export type UIElement =
    | UIElementNavigationButton
    | UIElementNumericInput
    | UIElementTextInput
    | UIElementOptionsList
    | UIElementTable
    | UIElementInformation

//______________________________________________________________________
//____________________________ FLOW LOGIC ______________________________
//______________________________________________________________________

type StepType = 'getVar' | 'setVar' | 'callService' | 'runService' | 'math' | 'compare' | 'time'

interface BaseLogicalStep {
    id: string
    order: number
    type: StepType
    subtype: string
    value?: unknown
    props?: unknown
}

// _- Time -_
interface TimeoutStep extends BaseLogicalStep {
    type: 'time'
    subtype: 'timeout'
    value: number
}
interface DelayStep extends BaseLogicalStep {
    type: 'time'
    subtype: 'delay'
    value: number
}

type TimeStep = TimeoutStep | DelayStep
type TimeSubtype = 'timeout' | 'delay'

// _- Storage -_
interface GetVarStep extends BaseLogicalStep {
    type: 'getVar'
    subtype: string
}
interface SetVarStep extends BaseLogicalStep {
    type: 'setVar'
    subtype: string
    value?: unknown
}

type StorageStep = GetVarStep | SetVarStep
type StorageSubtype = 'getVar' | 'setVar'

// _- Math -_
interface MathStep extends BaseLogicalStep {
    type: 'math'
    subtype: MathSubtype
}
type MathSubtype = 'max' | 'min' | 'sum' | 'rest'

// _- Comparation -_
interface CompareStep extends BaseLogicalStep {
    type: 'compare'
    subtype: CompareSubtype
}
type CompareSubtype = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'

// _- Service -_
interface ServiceStep extends BaseLogicalStep {
    type: 'callService'
    subtype: ServiceSubtype
}
type ServiceSubtype = 'initial_config' | 'login'

// _- Terminal -_
interface TerminalDispenseStep extends BaseLogicalStep {
    type: 'runService'
    subtype: TerminalSubtype
    props?: {
        amount: number
        currency: string
    }
}
type TerminalSubtype = 'dispense'
type TerminalStep = TerminalDispenseStep
export type TerminalRegistryResult = 'OK' | 'ERROR' | 'TIMEOUT' | 'CANCELLED'

export type LogicalStep =
    | StorageStep
    | MathStep
    | CompareStep
    | TimeStep
    | TerminalStep
    | ServiceStep

