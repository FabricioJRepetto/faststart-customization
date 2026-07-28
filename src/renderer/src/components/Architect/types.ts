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
        titulo: string
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
    flow?: string
    timeout: boolean
    /** Variables que necesita del storage */
    storage: string[]
    actions: NodeAction[]

    //TODO - Components Registry
    UIElement: UIElement[]
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

export enum UIElementType {
    NavigationButton = 'NavigationButton',
    NumericInput = 'NumericInput',
    TextInput = 'TextInput',
    OptionsList = 'OptionsList',
    Table = 'Table',
    Information = 'Information'
}
interface UIElementNavigationButton {
    type: UIElementType.NavigationButton
    config: {
        buttons: {
            /** Referencia a un actionID */
            onAction: string
            text: string
            position: 'left' | 'center' | 'right' | 'auto'
        }[]
    }
    style?: string
}

interface UIElementNumericInput {
    type: UIElementType.NumericInput
    config: {
        obfuscate?: boolean
        minimum?: number
        maximum?: number
        length?: number
        validator?: (v: number) => boolean
    }
    style?: string
}
interface UIElementTextInput {
    type: UIElementType.TextInput
    config: {
        obfuscate?: boolean
        length?: number
        validator?: (v: string) => boolean
    }
    style?: string
}
interface UIElementOptionsList {
    type: UIElementType.OptionsList
    config: {
        /** Referencia a un actionID */
        onAction: string
        data: string
        overflow?: 'scroll' | 'pagination'
    }
    style?: string
}
interface UIElementTable {
    type: UIElementType.Table
    config: {
        data: string
    }
    style?: string
}
interface UIElementInformation {
    type: UIElementType.Information
    config: {
        title?: string
        subtitle?: string
        text?: string
        illustration?: string
    }
    style?: string
}
export type UIElement =
    | UIElementNavigationButton
    | UIElementNumericInput
    | UIElementTextInput
    | UIElementOptionsList
    | UIElementTable
    | UIElementInformation
