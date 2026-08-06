export interface FlowDiagram {
    version: string
    entry: string
    nodes: Record<string, FlowNode>
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
    userAction = 'userAction',
    infoScreen = 'infoScreen',
    successScreen = 'successScreen',
    errorScreen = 'errorScreen',
    config = 'config',
    close = 'close'
}

export interface NodeData {
    screenType: ScreenType
    screenName: string
    flow?: string
    /** Timeout de cierre automatico */
    timeout: boolean
    /** Variables que necesita del storage */
    storage: string[]
    actions: NodeAction[]
    uiElements: UIElement[]
}

export interface NodeAction {
    /** Apunta al registry necesario, Terminal, Service, etc. */
    type: ActionType
    /** TODO - Esta ID tiene que pegar contra el registry de service, terminal, etc.
     * @example Terminal: MixedMedia.Start - Dispenser.Start - etc
     * @example Service: Login.Qr - Login.Bio - etc
     * */
    actionID: string
    /** Forma en la que se dispara la acción. Auto: al entrar al nodo, User: cuando el usuario toca un botón, por ejemplo, 'continuar' */
    trigger: { type: 'auto' | 'user' }
    // TODO - Flujo logico
    /** Flujo lógico */
    steps: []
    /** Posibles outcomes */
    reactions: ReactionType[]
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
    /** Referencia a un actionID */
    onAction: string
    data: string
    overflow?: 'scroll' | 'pagination'
    region: 'body'
    order: number
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
    illustration?: string
    region: 'body'
    order: number
}

export type UIElement =
    | UIElementNavigationButton
    | UIElementNumericInput
    | UIElementTextInput
    | UIElementOptionsList
    | UIElementTable
    | UIElementInformation
