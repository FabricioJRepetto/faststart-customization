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

    // TODO - Flujo logico dentro de cada nodo
    logicalFlow: string
    //TODO - Components Registry
    ui: string[]
}

export interface NodeAction {
    /** Apunta al registry necesario, Terminal, Service, etc. */
    type: ActionType
    /** TODO - Esta ID tiene que pegar contra el registry de service, terminal, etc.
     * @example Terminal: MixedMedia.Start - Dispenser.Start - etc
     * @example Service: Login.Qr - Login.Bio - etc
     * */
    actionID: string
    /** Posibles outcomes */
    reactions: ReactionType[]
}
export type ActionType = 'userInput' | 'timeout' | 'terminal' | 'service'
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
