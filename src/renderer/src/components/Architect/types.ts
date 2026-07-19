// Un handle es un punto de conexión con id propio (único dentro del nodo).
// El label es opcional, útil cuando una salida representa una acción
// concreta (ej: "Guardar", "Cancelar").
export interface HandleDef {
    id: string
    label?: string
}

// Un nodo vive en coordenadas del "mundo" (no de pantalla). El viewport
// (pan+zoom) es lo que después las transforma a coordenadas de pantalla.
export interface FlowNode {
    id: string
    x: number
    y: number
    width: number
    height: number
    titulo: string
    color?: string
    entradas?: HandleDef[] // handles a la izquierda (destino). Default: uno solo, id 'in'
    salidas?: HandleDef[] // handles a la derecha (origen). Default: uno solo, id 'out'
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

// Tipos de Nodos. Incluye todos los tipo de pantalla
export enum NodeType {
    idle = 'idle',
    userAction = 'userAction',
    infoScreen = 'infoScreen',
    successScreen = 'successScreen',
    errorScreen = 'errorScreen',
    config = 'config',
    close = 'close'
}

export interface NodeData {
        screenType: NodeType
    }