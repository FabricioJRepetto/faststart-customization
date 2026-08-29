import { FlowNode, HandleDef } from "@renderer/types/types"

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

// Redondea un valor al múltiplo más cercano del tamaño de grilla
export function snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize
}

const DEFAULT_ENTRADAS: HandleDef[] = []
const DEFAULT_SALIDAS: HandleDef[] = []

// Devuelve la lista de handles de un lado del nodo. Si el nodo no define
// entradas/salidas custom, cae a un único handle por default.
export function getNodeHandles(node: FlowNode, type: 'entrada' | 'salida'): HandleDef[] {
    if (type === 'entrada') return DEFAULT_ENTRADAS
    // return node.flowConfig?.salidas || DEFAULT_SALIDAS
    return node.data.actions.flatMap(a => a.reactions) || DEFAULT_SALIDAS
}

// Posición absoluta (en coordenadas del "mundo") de un handle puntual,
// identificado por su id. Los handles de un mismo lado se reparten
// equiespaciados verticalmente (mismo criterio que usa NodeView para
// dibujarlos, así quedan siempre alineados).
export function getHandlePosition(
    node: FlowNode,
    handleId: string,
    type: 'entrada' | 'salida' = 'salida'
): { x: number; y: number } {
    if (type === 'entrada') {
        return {
            x: node.flowConfig.x,
            y: node.flowConfig.y + node.flowConfig.height / 2
        }
    }

    const handles = getNodeHandles(node, type)
    const index = Math.max(
        0,
        handles.findIndex((h) => h.id === handleId)
    )
    // const offset = (index + 1) / (handles.length + 1)
    const offset = node.flowConfig.height * 1.5
    const Ypos = node.flowConfig.height * index
    return {
        x: node.flowConfig.x + node.flowConfig.width,
        y: node.flowConfig.y + offset + Ypos
    }
}

// Genera el `d` de un <path> SVG en curva bezier entre dos puntos.
// Las tangentes salen horizontales de cada nodo (mismo criterio que usan
// la mayoría de los editores de flujo): más separación entre los puntos
// -> curva más "abierta".
export function getBezierPath(
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number
): string {
    const distance = Math.abs(targetX - sourceX)
    const controlOffset = Math.max(distance * 0.5, 50)
    const c1x = sourceX + controlOffset
    const c2x = targetX - controlOffset
    return `M ${sourceX},${sourceY} C ${c1x},${sourceY} ${c2x},${targetY} ${targetX},${targetY}`
}
